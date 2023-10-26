'use client'
import { ConversationProps } from 'Components/conversation/Conversation'
import SearchButton from 'Components/SearchButton'
import * as animate from 'Components/ui/animate'
import React from 'react'
import AnswerList from './conversation/AnswerList'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'

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
			<AnswerList {...{ engine, searchParams, objectives }} />
		</>
	)
}
