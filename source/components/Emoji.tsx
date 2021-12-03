import { Openmoji } from '@svgmoji/openmoji'
import data from 'svgmoji/emoji.json'

const openmoji = new Openmoji({ data, type: 'all' })

const sizeRem = '2'

export default ({ e }) => {
	const svgMojiURL = openmoji.url(e)
	const url = svgMojiURL.includes('1F44D.svg')
		? `https://unpkg.com/openmoji@12.1.0/color/svg/${e}.svg`
		: svgMojiURL

	return (
		<img
			css={`
				width: ${sizeRem}rem !important;
				height: ${sizeRem}rem !important;
				vertical-align: middle !important;
			`}
			src={url}
			alt={e}
		/>
	)
}
