const script = document.getElementById('futureco'),
	path = script?.getAttribute('path') || '',
	integratorUrl = encodeURIComponent(window.location.href.toString())

const srcURL = new URL(script.src)
const hostname = srcURL.hostname || 'futur.eco'

const src = `https://${hostname}/${path}?iframe&integratorUrl=${integratorUrl}`

const iframe = document.createElement('iframe')

const iframeAttributes = {
	src,
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
	allow: 'fullscreen',
	id: 'iframeFutureco',
}

const color = '#2988e6'

document.head.insertAdjacentHTML(
	'beforeend',
	`<style>
	#iframeFutureco {
	    border: none;
		border-radius: 1rem;
		display: block;
		margin: 10px auto;
		height: 800px;
		max-height: 80vh; /* Small smartphone screens should'nt have to scroll too much. We estimate that the host's header takes 20vh */
		width: 100%;
	}
	@media (min-width: 800px){
	  #iframeFutureco{
	  max-width: 450px; /* On large monitors, the iframe should not extend too much, as to avoid confusion between the iframe (viewed as an app) and the rest of the content, e.g. when it's integrated in a blog article. Remember : the website is designed mobile first, so should work perfectly on this width */
		border: 8px solid ${color};
		}
    }
	#iframeFutureco:fullscreen {

    width: 100%;
    height: 100%;
	max-height: 100%;
	max-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
	background: white;

	}
    </style>`
)

for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}

const link = document.createElement('div')
link.innerHTML = `
<a href="https://futur.eco" target="_blank">Découvrir d'autres calculateurs d'impact carbone</a>
`
link.style.cssText = `
margin: 1rem auto .6rem;
text-align: center

`
const fullscreenButton = document.createElement('button')
fullscreenButton.innerHTML = `
<img width="14px" height="14px" src="https://nextfu.vercel.app/fullscreen.svg" style="filter: invert(1); vertical-align: middle; cursor: pointer"/>
Passer en mode plein écran

`
fullscreenButton.style.cssText = `
cursor:pointer;
display: block; margin: 0 auto;
border: none;
padding: .2rem .8rem;
border-radius: .4rem;
background: ${color};
font-weight: bold;
color: white;

`
fullscreenButton.addEventListener('click', (event) => {
	iframe.requestFullscreen()
})

script.parentNode.insertBefore(link, script)
script.parentNode.insertBefore(fullscreenButton, script)
// TODO : works, but we need to let the user come back !

script.parentNode.insertBefore(iframe, script)
