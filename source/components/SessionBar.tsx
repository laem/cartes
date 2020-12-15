import { goToQuestion, loadPreviousSimulation } from 'Actions/actions'
import { Button } from 'Components/ui/Button'
import { useEngine } from 'Components/utils/EngineContext'
import { last } from 'ramda'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import {
	answeredQuestionsSelector,
	objectifsSelector,
} from 'Selectors/simulationSelectors'
import { extractCategories } from '../sites/publicodes/chart'
import Answers from './conversation/AnswerList'

// TODO should be find the rewritten version of this from mon-entreprise and merge them ?

export const buildEndURL = (analysis) => {
	const total = analysis.targets[0].nodeValue,
		categories = extractCategories(analysis),
		detailsString =
			categories &&
			categories.reduce(
				(memo, next) =>
					memo +
					next.name[0] +
					(Math.round(next.nodeValue / 10) / 100).toFixed(2),
				''
			)

	if (detailsString == null) return null

	return `/fin?total=${Math.round(total)}&details=${detailsString}`
}

export default function SessionBar({ evaluation, answerButtonOnly = false }) {
	const dispatch = useDispatch()
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)

	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const arePreviousAnswers = !!answeredQuestions.length
	useEffect(() => {
		if (!arePreviousAnswers && previousSimulation)
			dispatch(loadPreviousSimulation())
	}, [])
	const [showAnswerModal, setShowAnswerModal] = useState(false)

	const history = useHistory()
	const location = useLocation()

	const css = `

					display: flex;
					justify-content: center;
					button {
						margin: 0 0.2rem;
					}
					margin: 0.6rem;
					`
	if (answerButtonOnly)
		return (
			<div css={css}>
				{arePreviousAnswers && (
					<>
						<Button
							className="simple small"
							onClick={() => setShowAnswerModal(true)}
						>
							{emoji('📋 ')}
							Modifier mes réponses
						</Button>
					</>
				)}
				{showAnswerModal && (
					<Answers onClose={() => setShowAnswerModal(false)} />
				)}
			</div>
		)

	if (['/fin', '/actions'].includes(location.pathname))
		return (
			<div css={css}>
				{arePreviousAnswers ? (
					<Button
						className="simple small"
						onClick={() => {
							dispatch(goToQuestion(last(answeredQuestions)))
							history.push('/simulateur/bilan')
						}}
					>
						{emoji('📊 ')}
						Revenir à ma simulation
					</Button>
				) : (
					<Button
						className="plain"
						onClick={() => {
							history.push('/simulateur/bilan')
						}}
					>
						Faire le test
					</Button>
				)}
			</div>
		)

	return (
		<div css={css}>
			{arePreviousAnswers && (
				<>
					<Button
						className="simple small"
						onClick={() => setShowAnswerModal(true)}
					>
						{emoji('📋 ')}
						Modifier mes réponses
					</Button>
					<Button
						className="simple small"
						onClick={() => history.push(buildEndURL(evaluation))}
					>
						{emoji('💤 ')}
						Terminer
					</Button>
					{true && (
						<Button
							className="simple small"
							onClick={() => history.push('/actions')}
						>
							{emoji('💥 ')}
							Passer à l'action
						</Button>
					)}
				</>
			)}
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
		</div>
	)
}
