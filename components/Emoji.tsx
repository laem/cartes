import emojiRegex from 'emoji-regex'
import openmojis from './openmojis.json' assert { type: 'json' }
import replace from 'string-replace-to-array'

const regex = emojiRegex()

const url = `https://unpkg.com/openmoji@14.0.0`
const findOpenmoji = (e, black) => {
	const unicode = e.codePointAt(0).toString(16).toUpperCase()

	const found = openmojis[e] || openmojis[e + '️']
	// for a reason I don't understand, openmoji JSON file contains the variation 16 emoji somtimes... U+FE0F

	return (
		found && `${url}/${black ? 'black' : 'color'}/svg/${found || unicode}.svg`
	)
}

const sizeEm = 2

const Emoji = ({ e, black, extra, alt, hasText, white }) => {
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
		return <Image {...{ src, alt: emoji, imageSize, white }} key={src} />
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
			aspect-ratio: 1 / 1;
			width: ${imageSize}em;
			height: ${imageSize}em;
			vertical-align: middle !important;
			${white && 'filter: invert(1)'}
		`}
		src={src}
		alt={alt}
	/>
)

export const getEmojiImageUrls = (emojis) =>
	replace(emojis, regex, function (emoji) {
		return findOpenmoji(emoji)
	})

export const emoji = (e) => <Emoji e={e} />
export default Emoji
