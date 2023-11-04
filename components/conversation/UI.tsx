'use client'
import styled from 'styled-components'

export const Fieldset = styled.fieldset`
	display: flex;
	justify-content: flex-end;
	flex-wrap: wrap;
	align-items: baseline;
	span {
		white-space: nowrap;
	}
	ul {
		list-style-type: none;
	}
`

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

export const InputStyle = styled.span`
	input,
	textarea,
	select {
		padding: 0.4rem;
		max-width: 100%;
		margin-bottom: 0.6rem;
		border: 1px solid var(--lighterTextColor);
		border-radius: 0.3rem;
		background-color: var(--darkerColor);
		color: inherit;
		font-size: inherit;
		transition: border-color 0.1s;
		position: relative;
		font-family: inherit;
	}
	input {
		width: 25rem;
		max-width: 80vw;
	}
	textarea {
		width: 100%;
	}

	input[inputmode='numeric'],
	.conversationInput {
		width: 10rem;
		text-align: right;
	}
	input[type='date'] {
		width: auto;
	}
	input[type='number'] {
		appearance: textfield;
		text-align: right;
	}
	${(props) =>
		props.suffixed &&
		`
	input {
		text-align: right;
	}
	`}
	input:focus,
	select:focus {
		border-color: var(--color);
	}

	input:placeholder {
		opacity: 0.75;
		color: var(--lighterColor);
	}
`

export const StepButtons = styled.div`
	align-items: center;
	display: flex;
	justify-content: flex-end;
`
