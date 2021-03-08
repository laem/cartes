import {
	goToQuestion,
	updateSituation,
	validateStepWithValue,
} from 'Actions/actions'
import RuleInput, {
	isMosaic,
	RuleInputProps,
} from 'Components/conversation/RuleInput'
import * as Animate from 'Components/ui/animate'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { TrackerContext } from 'Components/utils/withTracker'
import { sortBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { objectifsSelector } from '../../selectors/simulationSelectors'
import Aide from './Aide'
import CategoryRespiration from './CategoryRespiration'
import './conversation.css'
import { ExplicableRule } from './Explicable'
import { CategoryLabel } from './UI'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customEnd?: React.ReactNode
}

export default function Conversation({
	customEndMessages,
	customEnd,
	orderByCategories,
}: ConversationProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext),
		rules = engine.getParsedRules()
	const nextQuestions = useNextQuestions()
	const situation = useSelector(situationSelector)
	const previousAnswers = useSelector(answeredQuestionsSelector)
	const tracker = useContext(TrackerContext)
	const objectifs = useSelector(objectifsSelector)
	const rawRules = useSelector((state) => state.rules)
	const previousSimulation = useSelector((state) => state.previousSimulation)

	const sortedQuestions = orderByCategories
		? sortBy(
				(question) =>
					-orderByCategories.find((c) => question.indexOf(c.dottedName) === 0)
						?.nodeValue,
				nextQuestions
		  )
		: nextQuestions
	const unfoldedStep = useSelector((state) => state.simulation.unfoldedStep)
	const isMainSimulation = objectifs.length === 1 && objectifs[0] === 'bilan',
		currentQuestion = !isMainSimulation
			? nextQuestions[0]
			: unfoldedStep || sortedQuestions[0]

	const currentQuestionIsAnswered =
		currentQuestion && isMosaic(currentQuestion)
			? true
			: situation[currentQuestion] != null

	const [dismissedRespirations, dismissRespiration] = useState([])

	useEffect(() => {
		if (previousAnswers.length === 1) {
			tracker.push(['trackEvent', 'NGC', '1ère réponse au bilan'])
		}
	}, [previousAnswers, tracker])

	useEffect(() => {
		// It is important to test for "previousSimulation" : if it exists, it's not loadedYet. Then currentQuestion could be the wrong one, already answered, don't put it as the unfoldedStep
		if (currentQuestion && !previousSimulation) {
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
				{customEnd || (
					<>
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
					</>
				)}
			</div>
		)

	const mosaicQuestion = isMosaic(currentQuestion)
	const questionText = mosaicQuestion
		? mosaicQuestion.question
		: rules[currentQuestion]?.rawNode?.question

	const questionCategoryName = currentQuestion.split(' . ')[0],
		questionCategory =
			orderByCategories &&
			orderByCategories.find(
				({ dottedName }) => dottedName === questionCategoryName
			)

	const isCategoryFirstQuestion =
		questionCategory &&
		previousAnswers.find(
			(a) => a.split(' . ')[0] === questionCategory.dottedName
		) === undefined

	return orderByCategories &&
		isCategoryFirstQuestion &&
		!dismissedRespirations.includes(questionCategory.dottedName) ? (
		<CategoryRespiration
			questionCategory={questionCategory}
			dismiss={() =>
				dismissRespiration([
					...dismissedRespirations,
					questionCategory.dottedName,
				])
			}
		/>
	) : (
		<section>
			<Aide />
			<div style={{ outline: 'none' }} onKeyDown={handleKeyDown}>
				{orderByCategories && questionCategory && (
					<div>
						<CategoryLabel color={questionCategory.color}>
							{emoji(questionCategory.icons || '🌍')}
							{questionCategory.title}
						</CategoryLabel>
					</div>
				)}
				<Animate.fadeIn>
					<div className="step">
						<h3>
							{questionText} <ExplicableRule dottedName={currentQuestion} />
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
		</section>
	)
}
