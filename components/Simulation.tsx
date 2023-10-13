'use client'
import { ConversationProps } from 'Components/conversation/Conversation'
import SearchButton from 'Components/SearchButton'
import * as animate from 'Components/ui/animate'
import React from 'react'
import AnswerList from './conversation/AnswerList'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
//TODO import { syncSearchParams } from './utils/useSearchParamsSimulationSharing'

type SimulationProps = {
	results?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
	showLinkToForm?: boolean
}

export default function Simulation({
	results,
	customEndMessages,
	customEnd,
	animation = 'appear',
	searchParams,
	objectives,
	rules,
	engine,
}: SimulationProps) {
	const Animation = animate[animation]
	return (
		<>
			<AnswerList {...{ engine, searchParams, objectives }} />
			<SearchButton invisibleButton />
			<Animation delay={0.3}>
				{results}

				<Conversation
					{...{
						engine,
						rules,
						customEnd,
						customEndMessages,
						objectives,
						searchParams,
					}}
				/>
			</Animation>
		</>
	)
}
