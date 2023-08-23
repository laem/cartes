'use client'
import styled from 'styled-components'

const createVariableString = (variables) => {
	const result = Object.entries(variables)
		.map(([key, value]) => {
			if (typeof value === 'string') {
				return `--${key}: ${value}`
			} else return ``
		})
		.join(';')
	console.log('YO', result)
	return result
}

export const ColorProviderComponent = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	${(props) =>
		console.log('got variables', props.$variables) ||
		createVariableString(props.$variables)}
`
