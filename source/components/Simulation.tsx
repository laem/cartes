import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import SeeAnswersButton from 'Components/conversation/SeeAnswersButton'
import PageFeedback from 'Components/Feedback/PageFeedback'
import Notifications from 'Components/Notifications'
import SearchButton from 'Components/SearchButton'
import * as Animate from 'Components/ui/animate'
import Progress from 'Components/ui/Progress'
import { useSimulationProgress } from 'Components/utils/useNextQuestion'
import React from 'react'
import { Trans } from 'react-i18next'
import LinkToForm from './Feedback/LinkToForm'

type SimulationProps = {
	explanations?: React.ReactNode
	results?: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
	showPeriodSwitch?: boolean
	showLinkToForm?: boolean
	teaseCategories: boolean
}

export default function Simulation({
	explanations,
	results,
	customEndMessages,
	teaseCategories,
	showLinkToForm,
	showPeriodSwitch,
}: SimulationProps) {
	return (
		<>
			<SearchButton invisibleButton />
			<Animate.fromTop>
				{results}
				<Questions
					teaseCategories={teaseCategories}
					customEndMessages={customEndMessages}
				/>
				<br />
				{showLinkToForm && <LinkToForm />}
				{!showLinkToForm && (
					<PageFeedback
						customMessage={
							<Trans i18nKey="feedback.simulator">
								Êtes-vous satisfait de ce simulateur ?
							</Trans>
						}
						customEventName="rate simulator"
					/>
				)}{' '}
				{explanations}
			</Animate.fromTop>
		</>
	)
}

function Questions({
	customEndMessages,
	teaseCategories,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
	teaseCategories: Boolean
}) {
	const progress = useSimulationProgress()

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					marginTop: '1.2rem',
					marginBottom: '0.6rem',
				}}
			>
				{progress < 1 ? (
					<small css="padding: 0.4rem 0">
						<Trans i18nKey="simulateurs.précision.défaut">
							Affinez la simulation en répondant aux questions :
						</Trans>
					</small>
				) : (
					<span />
				)}
				<SeeAnswersButton />
			</div>
			<section className="ui__ full-width lighter-bg">
				<div className="ui__ container">
					<Notifications />
					<Conversation
						teaseCategories={teaseCategories}
						customEndMessages={customEndMessages}
					/>
				</div>
			</section>
			{progress < 1 && (
				<Progress progress={progress} className="ui__ full-width" />
			)}
		</>
	)
}
