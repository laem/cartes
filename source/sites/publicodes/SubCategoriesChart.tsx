import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useEngine } from '../../components/utils/EngineContext'
import { extractCategories } from './chart'

export default ({ total, category, color }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const subCategories = extractCategories(
		rules,
		engine,
		null,
		category,
		true,
		false
	)
	console.log(total, subCategories)
	return (
		<InlineBarChart
			css={`
				border: 2px solid var(--lighterColor);
				background: ${color};
			`}
		>
			{subCategories.map(({ nodeValue, title, icons }) => (
				<li
					key={title}
					css={`
						width: calc(${(nodeValue / total) * 100}% - 10px);
						border-right: 2px solid var(--lighterColor);
					`}
					title={title}
				>
					<span>{emoji(icons || '')}</span>
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
		height: 1.8rem;
		line-height: 1.4rem;
	}
	li span {
		position: relative;
		font-size: 110%;
		background: white;
		border-radius: 2rem;
		height: 1.5rem;
		display: inline-block;
		width: 1.5rem;
	}
	li img {
		vertical-align: -0.2em !important;
	}
	li img:nth-child(2) {
		font-size: 95%;
		position: absolute;
		bottom: 0px;
		right: 0px;
		transform: translate(60%, 10%);
		background: white;
		border-radius: 2rem;
		padding: 0.15rem;
	}
	li:last-child {
		border-right: none;
	}
`
