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
`

export const ImageGrid = ({ images }) => {
	return (
		<ul
			css={`
				display: grid;
				grid-template-columns: 1fr 1fr;
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
