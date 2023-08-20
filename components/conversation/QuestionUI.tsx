import styled from 'styled-components'

export const
export const QuestionList = styled.ul`
	margin: 0.3rem 0;
	flex-wrap: wrap;

	width: 100%;
	padding: 0;
	margin: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	flex-wrap: wrap;
	li {
		margin: 0 0.4rem;
	}
`

export const VariantLeaf = styled.li`
	display: inline-flex;
	align-items: center;
	display: flex;
	justify-content: flex-end;
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
	display: inline-flex;
	align-items: center;
	margin-bottom: 1em;
	&:not(:first-child) {
		margin-left: 0.6rem;
	}
	> ul {
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
