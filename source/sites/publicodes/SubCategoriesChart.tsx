import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useEngine } from '../../components/utils/EngineContext'
import { extractCategories } from './chart'

export default ({ total, category, color }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const subCategories = extractCategories(rules, engine, null, category, true)
	console.log(total, subCategories)
	return (
		<InlineBarChart
			css={`
				border: 2px solid ${color};
				background: white;
			`}
		>
			{subCategories.map(({ nodeValue, title, icons }) => (
				<li
					key={title}
					css={`
						width: calc(${(nodeValue / total) * 100}% - 10px);
						border-right: 2px solid ${color};
					`}
					title={Math.round(nodeValue)}
				>
					{emoji(icons || '')}
				</li>
			))}
		</InlineBarChart>
	)
}

const InlineBarChart = styled.ul`
	display: flex;
	justify-content: space-evenly;
	width: 100%;
	border-radius: 0.4rem;
	padding-left: 0;
	margin: 0;
	li {
		text-align: center;
		list-style-type: none;
		min-width: 2.4rem;
		height: 1.6rem;
		line-height: 1.4rem;
	}
	li img {
	}
	li:last-child {
		border-right: none;
	}
`
