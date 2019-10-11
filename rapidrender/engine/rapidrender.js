const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

  async function renderHTML(templateHtml,data)
  {
    var template = handlebars.compile(templateHtml);
    var html = template(data);
    return html;

  }
  async function createPDF(data,templateHtml,screenshot = false){

  var html = await renderHTML(templateHtml,data);

  var milis = new Date();
  milis = milis.getTime();

  var filename = `${milis}`;
  var pdfPath = path.join('public/pdf', filename);

  var options = {
   // width: '1230px',
   // headerTemplate: "<p></p>",
   // footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    fullPage: true,
    margin: {
      top: "10px",
      bottom: "30px",
      left: "30px",
      right: "30px"
    },
    printBackground: true,
    path: pdfPath
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
  });

  var page = await browser.newPage();

  await page.setContent(`${html}`, {
    waitUntil: ['domcontentloaded', 'networkidle0']
  });
  console.log('screen',screenshot)
  if(screenshot)
  {
    filename += '.jpeg';
    options.path += '.jpeg';
    options.type = 'jpeg';
    options.quality = 30;

    await page.screenshot(options);
  }
  else
  {
    filename += '.pdf';
    options.path += '.pdf';
    await page.pdf(options);
  }

  await browser.close();

  return filename;
}

module.exports = {
  createPDF,
  renderHTML
};

// const data = {
// 	title: "A new Brazilian School",
// 	date: "05/12/2018",
// 	name: "Rodolfo Luis Marcos",
// 	age: 28,
// 	birthdate: "12/07/1990",
// 	course: "Computer Science",
// 	obs: "Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce."
// }

//createPDF(data);
