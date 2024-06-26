'use client'

import styled from 'styled-components'

export const DiapoWrapper = styled.div`
	> section {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		justify-content: center;
		border-bottom: 1px solid var(--lightestColor);
	}

	h2,
	h3,
	h4 {
		font-size: 400%;
		display: inline-block;
		margin: 4rem 0;
	}
	h2 {
		font-size: 400%;
	}
	h3 {
		font-size: 300%;
	}
	h4 {
		font-size: 250%;
	}
	img {
		max-width: 90%;
		margin: 0 auto;
		border-radius: 0.6rem;
	}

	aside {
		color: #bbb;
		text-align: center;
		font-size: 80%;
	}
	em {
		background: var(--lighterColor);
		font-style: normal;
	}
`

export const ImageGrid = ({ images }) => {
	return (
		<ul
			css={`
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				padding: 0 5%;
				list-style-type: none;
				gap: 5%;
				li {
					width: 40%;
					img {
						max-width: 100%;
						object-fit: cover;
					}
				}
			`}
		>
			{images.map((image) => (
				<li key={image.img}>
					<a href={image.url}>
						<img src={image.img} />
					</a>
				</li>
			))}
		</ul>
	)
}
