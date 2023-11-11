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
		font-size: 160%;
		margin-bottom: 0;
	}
	h2 {
		font-size: 140%;
	}
	img {
		max-width: 90vw;
		max-height: 30rem;
		display: block;
		margin: 1rem auto;
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
	}
`

export default Article
