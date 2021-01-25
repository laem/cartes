import styled, { css } from 'styled-components'
export const CategoryLabel = styled.span`
	background: 'darkblue';
	color: white;
	border-radius: 0.3rem;
	padding: 0.15rem 0.6rem;
	text-transform: uppercase;
	img {
		margin: 0 0.6rem 0 0 !important;
	}

	${(props) =>
		props.color &&
		css`
			background: ${props.color};
		`}
`
