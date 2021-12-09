var emojiRegex = require('emoji-regex')
const openmoji = require('openmoji')

const regex = emojiRegex()

const findOpenmoji = (e, black) => {
	const url = `https://unpkg.com/openmoji@12.1.0`
	const unicode = e.codePointAt(0).toString(16).toUpperCase()

	const directFound = openmoji.openmojis.find((el) => el.emoji === e)
	const hexFound = openmoji.openmojis.find((el) => el.hexcode === unicode)
	console.log('DF', directFound, hexFound)
	const found = directFound || hexFound

	return found && url + found.openmoji_images[black ? 'black' : 'color'].svg
}

const sizeEm = '2'

export default ({ e, black }) => {
	//svgMojiURL.includes('1F44D.svg')
	console.log('<EMOJI', e)

	const images = [...e.matchAll(regex)].map((match) => {
		const emoji = match[0]

		console.log(emoji, [...emoji])

		const src = findOpenmoji(emoji, black)
		return (
			<img
				css={`
					width: ${sizeEm}em !important;
					height: ${sizeEm}em !important;
					vertical-align: middle !important;
				`}
				src={src}
				alt={emoji}
			/>
		)
	})

	return <span css="display: flex; align-items: center;">{images}</span>
}
