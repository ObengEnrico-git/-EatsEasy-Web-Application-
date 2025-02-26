
const puppeteer = require("puppeteer");

let browserInstance;

async function getBrowser() {
  if (!browserInstance) {
    
    browserInstance = await puppeteer.launch({
      
    });
    console.log("Launched a new Puppeteer browser instance");
  }
  return browserInstance;
}

module.exports = { getBrowser };
