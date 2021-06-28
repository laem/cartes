import styled, { css } from 'styled-components'
export const CategoryLabel = styled.span`
	background: 'darkblue';
	color: var(--darkColor);
	border-radius: 0.3rem;
	padding: 0.15rem 0.6rem;
	text-transform: uppercase;
	display: flex;
	align-items: center;
	img {
		font-size: 140%;
		margin: 0 0.6rem 0 0 !important;
	}

	${(props) =>
		props.color &&
		css`
			background: ${props.color};
		`}
`
