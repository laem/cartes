var emojiRegex = require('emoji-regex')
const openmoji = require('openmoji')
import replace from 'string-replace-to-array'

const regex = emojiRegex()

const url = `https://unpkg.com/openmoji@12.1.0`
const findOpenmoji = (e, black) => {
	const unicode = e.codePointAt(0).toString(16).toUpperCase()

	const directFound = openmoji.openmojis.find((el) => el.emoji === e)
	const hexFound = openmoji.openmojis.find((el) => el.hexcode === unicode)
	const found = directFound || hexFound

	return found && url + found.openmoji_images[black ? 'black' : 'color'].svg
}

const sizeEm = 2

export default ({ e, black, extra, alt, hasText, white }) => {
	const useBlack = black || white
	if (e == null && extra == null) return null
	if (extra)
		return (
			<Image
				{...{
					src: `${url}/${useBlack ? 'black' : 'color'}/svg/${extra}.svg`,
					alt,
					imageSize: sizeEm,
				}}
			/>
		)

	const matches = [...e.matchAll(regex)]
	const imageSize = sizeEm * (1 - (matches.length - 1) / 10)

	const items = replace(e, regex, function (emoji) {
		const src = findOpenmoji(emoji, useBlack)
		return <Image {...{ src, alt: emoji, imageSize, white }} />
	})
	if (hasText) return items
	return (
		<span
			css={`
				display: inline-flex;
				vertical-align: middle;
				align-items: center;
			`}
		>
			{items}
		</span>
	)
}

const Image = ({ src, alt, imageSize, white }) => (
	<img
		css={`
			width: ${imageSize}em;
			height: ${imageSize}em;
			vertical-align: middle !important;
			${white && 'filter: invert(1)'}
		`}
		src={src}
		alt={alt}
	/>
)
