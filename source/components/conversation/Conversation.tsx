import {
	goToQuestion,
	updateSituation,
	validateStepWithValue,
} from 'Actions/actions'
import RuleInput, { RuleInputProps } from 'Components/conversation/RuleInput'
import QuickLinks from 'Components/QuickLinks'
import * as Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { TrackerContext } from 'Components/utils/withTracker'
import React, { useState, useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { objectifsSelector } from '../../selectors/simulationSelectors'
import Aide from './Aide'
import './conversation.css'
import { ExplicableRule } from './Explicable'
import CategoryRespiration from './CategoryRespiration'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
}

export default function Conversation({
	customEndMessages,
	teaseCategories,
}: ConversationProps) {
	const dispatch = useDispatch()
	const rules = useContext(EngineContext).getParsedRules()
	const currentQuestion = useNextQuestions()[0]
	const situation = useSelector(situationSelector)
	const currentQuestionIsAnswered = situation[currentQuestion] != null
	const previousAnswers = useSelector(answeredQuestionsSelector)
	const tracker = useContext(TrackerContext)
	const objectifs = useSelector(objectifsSelector)

	const [dismissedRespirations, dismissRespiration] = useState([])

	useEffect(() => {
		if (previousAnswers.length === 1) {
			tracker.push(['trackEvent', 'NGC', '1ère réponse au bilan'])
		}
	}, [previousAnswers, tracker])

	useEffect(() => {
		if (currentQuestion) {
			dispatch(goToQuestion(currentQuestion))
		}
	}, [dispatch, currentQuestion])
	const setDefault = () =>
		dispatch(
			// TODO: Skiping a question shouldn't be equivalent to answering the
			// default value (for instance the question shouldn't appear in the
			// answered questions).
			validateStepWithValue(currentQuestion, undefined)
		)
	const goToPrevious = () =>
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))

	const submit = (source: string) => {
		dispatch({
			type: 'STEP_ACTION',
			name: 'fold',
			step: currentQuestion,
			source,
		})
	}

	const onChange: RuleInputProps['onChange'] = (value) => {
		dispatch(updateSituation(currentQuestion, value))
	}

	const handleKeyDown = ({ key }: React.KeyboardEvent) => {
		if (key === 'Escape') {
			setDefault()
		} else if (key === 'Enter') {
			submit('enter')
		}
	}

	if (!currentQuestion)
		return (
			<div style={{ textAlign: 'center' }}>
				<h3>
					{emoji('🌟')}{' '}
					<Trans i18nKey="simulation-end.title">
						Vous avez complété cette simulation
					</Trans>
				</h3>
				<p>
					{customEndMessages ? (
						customEndMessages
					) : (
						<Trans i18nKey="simulation-end.text">
							Vous avez maintenant accès à l'estimation la plus précise
							possible.
						</Trans>
					)}
				</p>
			</div>
		)

	const questionCategoryName = currentQuestion.split(' . ')[0],
		questionCategory = rules[questionCategoryName]

	const isCategoryFirstQuestion =
		questionCategory &&
		previousAnswers.find(
			(a) => a.split(' . ')[0] === questionCategory.dottedName
		) === undefined

	return teaseCategories &&
		isCategoryFirstQuestion &&
		!dismissedRespirations.includes(questionCategory.dottedName) ? (
		<CategoryRespiration
			questionCategory={questionCategory.rawNode}
			dismiss={() =>
				dismissRespiration([
					...dismissedRespirations,
					questionCategory.dottedName,
				])
			}
		/>
	) : (
		<>
			<Aide />
			<div style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
				<Animate.fadeIn>
					<div className="step">
						<h3>
							{rules[currentQuestion]?.rawNode?.question}{' '}
							<ExplicableRule dottedName={currentQuestion} />
						</h3>
						<fieldset>
							<RuleInput
								dottedName={currentQuestion}
								onChange={onChange}
								onSubmit={submit}
							/>
						</fieldset>
					</div>
				</Animate.fadeIn>
				<div className="ui__ answer-group">
					{previousAnswers.length > 0 && (
						<>
							<button
								onClick={goToPrevious}
								className="ui__ simple small push-left button"
							>
								← <Trans>Précédent</Trans>
							</button>
						</>
					)}
					{currentQuestionIsAnswered ? (
						<button
							className="ui__ plain small button"
							onClick={() => submit('accept')}
						>
							<span className="text">
								<Trans>Suivant</Trans> →
							</span>
						</button>
					) : (
						<button
							onClick={setDefault}
							className="ui__ simple small push-right button"
						>
							<Trans>Je ne sais pas</Trans> →
						</button>
					)}
				</div>
			</div>
			<QuickLinks />
		</>
	)
}
