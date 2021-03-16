const chromium = require('chrome-aws-lambda')

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
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

	await timeout(2000)

	const element = await page.$('#shareImage')

	const b64string = await element.screenshot({ encoding: 'base64' })

	await browser.close()

	return {
		statusCode: 200,
		headers: { 'Content-Type': 'image/png' },
		body: b64string.toString(),
		isBase64Encoded: true,
	}
}
