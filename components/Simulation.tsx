'use client'
import SearchButton from 'Components/SearchButton'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import * as animate from 'Components/ui/animate'
import React from 'react'
import AnswerList from './conversation/AnswerList'

type SimulationProps = {
	results?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
	showLinkToForm?: boolean
}

export default function Simulation({
	results,
	animation = 'appear',
	searchParams,
	objectives,
	rules,
	engine,
}: SimulationProps) {
	const Animation = animate[animation]
	return (
		<>
			<SearchButton invisibleButton />
			<AnswerList {...{ engine, searchParams, objectives }} />
			<Animation delay={0.3}>
				{results}
				<Conversation
					{...{
						engine,
						rules,
						objectives,
						searchParams,
					}}
				/>
			</Animation>
		</>
	)
}
