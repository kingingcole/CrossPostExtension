## CrossPost

## Description

A Chrome extension for cross-posting to Twitter and LinkedIn.

### Prerequisites

Node.js (version 18 or higher)
Twitter Developer Account
LinkedIn Developer Account

### Installation

Install the dependencies:

`npm install`

Create a `secrets.js` file in the `src` directory and add the following environment variables:

```
TWITTER_CLIENT_ID=your_twitter_client_id
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_API_SECRET=your_linkedin_client_secret
```

### Twitter API Setup
Create a Twitter Developer Account:

Visit the Twitter Developer Portal and sign in with your Twitter account.
Follow the instructions to create a developer account.
Create a Twitter App:

Go to the Twitter Developer Dashboard and create a new project.
Generate API keys (Consumer Key and Consumer Secret) for your app.
Copy the Consumer Key and Consumer Secret values to the `secrets.js` file.

### LinkedIn API Setup

Create a LinkedIn Developer Account:

Visit the LinkedIn Developer Portal and sign in with your LinkedIn account.
Follow the instructions to create a developer account.
Create a LinkedIn App:

Go to the LinkedIn Developer Console and create a new app.
Configure the app settings and permissions as required.
Generate the Client ID and Client Secret for your app.
Copy the Client ID and Client Secret values to the `secrets.js` file.

### Usage

Run the project:


`npm run build`
This will generate a `dist` folder containing the `manifest.json` and other files for this extension. Navigate to `chrome://extensions/` and click on "Load unpacked" and then select this `dist` folder.

Contributing
Contributions are welcome! If you have any improvements or suggestions, feel free to submit a pull request.

License
MIT License