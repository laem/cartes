import {
	deletePreviousSimulation,
	loadPreviousSimulation,
	goToQuestion,
} from 'Actions/actions'
import React, { useEffect, useState } from 'react'
import { T } from 'Components'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	noUserInputSelector,
	analysisWithDefaultsSelector,
} from 'Selectors/analyseSelectors'
import emoji from 'react-easy-emoji'
import { Button } from 'Components/ui/Button'
import Answers from './conversation/AnswerList'
import { useLocation, useHistory } from 'react-router-dom'
import { last } from 'ramda'
import { extractCategories } from '../sites/publicodes/chart'

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

export default function SessionBar({ answerButtonOnly = false }) {
	const dispatch = useDispatch()
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)

	const foldedSteps = useSelector(
		(state: RootState) => state.conversationSteps.foldedSteps
	)
	const arePreviousAnswers = !!foldedSteps.length
	useEffect(() => {
		if (!arePreviousAnswers && previousSimulation)
			dispatch(loadPreviousSimulation())
	}, [])
	const [showAnswerModal, setShowAnswerModal] = useState(false)
	const analysis = useSelector(analysisWithDefaultsSelector)
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
							<T>Modifier mes réponses</T>
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
							dispatch(goToQuestion(last(foldedSteps)))
							history.push('/simulateur/bilan')
						}}
					>
						{emoji('📊 ')}
						<T>Revenir à ma simulation</T>
					</Button>
				) : (
					<Button
						className="plain"
						onClick={() => {
							history.push('/simulateur/bilan')
						}}
					>
						<T>Faire le test</T>
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
						<T>Modifier mes réponses</T>
					</Button>
					<Button
						className="simple small"
						onClick={() => history.push(buildEndURL(analysis))}
					>
						{emoji('💤 ')}
						<T>Terminer</T>
					</Button>
					{true && (
						<Button
							className="simple small"
							onClick={() => history.push('/actions')}
						>
							{emoji('💥 ')}
							<T>Passer à l'action</T>
						</Button>
					)}
				</>
			)}
			{showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />}
		</div>
	)
}
