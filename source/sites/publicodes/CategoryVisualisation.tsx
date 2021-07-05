import emoji from 'react-easy-emoji'
import SubCategoriesChart from './SubCategoriesChart'
import { CategoryLabel } from 'Components/conversation/UI'
import { ruleFormula } from '../../components/publicodesUtils'
import { useEngine } from '../../components/utils/EngineContext'
import { useSelector } from 'react-redux'

export default ({ questionCategory }) => {
	const rules = useSelector((state) => state.rules)
	const engine = useEngine()
	const category = questionCategory.dottedName
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

	return (
		<div
			css={`
				display: flex;
				align-items: center;
				justify-content: flex-start;
				flex-wrap: wrap;
			`}
		>
			<CategoryLabel>
				{emoji(questionCategory.icons || '🌍')}
				{questionCategory.title}
			</CategoryLabel>
			<Inhabitants {...{ formula, engine }} />
			{sumToDisplay && (
				<div
					css={`
						width: 75%;
						@media (max-width: 800px) {
							width: 100%;
						}
					`}
				>
					<SubCategoriesChart
						{...{
							color: questionCategory.color,
							rules,
							engine,
							sumToDisplay,
							total,
						}}
					/>
				</div>
			)}
		</div>
	)
}

const Inhabitants = ({ formula, engine }) => {
	const denominator = formula.operationKind === '/' && formula.explanation[1],
		// This is custom code for the "logement" sub-category that divides a sum by the number of inhabitants of the home
		inhabitants =
			denominator.name === 'habitants' &&
			engine.evaluate(denominator.dottedName).nodeValue
	if (!denominator) return null
	return (
		<span>
			{emoji('👥')} {inhabitants} {inhabitants <= 1 ? 'habitant' : 'habitants'}
		</span>
	)
}
