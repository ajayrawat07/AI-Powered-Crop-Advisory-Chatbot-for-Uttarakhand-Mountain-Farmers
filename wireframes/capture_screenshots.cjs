const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const PAGES = [
  { name: "Home", path: "" },
  { name: "Dashboard", path: "dashboard" },
  { name: "About", path: "about" },
  { name: "Login", path: "login" },
  { name: "Components", path: "components" }
];

const VIEWPORTS = [
  { name: "Mobile", width: 375, height: 812 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1440, height: 900 }
];

const THEMES = ["Light", "Dark"];

const BASE_URL = "http://localhost:5175";
const OUTPUT_DIR = path.join(__dirname, "screenshots");
const FINAL_PDF_PATH = path.join(__dirname, "W3_ResponsiveScreenshots_ajayrawat07.pdf");

async function captureAll() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  const screenshotFiles = [];

  for (const viewport of VIEWPORTS) {
    for (const pageInfo of PAGES) {
      for (const theme of THEMES) {
        console.log(`Capturing: ${viewport.name} | ${pageInfo.name} | ${theme}`);
        
        // Set viewport size
        await page.setViewport({
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1
        });

        // Navigate to page with theme query parameter
        const url = `${BASE_URL}/${pageInfo.path}?theme=${theme.toLowerCase()}`;
        
        try {
          await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
        } catch (e) {
          console.warn(`Navigation warning, retrying with networkidle2: ${e.message}`);
          await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
        }

        // Additional delay for React rendering & CSS transitions
        await new Promise(resolve => setTimeout(resolve, 1500));

        const fileName = `W3_Responsive_Screenshots_${viewport.name}_${pageInfo.name}_${theme}.png`;
        const filePath = path.join(OUTPUT_DIR, fileName);

        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`Saved: ${fileName}`);
        
        screenshotFiles.push({
          viewport: viewport.name,
          page: pageInfo.name,
          theme: theme,
          fileName: fileName,
          width: viewport.width,
          height: viewport.height
        });
      }
    }
  }

  // Create HTML template referencing all captured screenshots
  console.log("Generating HTML compilation...");
  const htmlContent = generateHtml(screenshotFiles);
  const htmlPath = path.join(__dirname, "screenshots_compilation.html");
  fs.writeFileSync(htmlPath, htmlContent);

  // Generate PDF from the HTML compilation
  console.log("Generating final PDF...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  
  await page.pdf({
    path: FINAL_PDF_PATH,
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm",
      bottom: "10mm",
      left: "10mm",
      right: "10mm"
    }
  });

  console.log(`PDF saved successfully to: ${FINAL_PDF_PATH}`);
  await browser.close();
}

function generateHtml(files) {
  let itemsHtml = "";
  for (const file of files) {
    itemsHtml += `
      <div class="screenshot-page">
        <h2>${file.viewport} Viewport (${file.width}px) - ${file.page} Page [${file.theme} Mode]</h2>
        <div class="meta">File: ${file.fileName}</div>
        <div class="img-container">
          <img src="screenshots/${file.fileName}" alt="${file.page} - ${file.viewport} - ${file.theme}" />
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Responsive Screenshots Compilation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f3f4f6;
          color: #1f2937;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
          color: #111827;
        }
        .screenshot-page {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          page-break-after: always;
        }
        h2 {
          font-size: 18px;
          margin-top: 0;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
          color: #374151;
        }
        .meta {
          font-family: monospace;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 15px;
        }
        .img-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #f9fafb;
          border: 1px dashed #d1d5db;
          padding: 10px;
          border-radius: 6px;
        }
        img {
          max-width: 100%;
          max-height: 800px;
          height: auto;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .screenshot-page {
            box-shadow: none;
            border: none;
            padding: 0;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <h1>Crop Advisory Chatbot - Responsive Screenshots Submission</h1>
      <p style="text-align: center; color: #4b5563; margin-bottom: 40px;">
        Student / Intern ID: ajayrawat07 | Date: June 22, 2026
      </p>
      ${itemsHtml}
    </body>
    </html>
  `;
}

captureAll().catch(err => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
