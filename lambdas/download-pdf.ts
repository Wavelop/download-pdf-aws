
import puppeteer from "puppeteer-serverless";

export const main = async (event: any, context: any): Promise<any> => {
    let browser = null;
    let pdf = null;

    try {
      browser = await puppeteer.launch({});
      const page = await browser.newPage();
      await page.setContent("<html><body><p>Test</p></body></html>", {
        waitUntil: "load",
      });

      pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        margin: {
          top: 40,
          right: 0,
          bottom: 40,
          left: 0,
        },
        headerTemplate: `
          <div style="border-bottom: solid 1px gray; width: 100%; font-size: 11px;
                padding: 5px 5px 0; color: gray; position: relative;">
          </div>`,
        footerTemplate: `
          <div style="border-top: solid 1px gray; width: 100%; font-size: 11px;
              padding: 5px 5px 0; color: gray; position: relative;">
              <div style="position: absolute; right: 20px; top: 2px;">
                <span class="pageNumber"></span>/<span class="totalPages"></span>
              </div>
          </div>
        `,
      });
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

  return {
    headers: {
      'Content-type': 'application/pdf',
      'content-disposition': 'attachment; filename=test.pdf'
    },
    statusCode: 200,
    body: pdf.toString('base64'),
    isBase64Encoded: true
  }
}
