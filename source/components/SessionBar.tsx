import { goToQuestion, loadPreviousSimulation } from 'Actions/actions'
import { extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { last } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import {
	answeredQuestionsSelector,
	objectifsSelector,
} from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import CarbonImpact from '../sites/publicodes/CarbonImpact'

export const actionImg = 'https://openmoji.org/data/black/svg/E10C.svg'

const Button = styled.button`
	margin: 0 0.2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 80%;
	color: var(--darkColor);
	@media (min-width: 800px) {
		flex-direction: row;
		justify-content: start;
		padding: 0;
		font-size: 100%;
	}
	> img {
		display: block;
		font-size: 200%;
		margin: 0.6rem !important;
		@media (max-width: 800px) {
			margin: 0 !important;
		}
	}
`

export const sessionBarMargin = `
		@media (max-width: 800px) {
			margin-bottom: 10rem;
		}
`

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

export const useSafePreviousSimulation = () => {
	const previousSimulation = useSelector(
		(state: RootState) => state.previousSimulation
	)

	const dispatch = useDispatch()
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const arePreviousAnswers = !!answeredQuestions.length
	useEffect(() => {
		if (!arePreviousAnswers && previousSimulation)
			dispatch(loadPreviousSimulation())
	}, [])
}

export default function SessionBar({
	answerButtonOnly = false,
	noResults = false,
}) {
	const dispatch = useDispatch()
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const arePreviousAnswers = !!answeredQuestions.length
	useSafePreviousSimulation()
	const [showAnswerModal, setShowAnswerModal] = useState(false)

	const objectifs = useSelector(objectifsSelector)
	const rules = useSelector((state) => state.rules)
	const engine = useEngine(objectifs)

	const history = useHistory()
	const location = useLocation(),
		path = location.pathname

	const buttonStyle = (pathTarget) =>
		path.includes(pathTarget)
			? `
		font-weight: bold;
		img {
		  background: var(--lighterColor);
		  border-radius: .6rem;
		}
		`
			: ''
	let buttons = [
		<Button
			className="simple small"
			onClick={() => {
				dispatch(goToQuestion(last(answeredQuestions)))
				history.push('/simulateur/bilan')
			}}
			css={buttonStyle('simulateur')}
		>
			<img
				src="https://openmoji.org/data/black/svg/25B6.svg"
				css="width: 2rem"
			/>
			Le test
		</Button>,
		<Button
			className="simple small"
			onClick={() => {
				history.push('/actions/liste')
			}}
			css={buttonStyle('/actions')}
		>
			<img src={actionImg} css="width: 2rem" />
			Agir
		</Button>,
		<Button
			className="simple small"
			onClick={() => history.push('/profil')}
			css={buttonStyle('profil')}
		>
			<img
				src="https://openmoji.org/data/black/svg/1F464.svg"
				css="width: 2rem"
			/>
			Mon profil
		</Button>,
		(true || NODE_ENV === 'development') && (
			<Button
				key="personas"
				className="simple small"
				onClick={() => history.push('/personas')}
				css={buttonStyle('personas')}
			>
				<img
					src="https://openmoji.org/data/black/svg/1F465.svg"
					css="width: 2rem"
				/>
				Personas
			</Button>
		),
	]

	return (
		<div
			css={`
				margin: 1rem 0 2rem;

				@media (max-width: 800px) {
					margin: 0;
					position: fixed;
					bottom: 0;
					left: 0;
					z-index: 100;
					width: 100%;
				}
			`}
		>
			{buttons.filter(Boolean).length > 0 && (
				<NavBar>
					{buttons.filter(Boolean).map((Comp, i) => (
						<li key={i}>{Comp}</li>
					))}
				</NavBar>
			)}
		</div>
	)
}

const NavBar = styled.ul`
	display: flex;
	box-shadow: rgb(187 187 187) 2px 2px 10px;
	list-style-type: none;
	justify-content: space-evenly !important;
	align-items: center;
	height: 3.5rem;
	margin: 0;
	width: 100%;
	height: 4rem;
	background: white;
	justify-content: center;
	padding: 0;

	@media (min-width: 800px) {
		margin-top: 1rem;
		flex-direction: column;
		height: auto;
		background: none;
		justify-content: start;
		box-shadow: none;
		li {
			width: 100%;
		}
	}
`
