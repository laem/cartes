'use client'
import { updateSituation } from '@/actions'
import RuleInput, { RuleInputProps } from 'Components/conversation/RuleInput'
import Notifications from 'Components/Notifications'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Card } from '../UI'
import Aide from './Aide'
import './conversation.css'
import { isVoyageQuestion } from './customQuestions/voyageInput'
import { ExplicableRule } from './Explicable'
import { isMosaic } from './mosaicQuestions'
import SimulationEnding from './SimulationEnding'
import { Fieldset, StepButtons } from './UI'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customEnd?: React.ReactNode
}

const Conversation2 = ({
	query,
	currentQuestion,
	customEnd,
	customEndMessages,
	previousAnswers,
	mosaicQuestion,
	rules,
	engine,
	situation,
	setDefault,
}) => {
	const dispatch = useDispatch()

	const onChange: RuleInputProps['onChange'] = (value) => {
		dispatch(updateSituation(currentQuestion, value))
	}

	const questionText = mosaicQuestion
		? mosaicQuestion.question
		: rules[currentQuestion]?.rawNode?.question

	if (!currentQuestion)
		return <SimulationEnding {...{ customEnd, customEndMessages }} />

	const hasDescription =
		((mosaicQuestion &&
			(mosaicQuestion.description ||
				rules[mosaicQuestion.dottedName].rawNode.description)) ||
			rules[currentQuestion].rawNode.description) != null

	const currentQuestionIsAnswered =
		currentQuestion && isMosaic(currentQuestion)
			? true
			: situation[currentQuestion] != null

	return (
		<section
			css={`
				@media (max-width: 800px) {
					padding: 0.4rem 0 0.4rem;
				}

				@media (min-width: 800px) {
					margin-top: 0.6rem;
				}
				border-radius: 0.6rem;
			`}
		>
			<div style={{ outline: 'none' }}>
				<Card $fullWidth $noHoverEffect>
					<div className="step">
						<header css="display: flex; justify-content: start; ">
							<h3
								css={`
									margin: 0.6rem 0;
									@media (max-width: 800px) {
										margin: 0.4rem 0;
									}
								`}
							>
								{questionText}
							</h3>
							{hasDescription && (
								<ExplicableRule
									dottedName={
										(mosaicQuestion && mosaicQuestion.dottedName) ||
										currentQuestion
									}
								/>
							)}
						</header>
						<Aide rules={rules} />
						<Fieldset>
							<RuleInput
								dottedName={currentQuestion}
								onChange={onChange}
								query={query}
								engine={engine}
							/>
						</Fieldset>
					</div>
				</Card>
				<StepButtons>
					{previousAnswers.length > 0 && currentQuestionIndex !== 0 && (
						<>Précédent</>
					)}
					{currentQuestionIsAnswered ? (
						<Link
							href={{
								query,
							}}
							prefetch={false}
							scroll={false}
						>
							<span className="text">Suivant →</span>
						</Link>
					) : (
						!isVoyageQuestion(currentQuestion) && (
							<Link
								href={{
									query,
								}}
								prefetch={false}
								scroll={false}
							>
								Je ne sais pas
							</Link>
						)
					)}
				</StepButtons>
				<Notifications currentQuestion={currentQuestion} engine={engine} />
			</div>
		</section>
	)
}

export default Conversation2
