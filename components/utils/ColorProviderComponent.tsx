import css from '../css/convertToJs'

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

export function ColorProviderComponent({ children, variables }) {
	const variablesCss = createVariableString(variables)
	console.log(variablesCss)
	return (
		<div
			style={css`
				min-height: 100%;
				display: flex;
				flex-direction: column;
				${variablesCss}
			`}
		>
			{children}
		</div>
	)
}
