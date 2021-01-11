import {
	goToQuestion,
	resetSimulation,
	deletePreviousSimulation,
} from 'Actions/actions'
import Overlay from 'Components/Overlay'
import { useEngine } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { EvaluatedNode, formatValue } from 'publicodes'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { DottedName } from 'modele-social'
import { situationSelector } from 'Selectors/simulationSelectors'
import './AnswerList.css'

type AnswerListProps = {
	onClose: () => void
}

export default function AnswerList({ onClose }: AnswerListProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const answeredQuestions = (Object.keys(
		useSelector(situationSelector)
	) as Array<DottedName>).map((dottedName) =>
		engine.evaluateNode(engine.getParsedRules()[dottedName])
	)

	const nextSteps = useNextQuestions().map((dottedName) =>
		engine.evaluateNode(engine.getParsedRules()[dottedName])
	)

	return (
		<Overlay onClose={onClose} className="answer-list">
			{!!answeredQuestions.length && (
				<>
					<h2>
						{emoji('📋 ')}
						<Trans>Mes réponses</Trans>
						<small css="margin-left: 2em; img {font-size: .8em}">
							{emoji('🗑')}{' '}
							<button
								className="ui__ simple small button"
								onClick={() => {
									dispatch(resetSimulation())
									dispatch(deletePreviousSimulation())
									onClose()
								}}
							>
								<Trans>Tout effacer</Trans>
							</button>
						</small>
					</h2>
					<StepsTable {...{ rules: answeredQuestions, onClose }} />
				</>
			)}
			{!!nextSteps.length && (
				<>
					<h2>
						{emoji('🔮 ')}
						<Trans>Prochaines questions</Trans>
					</h2>
					<StepsTable {...{ rules: nextSteps, onClose }} />
				</>
			)}
		</Overlay>
	)
}

function StepsTable({
	rules,
	onClose,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
	onClose: () => void
}) {
	const dispatch = useDispatch()
	const language = useTranslation().i18n.language
	return (
		<table>
			<tbody>
				{rules.map((rule) => (
					<tr
						key={rule.dottedName}
						css={`
							background: var(--lightestColor);
						`}
					>
						<td>
							<div>
								<small>
									{rule.dottedName.split(' . ').slice(0, -1).join(' · ')}
								</small>
							</div>
							<div css="font-size: 110%">{rule.title}</div>
						</td>
						<td>
							<button
								className="answer"
								css={`
									display: inline-block;
									padding: 0.6rem;
									color: inherit;
									font-size: inherit;
									width: 100%;
									text-align: end;
									font-weight: 500;
									> span {
										text-decoration: underline;
										text-decoration-style: dashed;
										text-underline-offset: 4px;
										padding: 0.05em 0em;
										display: inline-block;
									}
								`}
								onClick={() => {
									dispatch(goToQuestion(rule.dottedName))
									onClose()
								}}
							>
								<span className="answerContent">
									{formatValue(rule, { language })}
								</span>
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
