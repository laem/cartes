import Emoji from '@/components/Emoji'
import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { omit } from '@/components/utils/utils'
import Address, { addressKeys } from '@/components/voyage/Address'
import ContactAndSocial from '@/components/voyage/ContactAndSocial'
import OsmLinks from '@/components/voyage/OsmLinks'
import Tags, { SoloTags } from '@/components/voyage/Tags'
import Wikipedia from '@/components/voyage/Wikipedia'
import parseOpeningHours from 'opening_hours'
import { getTagLabels } from './osmTagLabels'
import Brand, { Wikidata } from './tags/Brand'
import TransportStop, {
	isNotTransportStop,
	transportKeys,
} from './transport/TransportStop'

export default function OsmFeature({ data }) {
	if (!data.tags) return null
	const {
		name,
		description,
		'name:br': nameBrezhoneg,
		opening_hours,
		phone: phone1,
		'contact:phone': phone2,
		'contact:mobile': phone3,
		email,
		'contact:email': email2,
		website: website1,
		'contact:website': website2,
		'contact:instagram': instagram,
		'contact:facebook': facebook,
		'ref:FR:SIRET': siret,
		brand: brand,
		'brand:wikidata': brandWikidata,
		'brand:wikipedia': brandWikipedia,
		'ref:FR:Allocine': allocine,
		wikipedia,
		wikidata,
		...rest
	} = data.tags

	const phone = phone1 || phone2 || phone3,
		website = website1 || website2

	const filteredRest = omit([...addressKeys, ...transportKeys], rest)

	const translatedTags = Object.entries(filteredRest).map(([key, value]) => {
			const tagLabels = getTagLabels(key, value)
			return tagLabels
		}),
		keyValueTags = translatedTags.filter((t) => t.length === 2),
		soloTags = translatedTags
			.filter((t) => t.length === 1)
			.filter(([t]) => name && !name.toLowerCase().includes(t.toLowerCase()))

	return (
		<div
			css={`
				a {
					color: var(--darkColor);
				}
				small {
					line-height: 0.9rem;
					display: inline-block;
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
			{description && <small>{description}</small>}
			{nameBrezhoneg && (
				<small>
					<Emoji extra="1F3F4-E0066-E0072-E0062-E0072-E0065-E007F" />{' '}
					{nameBrezhoneg}
				</small>
			)}
			<Address tags={data.tags} />
			{wikipedia && wikipedia.includes(':') && <Wikipedia name={wikipedia} />}
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
			<ContactAndSocial
				{...{ email: email || email2, instagram, facebook, siret }}
			/>
			{!isNotTransportStop(data.tags) && <TransportStop tags={data.tags} />}

			{allocine && (
				<a
					href={`https://www.allocine.fr/seance/salle_gen_csalle=${allocine}.html`}
					target="_blank"
					title="Lien vers la fiche cinéma sur Allocine"
				>
					Fiche Allociné
				</a>
			)}
			<Brand {...{ brand, brandWikidata, brandWikipedia }} />
			<Tags tags={keyValueTags} />
			{wikidata && <Wikidata id={wikidata} />}
			<OsmLinks data={data} />
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
					{!nextChange ? (
						<span>Ouvert 24/24 7j/7</span>
					) : (
						<span>
							{isOpen ? 'Ouvert' : 'Fermé'} jusqu'à {formatDate(nextChange)}
						</span>
					)}
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
			margin: 0 0.4rem;
			width: 1rem;
			height: 1rem;
			border-radius: 2rem;
			background: ${isOpen ? '#37c267' : '#b5325d'};
		`}
	></span>
)
