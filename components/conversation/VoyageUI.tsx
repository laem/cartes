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

export const ImageWithNameWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: start;
	overflow: hidden;
	height: 8rem;
	border-radius: 0.6rem;
	> img {
		position: absolute;
		transform: translateY(-50%);
		top: 50%;
		left: 0;
		object-fit: cover;
		width: 100%;
		height: auto;
		border-radius: 0;
	}
	@media (max-width: 800px) {
		display: flex;
		flex-direction: row;
		img {
			width: 3rem;
			height: 3rem;
		}
	}
`

export const Destination = styled.div`
	background: #ffffffd1;
	border-radius: 0.2rem;
	line-height: 1.2rem;
	padding: 0 0.4rem;
	position: absolute;
	transform: translateY(-50%) translateX(-50%);
	top: 50%;
	left: 50%;
	display: flex;
	align-items: center;
	flex-direction: row;
	margin-bottom: 0.6rem;
	img {
		width: 2.5rem;
		height: auto;
		margin-right: 0.4rem;
	}
	h2 {
		margin: 0;
		color: var(--darkerColor);
		font-weight: bold;
	}
`

export const CityImage = styled.img`
	object-fit: cover;
	border-radius: 6rem;
	width: calc(6rem + 6vw);
	height: calc(6rem + 6vw);
	${(props) =>
		props.$thinner
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
		margin-left: 0.2rem;
		padding: 0;
	}
	width: 100%;
	@media (min-width: 800px) {
		max-width: 20rem;
	}
`
export const ChoiceText = styled.span`
	max-width: 10rem;
	overflow-x: scroll;
	white-space: nowrap;
	display: inline-block;
`
export const ChoiceContent = styled.div`
	display: flex;
	align-items: center;
	text-align: right;
	img {
		width: 2rem;
	}
`
export const Choice = styled.div`
	> img {
		filter: invert(1);
		width: 3rem;
		height: auto;
	}
	font-size: 120%;
	display: flex;
	justify-content: start;
	align-items: center;
	> * {
		margin: 0 0.6rem;
	}
`
