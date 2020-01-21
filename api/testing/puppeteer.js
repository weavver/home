// const {Builder, By, Key, until} = require('selenium-webdriver');

// const webdriver = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');


describe('Weavver Accounts', function() {
     describe('Browser Test', function() {

          xit('email required', function() {
               const puppeteer = require('puppeteer');
               (async () => {
                    const browser = await puppeteer.launch(   {headless: false}     );
                    try {
                         const page = await browser.newPage();
                         await page.setDefaultNavigationTimeout(5000);
                         await page.goto('http://localhost:8080');
                         await page.screenshot({path: 'example.png'});
                         await page.$eval('input[formcontrolname=email]', el => el.value = 'test@example.com');
                         await page.$eval('input[formcontrolname=password]', el => el.value = '12341234');
                         await page.$eval('#login', el => el.click());
                         await page.waitForFunction(
                              'document.querySelector("#card_title").innerText.includes("Profile")'
                         );

                         await page.$eval('input[formcontrolname=name_first]', el => el.value = 'John');
                         await page.$eval('input[formcontrolname=name_last]', el => el.value = 'Appleseed');
                         await page.$eval('div[title=Settings]', el => el.click());
                    }
                    finally {
                         await browser.close();
                    }
               })();
          });
     });
});
