import css from './css/convertToJs'

const size = '2rem'
export default function CircularIcon({ src, alt, color, ...rest }) {
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
					background: var(--${color});
					border-radius: 3rem;
					width: 100%;
					height: 100%;
				`)}
			/>
			<img
				style={css`
					position: absolute;
					width: 100%;
					height: 100%;
					filter: invert(1);
				`}
				src={src}
				alt={alt}
				width="100"
				height="100"
			/>
		</div>
	)
}
