import { Openmoji } from '@svgmoji/openmoji'
import data from 'svgmoji/emoji.json'

const openmoji = new Openmoji({ data, type: 'all' })

const sizeRem = '2'

export default ({ e }) => (
	<img
		css={`
			width: ${sizeRem}rem !important;
			height: ${sizeRem}rem !important;
			vertical-align: middle !important;
		`}
		src={openmoji.url(e)}
		alt={e}
	/>
)
