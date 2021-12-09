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

var emojiRegex = require('emoji-regex')
const openmoji = require('openmoji')

const om = (e) => {
	const unicode = e.codePointAt(0).toString(16).toUpperCase()
	console.log(unicode)

	const found = openmoji.openmojis.find(
		(el) => el.emoji === e || el.hexcode === unicode
	)

	return found && found.openmoji_images.black.svg
}

const text = `
 	👪
   ⌚ 
\u{231A}: ⌚ default emoji presentation character (Emoji_Presentation)
\u{2194}\u{FE0F}: ↔️ default text presentation character rendered as emoji
\u{1F469}: 👩 emoji modifier base (Emoji_Modifier_Base)
\u{1F469}\u{1F3FF}: 👩🏿 emoji modifier base followed by a modifier
`

const regex = emojiRegex()
for (const match of text.matchAll(regex)) {
	const emoji = match[0]
	console.log(
		`Matched sequence ${emoji} — code points: ${[...emoji]}`,
		om(emoji),
		[...emoji].map(om)
	)
}
