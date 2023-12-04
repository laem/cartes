import Emoji from '@/components/Emoji'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import Address from '@/components/voyage/Address'
import ContactAndSocial from '@/components/voyage/ContactAndSocial'
import Tags, { SoloTags } from '@/components/voyage/Tags'
import parseOpeningHours from 'opening_hours'
import { getTagLabels } from './osmTagLabels'

export default function OsmFeature({ data }) {
	if (!data.tags) return null
	const {
		name,
		'name:br': nameBrezhoneg,
		opening_hours,
		phone: phone1,
		'contact:phone': phone2,
		email,
		website: website1,
		'contact:website': website2,
		'contact:instagram': instagram,
		'contact:facebook': facebook,
		'ref:FR:SIRET': siret,
		...rest
	} = data.tags

	const phone = phone1 || phone2,
		website = website1 || website2

	const filteredRest = Object.fromEntries(
		Object.entries(rest).filter(([tag]) => !tag.includes('addr'))
	)

	const translatedTags = Object.entries(filteredRest).map(([key, value]) => {
			const tagLabels = getTagLabels(key, value)
			return tagLabels
		}),
		keyValueTags = translatedTags.filter((t) => t.length === 2),
		soloTags = translatedTags.filter((t) => t.length === 1)

	return (
		<div
			css={`
				margin-bottom: 1.6rem;
				a {
					color: var(--darkColor);
				}
			`}
		>
			<SoloTags tags={soloTags} />
			<h2
				css={`
					margin: 0;
					margin-bottom: 0.3rem;
					font-size: 140%;
					line-height: 1.3rem;
				`}
			>
				{name}
			</h2>
			{nameBrezhoneg && (
				<small>
					<Emoji extra="1F3F4-E0066-E0072-E0062-E0072-E0065-E007F" />{' '}
					{nameBrezhoneg}
				</small>
			)}
			<Address tags={data.tags} />
			{phone && (
				<div>
					<a href={`tel:${phone}`}>
						<Emoji e="☎️" /> {phone}
					</a>
				</div>
			)}

			{website && (
				<div>
					<a href={website} target="_blank" title="Site Web">
						<Emoji e="🌍️" /> <span>{cleanHttp(website)}</span>
					</a>
				</div>
			)}
			{opening_hours && <OpeningHours opening_hours={opening_hours} />}
			<ContactAndSocial {...{ email, instagram, facebook, siret }} />
			<Tags tags={keyValueTags} />
		</div>
	)
}

const cleanHttp = (v) => v.replace(/https?:\/\//g, '').replace(/www\./g, '')

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
				margin: 0.2rem 0;
				display: flex;
				align-items: center;
				summary {
					list-style-type: none;
					display: flex;
					align-items: center;
				}
			`}
		>
			<details open={false}>
				<summary>
					<OpenIndicator isOpen={isOpen} />{' '}
					<span>
						{isOpen ? 'Ouvert' : 'Fermé'} jusqu'à {formatDate(nextChange)}
					</span>
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
