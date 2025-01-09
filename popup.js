// Function to format the timestamp into a user-friendly string
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Converts to a readable date and time string
}

// Function to display the price history in a Bootstrap table
function showHistory(url) {
  chrome.storage.local.get('items', (data) => {
    const history = data.items[url]?.history || [];
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = ''; // Clear previous data

    // Add rows to the table
    history.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
         <td>${formatTimestamp(entry.timestamp)}</td>
        <td>${entry.price}</td>
      `;
      tableBody.appendChild(row);
    });

    // Show the modal
    const historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
    historyModal.show();
  });
}

// Function to delete an item
function deleteItem(url) {
  chrome.runtime.sendMessage({ type: 'DELETE_ITEM', url }, (response) => {
    if (response && response.success) {
      alert('Item deleted successfully!');
      location.reload(); // Refresh the popup to reflect the changes
    } else {
      alert(response?.message || 'Failed to delete item.');
    }
  });
}

// Function to pause/resume monitoring for an item
function togglePauseItem(url) {
  chrome.runtime.sendMessage({ type: 'TOGGLE_PAUSE', url }, (response) => {
    if (response && response.success) {
      alert(`Monitoring ${response.paused ? 'paused' : 'resumed'} for ${url}`);
      location.reload(); // Refresh the popup to reflect the changes
    } else {
      alert(response?.message || 'Failed to toggle pause state.');
    }
  });
}

// Load saved items on popup open
chrome.storage.local.get(['items', 'interval'], (data) => {
  const itemsContainer = document.getElementById('items');
  for (const [url, item] of Object.entries(data.items || {})) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = `
      <strong>URL:</strong> <a href="${url}" target="_blank" class="url-link">LINK TO ITEM</a><br>
      <strong>Current Price:</strong> ${item.history[item.history.length - 1]?.price || 'N/A'}<br>
      <div class="button-group">
        <button data-url="${url}" class="show-history btn btn-success btn-sm">History</button>
        <button data-url="${url}" class="pause-item btn btn-warning btn-sm">${item.paused ? 'Resume' : 'Pause'}</button>
        <button data-url="${url}" class="delete-item btn btn-danger btn-sm">Delete</button>
      </div>
    `;
    itemsContainer.appendChild(itemDiv);
  }

  // Add event listeners to all "Show History" buttons
  const showHistoryButtons = document.querySelectorAll('button.show-history');
  showHistoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const url = button.getAttribute('data-url');
      showHistory(url);
    });
  });

  // Add event listeners to all "Pause Monitoring" buttons
  const pauseButtons = document.querySelectorAll('button.pause-item');
  pauseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const url = button.getAttribute('data-url');
      togglePauseItem(url);
    });
  });

  // Add event listeners to all "Delete Item" buttons
  const deleteButtons = document.querySelectorAll('button.delete-item');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const url = button.getAttribute('data-url');
      deleteItem(url);
    });
  });

  // Set the interval select value
  if (data.interval) {
    document.getElementById('intervalSelect').value = data.interval;
  }
});

// Handle adding new items
document.getElementById('addButton').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value;
  if (url) {
    chrome.runtime.sendMessage({ type: 'ADD_ITEM', url }, (response) => {
      if (response && response.success) {
        alert('Item added successfully!');
        location.reload(); // Refresh the popup to show the new item
      } else {
        alert(response?.message || 'Failed to add item.');
      }
    });
  }
});

// Handle setting the interval
document.getElementById('setIntervalButton').addEventListener('click', () => {
  const interval = document.getElementById('intervalSelect').value;
  chrome.storage.local.set({ interval }, () => {
    chrome.runtime.sendMessage({ type: 'SET_INTERVAL', interval }, (response) => {
      if (response && response.success) {
        alert('Interval set successfully!');
      } else {
        alert('Failed to set interval.');
      }
    });
  });
});