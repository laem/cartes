'use client'

import styled from 'styled-components'
export const Container = styled.div`
	height: 100%;
	text-align: center;
`
export const Image = styled.img`
	height: 50vh;
	object-fit: cover;
	width: 100vw;
	-webkit-mask-image: -webkit-gradient(
		linear,
		left top,
		left bottom,
		from(rgba(0, 0, 0, 1)),
		to(rgba(0, 0, 0, 0))
	);
	z-index: -10;
	position: relative;
`

export const Header = styled.header`
	h1 {
		font-size: 300%;
		margin-bottom: 0.6rem;
		line-height: 2.4rem;
		margin-top: -12rem;
	}
	h1 + p {
		margin-bottom: 1rem;
	}
	@media (min-width: 800px) {
		h1 {
			font-size: 400%;
			line-height: 4rem;
		}
	}
`

export const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	height: 48%;
	img {
		font-size: 140%;
		vertical-align: middle !important;
	}
	strong {
		background: var(--color);
	}

	h2 {
		font-size: 200%;
	}
`

export const CardList = styled.ul`
	display: flex;
	justif-content: center;
	li {
		min-width: 12rem;
	}
	@media (max-width: 800px) {
		li {
			min-width: 8rem;
		}
		width: 100%;
		flex-wrap: nowrap;
		overflow-x: auto;
		white-space: nowrap;
		justify-content: normal;
		height: 12rem;
		scrollbar-width: none;
		display: flex;
	}
`
