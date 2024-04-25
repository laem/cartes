import { useEffect, useState } from 'react'
import css from '../css/convertToJs'
import Image from 'next/image'
import wikipediaLogo from '@/public/wikipedia.svg'

export default function Wikipedia({ name }) {
	const [text, setText] = useState(null)
	const [lang, title] = name.split(':')
	const ApiUrl = `https://${lang}.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&explaintext=false&exintro&titles=${encodeURIComponent(
			title
		)}&redirects=1`,
		url = `https://${lang}.wikipedia.org/wiki/${title}`

	useEffect(() => {
		const doFetch = async () => {
			const request = await fetch(ApiUrl),
				json = await request.json()
			const pages = json?.query?.pages
			if (!pages) return
			const { extract } = Object.values(pages)[0]
			setText(extract)
		}
		doFetch()
	}, [ApiUrl])

	const shortenText = text && text.split(' ').slice(0, 50).join(' ')

	return (
		<div
			css={`
			margin-top: .4rem;
				position: relative;
				${
					shortenText?.length > 100 &&
					`
				&:after {
					position: absolute;
					bottom: 0;
					height: 100%;
					width: 100%;
					content: '';
					background: linear-gradient(
						to bottom,
						color-mix(in srgb, var(--lightestColor2) 0%, transparent) 20%,
						color-mix(in srgb, var(--lightestColor2) 100%, transparent) 80%
					);
					pointer-events: none; /* so the text is still selectable */
				`
				}
				}
				p {
					line-height: 1.2rem;
					${
						shortenText?.length > 100
							? ''
							: `
				    margin-bottom: .8rem`
					}
				}
				img {
					vertical-align: text-bottom;
					margin-right: 0.3rem;
				}
				p > a {
				${
					shortenText?.length > 100
						? `
					z-index: 2;
					position: absolute;
					right: 0;
					`
						: `float: right; `
				};}
			`}
		>
			<p>
				<Image
					src={wikipediaLogo}
					alt="Logo de Wikipedia"
					width="25"
					height="25"
				/>
				{shortenText}

				<a href={url} target="_blank">
					<small>Wikipedia</small>
				</a>
			</p>
		</div>
	)
}
