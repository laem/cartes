'use client'
import styled from 'styled-components'

const Article = styled.article`
	max-width: 700px;
	margin: 0 auto;
	padding: 0 0.6rem;
	header {
		margin-bottom: 2rem;
	}
	h1 {
		font-size: 240%;
		margin-bottom: 1rem;
		line-height: 1.3rem;
		text-align: center;
	}
	header > small {
		display: block;
		text-align: center;
		color: var(--color);
	}
	header > img {
		width: 30rem;
		max-width: 80%;
		height: auto;
	}
	h2 {
		font-size: 140%;
	}
	img,
	video {
		max-width: 90%;
		max-height: 30rem;
		display: block;
		margin: 1rem auto;
	}
	img + em,
	video + p em {
		font-size: 90%;
		line-height: 1rem;
		text-align: center;
		max-width: 70%;
		margin: 0 auto;
		display: block;
		margin-bottom: 0.8rem;
	}
	blockquote {
		margin-left: 0;
		padding-left: 1.4rem;
		border-left: 6px solid var(--color1);
	}
	ul {
		padding-left: 1rem;
	}
	#sommaire + ul {
		background: var(--darkestColor);
		padding: 0.6rem 2rem;
		border-radius: 1rem;
	}
	hr {
		opacity: 0.3;
		color: var(--lightColor);
		margin: 1.6rem 0;
	}
	iframe {
		width: 90%;
		margin: 1.4rem auto;
		display: block;
		border: none;
		border-radius: 0.4rem;
	}
`

export default Article
