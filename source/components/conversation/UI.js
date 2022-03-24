import styled, { css } from 'styled-components'
export const CategoryLabel = styled.span`
	background: 'darkblue';
	color: var(--darkColor);
	border-radius: 0.3rem;
	text-transform: uppercase;
	margin-right: 0.6rem;
	display: flex;
	align-items: center;
	img {
		font-size: 140%;
		margin: 0 0.6rem 0 0 !important;
	}

	line-height: 1rem;
	font-size: 140%;
	font-weight: 600;
	opacity: 0.6;
	img {
		font-size: 100%;
		display: none;
	}
	@media (max-width: 800px) {
		margin-bottom: 0.6rem;
	}

	${(props) =>
		props.color &&
		css`
			background: ${props.color};
		`}
`
