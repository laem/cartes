import { useMediaQuery } from 'usehooks-ts'
import { ModalCloseButton } from './UI'

export default function FocusedImage({ focusedImage, focusImage }) {
	const mobile = useMediaQuery('(max-width: 800px)')
	const src = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(
		focusedImage.title
	)}`
	console.log('yellow', focusedImage)
	return (
		<section
			css={`
				position: fixed;
				z-index: 100;
				${mobile
					? `
				top: 0;
				left: 0;
				width: 100vw;
				height: fit-content;
				`
					: `

				top: 6vh; right: 6vw;
				width: fit-content;
				max-width: 60vw;
				height: fit-content;

				`}

				img {
					--shadow-color: 45deg 2% 36%;
					--shadow-elevation-medium: 0.3px 0.5px 0.7px
							hsl(var(--shadow-color) / 0.36),
						0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
						2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
						5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);
					box-shadow: var(--shadow-elevation-medium);

					display: block;

					margin: 0.4rem auto;
					border-radius: 0.6rem;
					${mobile
						? `
					max-width: 96vw;
					max-height: 80vh;
					`
						: `
					width: 100%;
					height: fit-content;
					max-height: 90vh;

					`}
				}
				button {
					top: 0.4rem;
					right: 0.2rem;
				}
			`}
		>
			<img src={src} />
			<ModalCloseButton onClick={() => focusImage(null)} />
		</section>
	)
}
