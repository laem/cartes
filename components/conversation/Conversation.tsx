'use client'

import { goToQuestion, updateSituation, validateStepWithValue } from '@/actions'
import { ferryQuestions } from 'Components/conversation/customQuestions/ferry'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { sortBy } from 'Components/utils/utils'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { objectifsSelector } from '../../selectors/simulationSelectors'
import useKeypress from '../utils/useKeyPress'
import './conversation.css'
import Conversation2 from './Conversation2'
import { airportsQuestions } from './customQuestions/airport'
import { isMosaic } from './mosaicQuestions'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customEnd?: React.ReactNode
	rules: object
}

export default function Conversation({
	customEndMessages,
	customEnd,
	orderByCategories,
	rules: rawRules,
	engine,
}: ConversationProps) {
	const dispatch = useDispatch()
	const rules = engine.getParsedRules()
	const nextQuestions = useNextQuestions(engine)
	const situation = useSelector(situationSelector)
	const previousAnswers = useSelector(answeredQuestionsSelector)
	const objectifs = useSelector(objectifsSelector)
	const previousSimulation = useSelector((state) => state.previousSimulation)

	const sortedQuestions = orderByCategories
		? sortBy((question) => {
				const categoryIndex = orderByCategories.findIndex(
					(c) => question.indexOf(c.dottedName) === 0
				)
				return categoryIndex * 1000 + nextQuestions.indexOf(question)
		  }, nextQuestions)
		: nextQuestions
	const unfoldedStep = useSelector((state) => state.simulation.unfoldedStep)
	const isMainSimulation = objectifs.length === 1 && objectifs[0] === 'bilan',
		currentQuestion = !isMainSimulation
			? nextQuestions[0]
			: unfoldedStep || sortedQuestions[0]

	useEffect(() => {
		// It is important to test for "previousSimulation" : if it exists, it's not loadedYet. Then currentQuestion could be the wrong one, already answered, don't put it as the unfoldedStep
		// TODO this is really unclear
		if (
			currentQuestion &&
			!previousSimulation &&
			currentQuestion !== unfoldedStep
		) {
			dispatch(goToQuestion(currentQuestion))
		}
	}, [dispatch, currentQuestion, previousAnswers, unfoldedStep, objectifs])

	// Some questions are grouped in an artifical questions, called mosaic questions,  not present in publicodes
	// here we need to submit all of them when the one that triggered the UI (we don't care which) is submitted, in order to see them in the response list and to avoid repeating the same n times

	const mosaicQuestion = currentQuestion && isMosaic(currentQuestion)

	const questionsToSubmit = airportsQuestions.includes(currentQuestion)
		? airportsQuestions
		: ferryQuestions.includes(currentQuestion)
		? ferryQuestions
		: mosaicQuestion
		? Object.entries(rules)
				.filter(([dottedName, value]) =>
					mosaicQuestion.isApplicable(dottedName)
				)
				.map(([dottedName]) => dottedName)
		: [currentQuestion]

	const submit = (source: string) => {
		if (mosaicQuestion?.options?.defaultsToFalse) {
			questionsToSubmit.map((question) =>
				dispatch(updateSituation(question, situation[question] || 'non'))
			)
		}

		questionsToSubmit.map((question) =>
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: question,
				source,
			})
		)
	}
	const setDefault = () =>
		// TODO: Skiping a question shouldn't be equivalent to answering the
		// default value (for instance the question shouldn't appear in the
		// answered questions).
		questionsToSubmit.map((question) =>
			dispatch(validateStepWithValue(question, undefined))
		)

	useKeypress('Escape', setDefault, [currentQuestion])
	useKeypress('Enter', () => submit('enter'), [currentQuestion])

	return (
		<Conversation2
			{...{
				currentQuestion,
				customEnd,
				customEndMessages,
				orderByCategories,
				previousAnswers,
				mosaicQuestion,
				rules,
				engine,
				submit,
				situation,
				unfoldedStep,
			}}
		/>
	)
}
