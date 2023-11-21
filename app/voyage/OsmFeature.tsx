import Emoji from '@/components/Emoji'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import parseOpeningHours from 'opening_hours'

export default function OsmFeature({ data }) {
	const { name, opening_hours, phone, ...rest } = data.tags

	return (
		<div>
			<h2
				css={`
					margin: 0;
					margin-bottom: 0.6rem;
					font-size: 110%;
					line-height: 1.3rem;
				`}
			>
				{name}
			</h2>
			{opening_hours && <OpeningHours opening_hours={opening_hours} />}
			{phone && (
				<a href={`tel:${phone}`}>
					<Emoji e="☎️" /> {phone}
				</a>
			)}
			<div
				css={`
					> div {
						background: var(--lighterColor);
					}
				`}
			>
				<FriendlyObjectViewer data={rest} />
			</div>
		</div>
	)
}

const OpeningHours = ({ opening_hours }) => {
	const now = new Date()
	const oh = new parseOpeningHours(opening_hours, {
			address: { country_code: 'fr' },
		}),
		isOpen = oh.getState(),
		nextChange = oh.getNextChange()

	const formatDate = (date) => {
		const sameDay = date.getDay() === now.getDay()
		const weekday = sameDay ? undefined : 'long'

		const result = new Intl.DateTimeFormat('fr-FR', {
			hour: 'numeric',
			minute: 'numeric',
			weekday,
		}).format(nextChange)
		return result
	}
	return (
		<div
			css={`
				display: flex;
				align-items: center;
			`}
		>
			<details open={false}>
				<summary>
					<OpenIndicator isOpen={isOpen} /> {isOpen ? 'Ouvert' : 'Fermé'}{' '}
					jusqu'à {formatDate(nextChange)}
				</summary>

				{opening_hours}
			</details>
		</div>
	)
}

const OpenIndicator = ({ isOpen }) => (
	<span
		css={`
			display: inline-block;
			margin-right: 0.4rem;
			width: 1rem;
			height: 1rem;
			border-radius: 2rem;
			background: ${isOpen ? '#37c267' : '#b5325d'};
		`}
	></span>
)
