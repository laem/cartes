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

	page
		.on('console', (message) => {
			const type = message.type().substr(0, 3).toUpperCase()

			if (type === 'ERR')
				console.log(
					`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
				)
		})
		.on('pageerror', ({ message }) => console.log(message))
		.on('response', (response) =>
			console.log(`${response.status()} ${response.url()}`)
		)
		.on('requestfailed', (request) =>
			console.log(`${request.failure().errorText} ${request.url()}`)
		)

	await page.goto(pageToScreenshot)

	await timeout(1000)

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
