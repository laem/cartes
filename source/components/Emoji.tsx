var emojiRegex = require('emoji-regex')
const openmoji = require('openmoji')

const regex = emojiRegex()

const url = `https://unpkg.com/openmoji@12.1.0`
const findOpenmoji = (e, black) => {
	const unicode = e.codePointAt(0).toString(16).toUpperCase()

	const directFound = openmoji.openmojis.find((el) => el.emoji === e)
	const hexFound = openmoji.openmojis.find((el) => el.hexcode === unicode)
	console.log('DF', directFound, hexFound)
	const found = directFound || hexFound

	return found && url + found.openmoji_images[black ? 'black' : 'color'].svg
}

const sizeEm = 2

export default ({ e, black, extra, alt }) => {
	if (extra)
		return (
			<Image
				{...{
					src: `${url}/${black ? 'black' : 'color'}/svg/${extra}.svg`,
					alt,
				}}
			/>
		)

	const items = [...e.matchAll(regex)]
	const imageSize = sizeEm * (1 - (items.length - 1) / 10)

	const images = items.map((match) => {
		const emoji = match[0]

		console.log(emoji, [...emoji])

		const src = findOpenmoji(emoji, black)
		return <Image {...{ src, emoji, imageSize }} />
	})

	return (
		<span
			css={`
				display: inline-flex;
				vertical-align: middle;
				align-items: center;
			`}
		>
			{images}
		</span>
	)
}

const Image = ({ src, alt, imageSize }) => (
	<img
		css={`
			width: ${imageSize}em;
			height: ${imageSize}em;
			vertical-align: middle !important;
		`}
		src={src}
		alt={alt}
	/>
)
