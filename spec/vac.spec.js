const puppeteer = require('puppeteer');

describe("Vacation System", () => {

  test("Open main page and check elements", async () => {

    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage();
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto('https://test.webtech.by/vac-system/');
      await page.click("#add-new-vac")
      await page.waitForSelector('h4.mdl-dialog__title')
      await page.screenshot({ path: 'example.png' });
      await browser.close();
          });
        });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 10000));
  });
});  