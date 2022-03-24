import { humanWeight } from '../HumanWeight'

export default ({ nodeValue, color }) => {
	const [value, unit] = humanWeight(nodeValue, true)
	return (
		<span
			css={`
				color: ${color || 'var(--textColorOnWhite)'};
				font-weight: 600;
				vertical-align: baseline;
			`}
		>
			{value}&nbsp;{unit}
		</span>
	)
}
