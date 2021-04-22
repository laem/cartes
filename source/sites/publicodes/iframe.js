import { iframeResize } from 'iframe-resizer'

const script = document.getElementById('futureco'),
	path = script.getAttribute('path') || '',
	integratorUrl = encodeURIComponent(window.location.href.toString())

const hostname = 'futur.eco/'
const src = `https://${hostname}${path}?iframe&integratorUrl=${integratorUrl}`

const iframe = document.createElement('iframe')

const iframeAttributes = {
	src,
	style:
		'border: none; width: 100%; display: block; margin: 10px auto; min-height: 700px',
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
}
for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}
iframeResize({}, iframe)

script.parentNode.insertBefore(iframe, script)
