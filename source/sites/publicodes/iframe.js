import { iframeResize } from 'iframe-resizer'

const script =
		document.getElementById('ecolab-climat') ||
		document.getElementById('nosgestesclimat'),
	integratorUrl = encodeURIComponent(window.location.href.toString())

const integratorLogo = script.dataset.integratorLogo,
	integratorName = script.dataset.integratorName,
	integratorActionUrl = script.dataset.integratorActionUrl,
	integratorYoutubeVideo = script.dataset.integratorYoutubeVideo,
	integratorActionText = script.dataset.integratorActionText

const hostname = 'nosgestesclimat.fr/'
const src = `https://${hostname}?iframe&integratorUrl=${integratorUrl}&integratorLogo=${integratorLogo}&integratorYoutubeVideo=${integratorYoutubeVideo}&integratorName=${integratorName}&integratorActionText=${integratorActionText}&integratorActionUrl=${integratorActionUrl}`

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
