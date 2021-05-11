import emoji from 'react-easy-emoji'
import { humanWeight } from '../HumanWeight'

export default ({ nodeValue, color, completed }) => {
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
			{completed && <Check />}
		</span>
	)
}

const Check = ({}) => <span css="margin-left: .3rem">{emoji(' ✅')}</span>
