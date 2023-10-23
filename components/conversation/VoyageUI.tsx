import styled from 'styled-components'
export const VoyageWrapper = styled.div`
	margin-top: 0.6rem;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	width: 100%;
	@media (min-width: 800px) {
		flex-wrap: nowrap;
		justify-content: space-evenly;
	}
`

export const ImageWrapper = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	@media (min-width: 800px) {
		flex-direction: column;
	}
	img {
		margin-right: 1rem;
	}
`

export const CityImage = styled.img`
	object-fit: cover;
	border-radius: 6rem;
	width: calc(6rem + 6vw);
	height: calc(6rem + 6vw);
	${(props) =>
		props.thinner
			? `
	height: calc(10rem + 6vw);
	`
			: ``}
`
export const MapSizer = styled.div`
	margin: 1rem 0;
	> div {
		border: 2px solid var(--darkColor);
		border-radius: 32rem;
		width: calc(6rem + 6vw);
		height: calc(6rem + 6vw);
	}
`

export const InputWrapper = styled.div`
	label {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
		margin: 1em 1rem 0rem;
		> span {
			font-size: 120%;
		}
	}
	input {
		width: 9em !important;
		font-size: 130% !important;
		margin: 0;
		@media (max-width: 800px) {
			margin-top: 1rem;
		}
	}
	label > span {
		display: inline-block;
		margin-right: 0.3rem;
	}
	ul {
		border-left: 1px solid #333;
		max-width: 30em;
		margin-left: 1rem;
		padding: 0;
	}
	width: 100%;
	@media (min-width: 800px) {
		max-width: 30rem;
	}
`
export const ChoiceText = styled.span`
	max-width: 10rem;
	overflow-x: scroll;
	white-space: nowrap;
	display: inline-block;
`
export const Choice = styled.div`
	> img {
		filter: invert(1);
		width: 3rem;
		height: auto;
		margin-bottom: 0.2rem;
	}
	font-size: 120%;
	display: flex;
	justify-content: start;
	align-items: center;
	> * {
		margin: 0 0.6rem;
	}
`
