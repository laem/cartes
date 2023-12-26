import { computeCssVariable } from '@/components/utils/colors'
import { fromHTML } from '@/components/utils/htmlUtils'
export default async function buildSvgImage(imageUrl, then) {
	const imageRequest = await fetch(imageUrl)
	const imageText = await imageRequest.text()

	// If both the image and svg are found, replace the image with the svg.
	const img = new Image(40, 40)

	const svg = fromHTML(imageText)
	const svgSize = svg.getAttribute('width'), // Icons must be square !
		xyr = svgSize / 2
	const backgroundDisk = `<circle
     style="fill:${encodeURIComponent(
				computeCssVariable('--color')
			)};fill-rule:evenodd"
     cx="${xyr}"
     cy="${xyr}"
     r="${xyr}" />`
	const newInner = `${backgroundDisk}<g style="fill:white;" transform="scale(.7)" transform-origin="center" transform-box="fill-box">${svg.innerHTML}</g>`
	svg.innerHTML = newInner
	console.log('svg', newInner)
	console.log(svg.outerHTML)

	img.src = 'data:image/svg+xml;charset=utf-8,' + svg.outerHTML

	img.onload = () => then(img)
}
