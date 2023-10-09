'use client'

import { situationSelector } from '@/selectors/simulationSelectors'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { sortBy } from 'Components/utils/utils'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	encodeDottedName,
	encodeValue,
	getFoldedSteps,
	getSituation,
} from '../utils/simulationUtils'
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
	console.log('SP from conv', searchParams)
	const validatedSituation = getSituation(searchParams, rules)
	const situation = useSelector(situationSelector)
	const foldedSteps = getFoldedSteps(searchParams, rules)

	const sortedQuestions = orderByCategories
		? sortBy((question) => {
				const categoryIndex = orderByCategories.findIndex(
					(c) => question.indexOf(c.dottedName) === 0
				)
				return categoryIndex * 1000 + nextQuestions.indexOf(question)
		  }, nextQuestions)
		: nextQuestions

	console.log('NEXTQ', nextQuestions)
	console.log('situation', situation)
	console.log('validatedSituation', validatedSituation)
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
		: currentQuestion === undefined
		? []
		: [currentQuestion]

	console.log(situation)
	const newSituation = Object.fromEntries(
		questionsToSubmit.map((q) => [
			encodeDottedName(q),
			encodeValue(situation[q]),
		])
	)
	const query = {
		...searchParams,
		...newSituation,
	}

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
				validatedSituation,
				situation,
				setDefault,
			}}
		/>
	)
}
