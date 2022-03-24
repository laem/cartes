import styled from 'styled-components'

const Title = styled.h1`
	display: none;
	@media (min-width: 800px) {
		display: block;
		margin: 0;
		padding: 0.4rem 0.6rem;
		font-size: 130%;

		border-bottom: 1px solid #eee;
	}
`

export default Title
