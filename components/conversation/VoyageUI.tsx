import styled from 'styled-components'
export const VoyageWrapper = styled.div`
	margin-top: 0.6rem;
	display: flex;
	justify-content: end;
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

export const InputWrapper = styled.div`
	label {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		margin: 1em 1rem 0rem;
	}
	input {
		width: 9em !important;
		font-size: 130% !important;
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
