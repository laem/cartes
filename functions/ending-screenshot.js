const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context) => {
	const pageToScreenshot = event.queryStringParameters.pageToScreenshot

	const browser = await chromium.puppeteer.launch({
		executablePath: await chromium.executablePath,
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		headless: chromium.headless,
	})

	const page = await browser.newPage()

	await page.goto(pageToScreenshot)

	const screenshot = await page.screenshot({ encoding: 'binary' })

	await browser.close()

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: `Complete screenshot of ${pageToScreenshot}`,
			buffer: screenshot,
		}),
	}
}
