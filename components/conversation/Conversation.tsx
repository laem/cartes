'use client'

import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { sortBy } from 'Components/utils/utils'
import React from 'react'
import { useDispatch } from 'react-redux'
import { getFoldedSteps, getSituation } from '../utils/simulationUtils'
import useKeypress from '../utils/useKeyPress'
import './conversation.css'
import Conversation2 from './Conversation2'
import {
	airportsQuestions,
	ferryQuestions,
	voyageQuestions,
} from './customQuestions/voyageInput'
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
	searchParams,
	objectives,
}: ConversationProps) {
	const dispatch = useDispatch()
	const rules = engine.getParsedRules()

	const nextQuestions = useNextQuestions(objectives, engine, searchParams)
	const validatedSituation = getSituation(searchParams, rules)
	const foldedSteps = getFoldedSteps(searchParams, rules)

	const sortedQuestions = orderByCategories
		? sortBy((question) => {
				const categoryIndex = orderByCategories.findIndex(
					(c) => question.indexOf(c.dottedName) === 0
				)
				return categoryIndex * 1000 + nextQuestions.indexOf(question)
		  }, nextQuestions)
		: nextQuestions

	const currentQuestion = nextQuestions[0]

	// Some questions are grouped in an artifical questions, called mosaic questions,  not present in publicodes
	// here we need to submit all of them when the one that triggered the UI (we don't care which) is submitted, in order to see them in the response list and to avoid repeating the same n times

	const mosaicQuestion = currentQuestion && isMosaic(currentQuestion)

	const questionsToSubmit = airportsQuestions.includes(currentQuestion)
		? airportsQuestions
		: ferryQuestions.includes(currentQuestion)
		? ferryQuestions
		: voyageQuestions.includes(currentQuestion)
		? voyageQuestions
		: mosaicQuestion
		? Object.entries(rules)
				.filter(([dottedName, value]) =>
					mosaicQuestion.isApplicable(dottedName)
				)
				.map(([dottedName]) => dottedName)
		: [currentQuestion]

	const query = Object.fromEntries(
		questionsToSubmit.map((question) => [
			question,
			validatedSituation[question],
		])
	)

	const setDefault = () =>
		// TODO: Skiping a question shouldn't be equivalent to answering the
		// default value (for instance the question shouldn't appear in the
		// answered questions).
		null

	useKeypress('Escape', setDefault, [currentQuestion])
	useKeypress('Enter', () => submit('enter'), [currentQuestion])

	return (
		<Conversation2
			{...{
				query,
				currentQuestion,
				customEnd,
				customEndMessages,
				orderByCategories,
				previousAnswers: [], //TODO
				mosaicQuestion,
				rules,
				engine,
				situation: validatedSituation,
				setDefault,
			}}
		/>
	)
}
