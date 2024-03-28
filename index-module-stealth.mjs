import { chromium } from 'playwright-extra';
import * as OTPAuth from "otpauth";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

async function loginAndSubmit(loginUrl, username, password, totpSecret, verificationSelector, submitButtonSelector, postLoginUrl, locationSelector, locationValue, termsSelector, submitFormSelector) {
  chromium.use(StealthPlugin());

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
  const page = await context.newPage();

  try {
    // Load the login page
    await page.goto(loginUrl);
    console.log(`GO TO - ${loginUrl}`);
    
    // Fill in the login form
    await page.fill('#hash_qid', username);
    await page.fill('#hash_password', password);

    // Click the login button
    await Promise.all([
      page.waitForNavigation(), // Wait for navigation to complete
      page.click(submitButtonSelector), // Click the login button
    ]);
    console.log(`SUBMIT - ${loginUrl}`);

    // Wait for a short delay to ensure the page is loaded
    await page.waitForTimeout(2000);
    let totp = new OTPAuth.TOTP({
      issuer: "Account",
      label: "Account",
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: totpSecret,
    });
    console.log();

    // Check if the two-step verification page is displayed
    const verifyCodeSection = await page.$(verificationSelector);
    if (verifyCodeSection) {
      // If the two-step verification page is displayed, handle the second factor
      console.log("Handling the second factor...");

      // Fill in the verification code
      await page.fill('input[type="tel"][maxlength="6"].must-fill', totp.generate());
      // Click the verification button
      await Promise.all([
        page.waitForNavigation(), // Wait for navigation to complete
        page.click('button.q-btn-primary'), // Click the verification button
      ]);
    }

    await page.waitForTimeout(3000);
    await page.screenshot({ path: `login.png` });

    // Load the specified URL after login
    await page.goto(postLoginUrl);
    console.log(`GO TO - ${postLoginUrl}`);
    await page.waitForTimeout(1000);
    await page.locator('button.close-login-popup').click();

    // Select the location
    await page.selectOption(locationSelector, locationValue);
    console.log(locationSelector);
    await page.getByText(termsSelector).click();
    console.log(termsSelector);

    // Submit the form
    await Promise.all([
      page.waitForNavigation(), // Wait for navigation to complete
      page.click(submitFormSelector), // Click the submit button
    ]);

    // Capture the screen once the operation is complete with a filename including a timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const screenshotPath = `screenshot_${timestamp}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved as: ${screenshotPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
    console.log("Browser Close");
  }
}

(async () => {
  const loginUrl = 'https://example.com/login';
  const username = 'your-username';
  const password = 'your-password';
  const totpSecret = 'your-totp-secret';
  const verificationSelector = '.content-section[ng-show="page_status == \'verify_code\'"]';
  const submitButtonSelector = 'button[type="submit"]';
  const postLoginUrl = 'https://example.com/post-login';
  const locationSelector = '#select_location';
  const locationValue = 'your-location';
  const termsSelector = 'By joining the event and';
  const submitFormSelector = '#submitBtn';

  await loginAndSubmit(loginUrl, username, password, totpSecret, verificationSelector, submitButtonSelector, postLoginUrl, locationSelector, locationValue, termsSelector, submitFormSelector);
})();