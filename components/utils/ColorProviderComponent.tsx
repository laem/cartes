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
	return result
}

export const ColorProviderComponent = styled.div`
	min-height: 100%;
	display: flex;
	flex-direction: column;
	${(props) => createVariableString(props.$variables)}
`
