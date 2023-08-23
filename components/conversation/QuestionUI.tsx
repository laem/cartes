import styled from 'styled-components'

export const QuestionList = styled.ul`
	margin: 1.6rem 0;
	flex-wrap: wrap;

	width: 100%;
	padding: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex-wrap: wrap;
`

export const VariantLeaf = styled.li`
	display: inline-flex;
	align-items: center;
	display: flex;
	justify-content: flex-end;
	margin-bottom: 1em;
	&:not(:first-child) {
		margin-left: 0.6rem;
	}

	${(p) =>
		p.$aucun &&
		`
		label {

	font-weight: 800;
	text-decoration: underline;
	}

`}

	img {
		margin: -10px 0;
	}
`

export const Variant = styled.li`
	align-items: center;
	margin-bottom: 1em;
	width: 100%;
	display: flex;
	justify-content: end;
	flex-direction: column;
	align-items: end;

	&:not(:first-child) {
		margin-left: 0.6rem;
	}
	> ul {
		display: flex;
		border-right: 2px dashed #aaa;
		text-align: right;
		padding-right: 1em;
		padding-top: 0.6em;
		padding-left: 0em;
		margin-left: 0rem;
	}

	> div {
		padding-right: 0.6em;
		font-weight: 600;
		text-align: right;
	}
`

export const BinaryItem = styled.span`
	&:not(:first-child) {
		margin-left: 0.6rem;
	}
	input {
		width: 0;
		opacity: 0;
		height: 0;
		position: absolute;
	}
`

export const RadioLabelStyle = styled.label`
	cursor: pointer;
	margin-bottom: 0.6rem;
	padding: 0.4rem 1rem;
	background: none;
	border: 1px solid var(--color) !important;
	text-transform: none !important;
	background-color: var(--darkColor);
	color: var(--textColor) !important;
	font-weight: 500 !important;
	border-radius: 0.3rem;

	${(p) =>
		p.$selected &&
		`

	background: var(--lightColor);
	color: var(--textColor) !important;
	`}

	@media (hover) {
		&:hover:not(.selected) {
			background: var(--lightColor);
			transition: all 0.05s;
		}
	}
`
