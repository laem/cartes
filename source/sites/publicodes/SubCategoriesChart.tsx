import { AnimatePresence, motion } from 'framer-motion'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useEngine } from '../../components/utils/EngineContext'
import { extractCategories } from 'Components/publicodesUtils'
import SubCategoryBar from './SubCategoryBar'
import { ruleFormula } from '../../components/publicodesUtils'
import { shadowStyle } from './styles'

export default ({ category, color }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const evaluated = engine.evaluate(category),
		total = evaluated.nodeValue,
		rule = engine.getRule(category),
		formula = ruleFormula(rule)

	if (!formula) return null

	const sumToDisplay =
		formula.nodeKind === 'somme'
			? category
			: formula.operationKind === '/'
			? formula.explanation[0].dottedName
			: null

	if (!sumToDisplay) return null

	const subCategories = extractCategories(
		rules,
		engine,
		null,
		sumToDisplay,
		false
	)

	const rest = subCategories.reduce(
			(memo, { nodeValue, title, icons }) =>
				nodeValue < 0.1 * total ? memo + nodeValue : memo,
			0
		),
		restWidth = (rest / total) * 100

	return (
		<div>
			{formula.operationKind === '/' && <span>Salut</span>}
			<InlineBarChart>
				<AnimatePresence>
					{subCategories.map(({ nodeValue, title, icons }) => (
						<SubCategoryBar {...{ nodeValue, title, icons, total, color }} />
					))}
					<li
						css={`
							width: ${restWidth}%;
							background: ${color};
							font-size: 200%;
							color: white;
							line-height: 0.3rem !important;
						`}
					>
						{restWidth > 7 ? '...' : ''}
					</li>
				</AnimatePresence>
			</InlineBarChart>
		</div>
	)
}

const InlineBarChart = styled.ul`
	width: 100%;
	border-radius: 0.4rem;
	padding-left: 0;
	margin: 0;
	display: flex;
	${shadowStyle};
	li {
		display: inline-block;
		text-align: center;
		list-style-type: none;
		height: 1.9rem;
		line-height: 1.4rem;
	}

	li:last-child {
		border-right: none;
	}
`
