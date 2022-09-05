import { hideNotification } from 'Actions/actions'
import animate from 'Components/ui/animate'
import { useEngine } from 'Components/utils/EngineContext'
import Engine, { RuleNode } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import './Notifications.css'
import { parentName } from './publicodesUtils'
import { Markdown } from './utils/markdown'
import { ScrollToElement } from './utils/Scroll'

// To add a new notification to a simulator, you should create a publicodes rule
// with the "type: notification" attribute. The display can be customized with
// the "sévérité" attribute. The notification will only be displayed if the
// publicodes rule is applicable.
type Notification = {
	dottedName: RuleNode['dottedName']
	description: RuleNode['rawNode']['description']
	sévérité: 'avertissement' | 'information' | 'invalide'
}

export function getNotifications(engine: Engine) {
	return Object.values(engine.getParsedRules())
		.filter(
			(rule) =>
				rule.rawNode['type'] === 'notification' &&
				!!engine.evaluate(rule.dottedName).nodeValue
		)
		.map(({ dottedName, rawNode: { sévérité, description } }) => ({
			dottedName,
			sévérité,
			description,
		}))
}

export function getCurrentNotification(
	engine,
	currentQuestion: RuleNode['dottedName']
) {
	const messages: Array<Notification> = getNotifications(
		engine
	) as Array<Notification>

	if (!messages?.length) return null
	// Here we filter notifications to not display them out of context
	// but this supposes that notifications would be well placed in termes of namespaces
	// for now we're using only one notifcation, so that's the behavior we want
	const filteredMessages = messages.filter(({ dottedName }) =>
		parentName(currentQuestion).includes(parentName(dottedName))
	)
	return filteredMessages
}

export default function Notifications({ currentQuestion }) {
	const { t } = useTranslation()
	const hiddenNotifications = useSelector(
		(state: RootState) => state.simulation?.hiddenNotifications
	)
	const engine = useEngine()

	const dispatch = useDispatch()

	const filteredMessages = getCurrentNotification(engine, currentQuestion)

	if (!filteredMessages) return null

	return (
		<div id="notificationsBlock">
			<ul style={{ margin: 0, padding: 0 }}>
				{filteredMessages.map(({ sévérité, dottedName, description }) =>
					hiddenNotifications?.includes(dottedName) ? null : (
						<animate.fromTop key={dottedName}>
							<li>
								<div role="alert" className="notification">
									{emoji(
										sévérité == 'avertissement'
											? '⚠️'
											: sévérité == 'invalide'
											? '🚫'
											: '💁🏻'
									)}
									<div className="notificationText ui__ card">
										<Markdown>{description}</Markdown>
										{sévérité !== 'invalide' && (
											<button
												className="hide"
												aria-label="close"
												onClick={() => dispatch(hideNotification(dottedName))}
											>
												×
											</button>
										)}
									</div>
								</div>
							</li>
							<ScrollToElement />
						</animate.fromTop>
					)
				)}
			</ul>
		</div>
	)
}
