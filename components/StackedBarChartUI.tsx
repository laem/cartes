import styled from 'styled-components'

export const BarStack = styled.div`
	display: flex;
	border-radius: 0.4em;
	overflow: hidden;
	width: 100%;
`

export const BarItem = styled.div`
	height: 26px;
	border-right: 2px solid black;
	transition: width 0.3s ease-out;
	&:last-child {
		border-right: none;
	}
`

export const BarStackLegend = styled.div`
	display: flex;
	margin-top: 10px;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	@media (min-width: 800px) {
		flex-direction: row;
		text-align: center;
	}
`

export const BarStackLegendItem = styled.div`
	display: flex;
	align-items: center;
	color: #96b3d0;
	strong {
		display: inline-block;
		color: #fff;
		margin-left: 8px;
	}
	a {
		text-decoration: none;
	}
`

export const SmallCircle = styled.span`
	display: inline-block;
	height: 1.4rem;
	width: 1.4rem;
	margin-right: 10px;
	border-radius: 100%;
`
