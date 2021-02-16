import styled from 'styled-components'

export const Mosaic = styled.ul`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	p {
		text-align: center;
	}

	> li > div > img {
		margin-right: 0.4rem !important;
		font-size: 130% !important;
	}

	> li {
		width: 14rem;
		margin: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
	}

	> li h4 {
		margin: 0;
	}
	> li p {
		font-style: italic;
		font-size: 85%;
		line-height: 1.2rem;
	}
`
