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
import styled from 'styled-components'
import CarbonImpact from '../sites/publicodes/CarbonImpact'
import { extractCategories } from '../sites/publicodes/chart'
import Answers from './conversation/AnswerList'

// TODO should be find the rewritten version of this from mon-entreprise and merge them ?

export const buildEndURL = (rules, engine) => {
	const categories = extractCategories(rules, engine),
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

	return `/fin?details=${detailsString}`
}

export default function SessionBar({ answerButtonOnly = false }) {
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

	const objectifs = useSelector(objectifsSelector)
	const rules = useSelector((state) => state.rules)
	const engine = useEngine(objectifs)

	const history = useHistory()
	const location = useLocation(),
		path = location.pathname

	let buttons = []
	if (answerButtonOnly)
		buttons = [
			arePreviousAnswers && (
				<>
					<Button
						className="simple small"
						onClick={() => setShowAnswerModal(true)}
					>
						{emoji('📋 ')}
						Modifier mes réponses
					</Button>
				</>
			),
			showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />,
		]

	if (path.includes('/fin') || path.includes('/actions'))
		buttons = [
			arePreviousAnswers ? (
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
			),
		]

	buttons = [
		...(arePreviousAnswers && [
			<Button
				key="modifier"
				className="simple small"
				onClick={() => setShowAnswerModal(true)}
			>
				{emoji('📋 ')}
				Modifier mes réponses
			</Button>,
			<Button
				key="terminer"
				className="simple small"
				onClick={() => history.push(buildEndURL(rules, engine))}
			>
				{emoji('💤 ')}
				Terminer
			</Button>,
			true && (
				<Button
					key="bouger"
					className="simple small"
					onClick={() => history.push('/actions')}
				>
					{emoji('💥 ')}
					Passer à l'action
				</Button>
			),
		]),
		showAnswerModal && <Answers onClose={() => setShowAnswerModal(false)} />,
	]

	return (
		<div
			css={`
				@media (max-width: 800px) {
					position: fixed;
					bottom: 0;
					left: 0;
					z-index: 10;
				}
			`}
		>
			<CarbonImpact />{' '}
			<NavBar>
				{buttons.filter(Boolean).map((Comp, i) => (
					<li key={i}>{Comp}</li>
				))}
			</NavBar>
		</div>
	)
}

const NavBar = styled.ul`
	display: flex;
	list-style-type: none;
	justify-content: center;
	button {
		margin: 0 0.2rem;
	}
	margin: 0;
	@media (max-width: 800px) {
		width: 100%;
		z-index: 10;
		background: white;
		display: flex;
		justify-content: center;
	}
`
