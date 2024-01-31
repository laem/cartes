import css from './css/convertToJs'

const defaultSize = '2rem'
export default function CircularIcon({
	src,
	alt,
	background,
	givenSize,
	padding,
	black,
	...rest
}) {
	const size = givenSize || defaultSize
	return (
		<div
			{...rest}
			style={css(`
				position: relative;
				width: ${size};
				height: ${size};
				cursor: ${rest.onClick ? 'pointer' : 'normal'}
			`)}
		>
			<div
				style={css(`
					position: absolute;
					background: ${background};
					border-radius: 3rem;
					width: 100%;
					height: 100%;
				`)}
			/>
			<img
				style={css(`
					position: absolute;
					width: 100%;
					height: 100%;
					${black ? '' : 'filter: invert(1);'}
					${padding ? `padding: ${padding};` : ``}
				`)}
				src={src}
				alt={alt}
				width="100"
				height="100"
			/>
		</div>
	)
}
