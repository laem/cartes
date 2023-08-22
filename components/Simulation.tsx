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
	explanations?: React.ReactNode
	results?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
	showLinkToForm?: boolean
	orderByCategories: Array<Object>
}

export default function Simulation({
	explanations,
	results,
	customEndMessages,
	customEnd,
	orderByCategories,
	showPeriodSwitch,
	animation = 'appear',
	rules,
	engine,
}: SimulationProps) {
	const Animation = animate[animation]
	//const situation = useSelector(situationSelector)
	//const searchParams = useParamsFromSituation(situation)
	// TODO syncSearchParams()
	return (
		<>
			<AnswerList engine={engine} rules={rules} />
			<SearchButton invisibleButton />
			<Animation delay={0.3}>
				{results}

				<Conversation
					engine={engine}
					rules={rules}
					orderByCategories={orderByCategories}
					customEnd={customEnd}
					customEndMessages={customEndMessages}
				/>
				{explanations}
			</Animation>
		</>
	)
}
