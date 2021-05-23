const puppeteer = require('puppeteer')
const selectors = require('../src/selectors')

var baseUrl = 'https://test.webtech.by/vac-system/'

var dateFrom = '2021-12-11'
var dateTo = '2021-12-15'

describe("Vacation System", () => {

  test("Open main page, check title and elements", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.title().then(title => {expect(title).toBe('Vacation System')})
      const addButton = await page.$eval(selectors.addVacationButton, el => el.textContent)
      expect(addButton).toContain('add')
      const vacationsTable = await page.$eval(selectors.tableWithVacation, el => (el ? true : false))
      expect(vacationsTable).toBe(true)
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Click Add vacation and check pop-up elements", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      const popupTitle = await page.$eval(selectors.popupTitle, el => el.textContent)
      expect(popupTitle).toContain('Add new vacation?')
      const checkBox = await page.$eval(selectors.checkBox, el => (el ? true : false))
      expect(checkBox).toBe(true)
      const checkboxTitle = await page.$eval(selectors.checkBoxTitle, el => el.textContent)
      expect(checkboxTitle).toContain('No objections from my manager')
      const inputFrom = await page.$eval(selectors.inputFrom, el => (el ? true : false))
      expect(inputFrom).toBe(true)
      const inputTo = await page.$eval(selectors.inputTo, el => (el ? true : false))
      expect(inputTo).toBe(true)
      const cancelButton = await page.$eval(selectors.cancelButton, el => el.textContent)
      expect(cancelButton).toContain('Cancel')
      const saveButton = await page.$eval(selectors.saveButton, el => el.textContent)
      expect(saveButton).toContain('Save')
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Add valid vacation", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      await page.click(selectors.checkBox)
      await page.type(selectors.inputFrom, dateFrom)
      await page.type(selectors.inputTo, dateTo)
      await page.click(selectors.saveButton)
      const togle = await page.$eval(selectors.closeVacTogle, el => (el ? true : false))
      expect(togle).toBe(true)
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Add vacation and close it", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      await page.click(selectors.checkBox)
      await page.type(selectors.inputFrom, dateFrom)
      await page.type(selectors.inputTo, dateTo)
      await page.click(selectors.saveButton)
      const togle = await page.$eval(selectors.closeVacTogle, el => (el ? true : false))
      expect(togle).toBe(true)
      await page.click(selectors.closeVacTogle)
      const status = await page.$eval(selectors.status, el => el.textContent)
      expect(status).toContain('closed')
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Add vacation without selected checkbox", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      await page.type(selectors.inputFrom, dateFrom)
      await page.type(selectors.inputTo, dateTo)
      await page.click(selectors.saveButton)
      const status = await page.$eval(selectors.errorMessage, el => el.textContent)
      expect(status).toContain('There should be no objections from your manager.')
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Add vacation without info", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      await page.click(selectors.saveButton)
      const status = await page.$eval(selectors.errorMessage, el => el.textContent)
      expect(status).toContain('"To" field is required.')
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Add vacation without To date", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      await page.type(selectors.inputFrom, dateFrom)
      await page.click(selectors.saveButton)
      const status = await page.$eval(selectors.errorMessage, el => el.textContent)
      expect(status).toContain('"To" field is required.')
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Add vacation without From date", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      await page.click(selectors.checkBox)
      await page.type(selectors.inputTo, dateTo)
      await page.click(selectors.saveButton)
      const status = await page.$eval(selectors.errorMessage, el => el.textContent)
      expect(status).toContain('"From" is required.')
      await page.deleteCookie()
      await browser.close()
    });
  });

  test("Add vacation with date To < date From", async () => {
    puppeteer.launch({headless:false}).then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ slowMo: 80, width: 1280, height: 800 })
      await page.goto(baseUrl)
      await page.click(selectors.addVacationButton)
      await page.waitForSelector(selectors.popupTitle)
      await page.click(selectors.checkBox)
      await page.type(selectors.inputFrom, dateTo)
      await page.type(selectors.inputTo, dateFrom)
      await page.click(selectors.saveButton)
      const status = await page.$eval(selectors.errorMessage, el => el.textContent)
      expect(status).toContain('You are unable to set To date before From.')
      await page.deleteCookie()
      await browser.close()
    });
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 10000));
  });
});  