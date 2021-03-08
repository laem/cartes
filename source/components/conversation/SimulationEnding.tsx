import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'

export default ({ customEnd, customEndMessages }) => (
	<div style={{ textAlign: 'center' }}>
		{customEnd || (
			<>
				<h3>
					{emoji('🌟')}{' '}
					<Trans i18nKey="simulation-end.title">
						Vous avez complété cette simulation
					</Trans>
				</h3>
				<p>
					{customEndMessages ? (
						customEndMessages
					) : (
						<Trans i18nKey="simulation-end.text">
							Vous avez maintenant accès à l'estimation la plus précise
							possible.
						</Trans>
					)}
				</p>
			</>
		)}
	</div>
)
