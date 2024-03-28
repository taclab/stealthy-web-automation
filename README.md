# Stealthy Web Automation, Generic Login and Submission Script

This script automates the login and submission process for accessing a website and performing specific actions, including handling two-factor authentication.

## Prerequisites

- Node.js installed on your system.
- Ensure `playwright-extra`, `otpauth`, and `puppeteer-extra-plugin-stealth` are installed.

```bash
npm install playwright-extra puppeteer-extra-plugin-stealth otpauth
```

## Usage
Ensure you have provided your credentials and any necessary information within the script.
Run the script using Node.js:

```bash
node --experimental-modules index-module-stealth.mjs   
```

## Description
This script automates the process of logging in to a website and submitting the necessary information. It performs the following steps:

- Launches a Chromium browser instance with stealth mode enabled.
- Navigates to the login page.
- Fills in the login form with the provided credentials.
- Submits the login form.
- Checks for two-factor authentication and fills in the verification code if required.
- Navigates to a specified post-login URL.
- Selects the desired location and accepts the terms.
- Submits the form.