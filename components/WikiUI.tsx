'use client'
import styled from 'styled-components'
import { Card } from './UI'

export const CategoryList = styled.ul`
	padding-left: 0;
	list-style: none;
	> li > h2 {
		border-bottom: 6px solid orange;
		padding: 0.1rem;
		text-transform: uppercase;
		font-size: 85%;
		margin: 2rem auto 0.6rem;
		text-align: center;
		border-radius: 0.3rem;
		width: 8.3rem;
		color: var(--textColor);
		background: var(--color);
	}
	li > ul > li {
		white-space: initial;
		display: inline-block;
	}
	li > ul {
		padding-left: 0;
	}

	@media (max-width: 600px) {
		> li > h2 {
			margin: 0.6rem auto 0.2rem;
		}
		li > ul {
			display: block;
			white-space: nowrap;
			overflow-x: auto;
		}
		li > ul > li {
			margin: 0 1rem;
		}
	}
`

export const RuleListStyle = styled.ul`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	align-items: center;
	li {
		list-style-type: none;
	}
	li > a {
		text-decoration: none !important;
		:hover {
			opacity: 1 !important;
		}
	}
`

export const WikiCard = styled(Card)`
	width: 9rem;
	margin: 0.6rem 0.6rem 0.6rem 0rem !important;
	height: 8.5rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	img {
		font-size: 150%;
	}
	h3 {
		margin: 0;
		font-size: 110%;
		line-height: 1.3rem;
	}
	padding: 0.6rem !important;
	@media (max-width: 600px) {
		padding: 0.6rem;
		width: 9rem;
		font-size: 110%;
	}
	.highlighted {
		background-image: linear-gradient(
			-100deg,
			var(--color),
			var(--lightColor) 95%,
			var(--color)
		);
		border-radius: 0.5em 0 0.6em 0;
		padding: 0 0.3rem;
	}
	position: relative;
`
