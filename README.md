# Tau-Trade Auction Monitor

Tau-Trade Auction Monitor is a Chrome Extension designed to help users monitor and track product prices on the Tau-Trade platform. The extension provides functionalities to track price changes, view price history, and manage monitored items easily through an intuitive popup interface.

## Features

- **Monitor Product Prices**: Automatically track price changes for products on Tau-Trade.
- **Price History**: View a detailed history of price changes in a tabular format.
- **Pause Monitoring**: Temporarily stop monitoring a product without losing its data.
- **Delete Items**: Remove items from the monitoring list.
- **Real-Time Notifications**: Get notified of price updates instantly.
- **Bootstrap Integration**: A clean and responsive UI powered by Bootstrap.

## Installation

1. Clone or download the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** and select the folder containing the extension's files.
5. The extension will now appear in your extensions list.

## Usage

1. Navigate to any product page on Tau-Trade.
2. Click on the Tau-Trade Auction Monitor extension icon in the toolbar.
3. Enter the product URL in the input field and click **Add Item** to start monitoring.
4. Use the provided buttons to:
   - View price history.
   - Pause/resume monitoring.
   - Delete the item from monitoring.

## Technical Overview

### Manifest
- **Manifest Version**: 3
- Permissions:
  - `storage`
  - `alarms`
  - `scripting`
  - `tabs`
  - Host permissions: `*://*.tau-trade.com/*`
- **Background Script**: `background.js`

### Content Script
- Extracts price information dynamically from the product pages on Tau-Trade using DOM observation.

### Popup Interface
- **HTML**: Displays monitored items and provides controls for managing them.
- **JavaScript**: Handles interactions such as adding items, showing history, pausing monitoring, and deleting items.

### Background Service Worker
- Periodically fetches product prices and updates their histories.
- Communicates with the content and popup scripts to handle user actions and synchronize data.

### Local Storage
- Stores monitored items, their histories, and paused states for persistence.

## Project Files

- `manifest.json`: Metadata and configurations for the extension.
- `background.js`: Handles background tasks such as periodic monitoring and inter-script communication.
- `content.js`: Extracts price data dynamically from Tau-Trade product pages.
- `popup.js`: Manages the UI logic for user interactions.
- `popup.html`: Provides the user interface for managing monitored items.
- `bootstrap.min.css` & `bootstrap.bundle.min.js`: Used for styling and modal interactions.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for new features or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built using the Chrome Extensions API.
- UI styled with [Bootstrap](https://getbootstrap.com/).
- Inspired by the need for efficient and user-friendly auction monitoring tools.

---

For any issues or feature requests, please contact [Umer Farooq Khan](mailto:umerfarooqkhan325@gmail.com).
