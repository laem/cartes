import styled from 'styled-components'

const Stamp = styled.div`
	position: absolute;
	font-size: 100%;
	font-weight: bold;
	display: inline-block;
	padding: 0.3rem 0.2rem 0;
	text-transform: uppercase;
	font-family: 'Courier';
	mix-blend-mode: multiply;
	border: 3px solid rgb(117, 115, 115);
	color: rgb(117, 115, 115);
	mask-position: 13rem 6rem;
	transform: rotate(-10deg);
	border-radius: 4px;
	top: 2.5rem;
	left: 1em;
	line-height: 1rem;
`

export default Stamp
