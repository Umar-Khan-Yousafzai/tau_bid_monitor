let items = {};
console.log('Service worker started.');

// Load saved items on startup
chrome.storage.local.get('items', (data) => {
  if (data.items) {
    items = data.items;
  }
});

// Function to extract the price using a content script
async function fetchPrice(url) {
  try {
    // Open the tau-trade product page in a new tab
    const tab = await chrome.tabs.create({ url, active: false });

    // Wait for the page to load
    await new Promise((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      });
    });

    // Inject a content script to extract the price
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const priceElement = document.querySelector('.price'); // Use the correct selector
        return priceElement ? priceElement.innerText.trim() : null;
      },
    });

    // Close the tab
    await chrome.tabs.remove(tab.id);

    // Return the price
    return results[0].result;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}

// Function to monitor a product URL
async function monitorProduct(url) {
  const price = await fetchPrice(url);
  if (price) {
    if (!items[url]) {
      items[url] = { history: [], paused: false };
    }
    const lastPrice = items[url].history[items[url].history.length - 1]?.price;
    if (lastPrice !== price && !items[url].paused) { // Only update if not paused
      items[url].history.push({ price, timestamp: new Date().toISOString() });
      chrome.storage.local.set({ items }); // Save to local storage
    }
  }
}

// Set up periodic monitoring
chrome.alarms.create('monitorPrices', { periodInMinutes: 0.166 }); // Every 10 seconds
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'monitorPrices') {
    for (const url of Object.keys(items)) {
      if (!items[url].paused) { // Only monitor if not paused
        monitorProduct(url);
      }
    }
  }
});

// Handle messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_URL') {
    const url = message.url;
    const monitored = items[url] !== undefined && !items[url].paused; // Respect paused state
    sendResponse({ monitored });
  } else if (message.type === 'DELETE_ITEM') {
    const url = message.url;
    if (items[url]) {
      delete items[url]; // Remove the item from the in-memory object
      chrome.storage.local.set({ items }, () => {
        sendResponse({ success: true });
      });
    } else {
      sendResponse({ success: false, message: 'Item not found.' });
    }
    return true; // Required to use sendResponse asynchronously
  } else if (message.type === 'TOGGLE_PAUSE') {
    const url = message.url;
    if (items[url]) {
      items[url].paused = !items[url].paused; // Toggle paused state
      chrome.storage.local.set({ items }, () => {
        sendResponse({ success: true, paused: items[url].paused });
      });
    } else {
      sendResponse({ success: false, message: 'Item not found.' });
    }
    return true; // Required to use sendResponse asynchronously
  }
  return true; // Required to use sendResponse asynchronously
});

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ADD_ITEM') {
    const url = message.url;
    if (!items[url]) {
      items[url] = { history: [], paused: false };
      chrome.storage.local.set({ items }); // Save to local storage
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: 'Item already exists.' });
    }
  }
  return true; // Required to use sendResponse asynchronously
});

// Log when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed.');
});

// Log when an alarm is triggered
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);
});