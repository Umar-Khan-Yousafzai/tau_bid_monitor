// Function to extract the price
function getPrice() {
    const priceElement = document.querySelector('.price'); // Use the correct selector
    return priceElement ? priceElement.innerText.trim() : null;
  }
  
  // Check if the current URL is being monitored
  chrome.runtime.sendMessage({ type: 'CHECK_URL', url: window.location.href }, (response) => {
    if (response && response.monitored) {
      console.log('This URL is being monitored:', window.location.href);
  
      // Observe changes to the DOM
      const observer = new MutationObserver(() => {
        const price = getPrice();
        if (price) {
          console.log('Price detected:', price);
          chrome.runtime.sendMessage({ type: 'PRICE_UPDATE', price, url: window.location.href });
          observer.disconnect(); // Stop observing once the price is found
        }
      });
  
      // Start observing the document
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      console.log('This URL is not being monitored:', window.location.href);
    }
  });