'use client'
import styled from 'styled-components'

const Article = styled.article`
	max-width: 700px;
	margin: 0 auto;
	padding: 0 0.6rem;
	h1 {
		font-size: 160%;
	}
	h2 {
		font-size: 140%;
	}
	img {
		width: 700px;
		max-width: 90vw;
	}
	blockquote {
		margin-left: 0;
		padding-left: 1.4rem;
		border-left: 6px solid var(--color1);
	}
`

export default Article
