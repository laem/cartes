import { useMediaQuery } from 'usehooks-ts'
import { ModalCloseButton } from './UI'
import Image from 'next/image'

export default function FocusedImage({ focusedImage, focusImage }) {
	const mobile = useMediaQuery('(max-width: 800px)')
	const src = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(
		focusedImage.title
	)}`

	const fullUrl = `https://commons.wikimedia.org/wiki/${focusedImage.title.replace(
		' ',
		'_'
	)}`
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

				> figure > img {
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
					max-height: 80vh;

					`}
				}
				button {
					top: 0.4rem;
					right: 0.2rem;
				}
			`}
		>
			<ModalCloseButton onClick={() => focusImage(null)} />
			<figure>
				<img src={src} />
				<figcaption
					css={`
						background: var(--lightestColor);
						color: var(--darkestColor);
						padding: 0 0.6rem;
						border-radius: 0.4rem;
						a {
							text-decoration: none;
							color: var(--darkerColor);
						}
						align-items: center;
						display: block;
						margin: 0 0 0 auto;
						width: fit-content;
						img {
							width: 1rem;
							height: auto;
							margin-right: 0.1rem;
							vertical-align: sub;
						}
					`}
				>
					<a href={fullUrl} target="_blank" title="Image Wikimedia Commons">
						<Image
							src="/wikimedia-commones-logo.svg"
							width="10"
							height="10"
							alt="Logo de Wikimedia Commons"
						/>
					</a>{' '}
					<small>par</small>{' '}
					<small
						dangerouslySetInnerHTML={{ __html: focusedImage.artistHtmlTag }}
					></small>
					{' - '}
					<small title={focusedImage.date}>
						{focusedImage.date.slice(0, 4)}
					</small>
				</figcaption>
			</figure>
		</section>
	)
}
