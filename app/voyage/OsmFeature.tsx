import Emoji from '@/components/Emoji'
import { omit } from '@/components/utils/utils'
import Address, { addressKeys } from '@/components/voyage/Address'
import ContactAndSocial from '@/components/voyage/ContactAndSocial'
import OsmLinks from '@/components/voyage/OsmLinks'
import Tags, { SoloTags } from '@/components/voyage/Tags'
import Wikipedia from '@/components/voyage/Wikipedia'
import parseOpeningHours from 'opening_hours'
import { getTagLabels } from './osmTagLabels'
import Brand, { Wikidata } from './tags/Brand'
import Stop, { isNotTransportStop, transportKeys } from './transport/stop/Stop'
import Image from 'next/image'

export default function OsmFeature({ data, transportStopData }) {
	if (!data.tags) return null
	console.log('tags', data.tags)

	const id = data.id
	const featureType = data.type || data.featureType

	// Copy tags here that could be important to qualify the object with icons :
	// they should not be extracted, just copied

	const { leisure } = data.tags
	// Extract here tags that do not qualify the object : they won't be available
	// anymore in `rest`
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
		'ref:mhs': mérimée,
		wikipedia,
		wikidata,
		image,
		...rest
	} = data.tags

	const phone = phone1 || phone2 || phone3,
		website = website1 || website2

	const filteredRest = omit([...addressKeys, ...transportKeys], rest)

	const [keyValueTags, soloTags] = processTags(filteredRest)

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
			{' '}
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
			{mérimée && (
				<a
					href={`https://www.pop.culture.gouv.fr/notice/merimee/${mérimée}`}
					target="_blank"
					title="Lien vers la fiche sur la plateforme ouverte du patrimoine"
				>
					🏛️ Fiche patrimoine
				</a>
			)}
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
			{!isNotTransportStop(data.tags) && (
				<Stop tags={data.tags} data={transportStopData} />
			)}
			{allocine && (
				<a
					href={`https://www.allocine.fr/seance/salle_gen_csalle=${allocine}.html`}
					target="_blank"
					title="Lien vers la fiche cinéma sur Allocine"
				>
					Fiche Allociné
				</a>
			)}
			{leisure && leisure == 'playground' && (
				<a
					href={`https://playguide.eu/app/osm/${featureType}/${id}`}
					target="_blank"
					title="Lien vers la fiche de l'aire sur PlayGuide"
					css={`
						display: flex;
						align-items: center;
						img {
							margin-right: 0.6rem;
							width: 1.2rem;
							height: auto;
						}
					`}
				>
					<Image
						src="https://playguide.eu/assets/logo-pentagon.svg"
						alt="Logo du site PlayGuide"
						width="10"
						height="10"
					/>
					Fiche PlayGuide
				</a>
			)}
			<Brand {...{ brand, brandWikidata, brandWikipedia }} />
			<Tags tags={keyValueTags} />
			{wikidata && <Wikidata id={wikidata} />}
			<OsmLinks data={data} />
		</div>
	)
}

export const processTags = (filteredRest) => {
	const translatedTags = Object.entries(filteredRest).map(([key, value]) => {
			const tagLabels = getTagLabels(key, value)
			return [{ [key]: value }, tagLabels]
		}),
		keyValueTags = translatedTags.filter(([, t]) => t.length === 2),
		soloTags = translatedTags.filter(([, t]) => t.length === 1)

	return [keyValueTags, soloTags]
}
const cleanHttp = (v) => v.replace(/https?:\/\//g, '').replace(/www\./g, '')

const getOh = (opening_hours) => {
	try {
		const oh = new parseOpeningHours(opening_hours, {
				address: { country_code: 'fr' },
			}),
			isOpen = oh.getState(),
			nextChange = oh.getNextChange()

		const intervals = oh.getOpenIntervals(
			new Date(),
			new Date(new Date().setDate(new Date().getDate() + 7))
		)
		return { isOpen, nextChange, intervals }
	} catch (e) {
		console.log('Error parsing opening hours', e)
		return { isOpen: 'error', nextChange: 'error' }
	}
}
const OpeningHours = ({ opening_hours }) => {
	const now = new Date()

	const { isOpen, nextChange, intervals } = getOh(opening_hours)

	const formatDate = (date) => {
		const sameDay = date.getDay() === now.getDay()
		const weekday = sameDay ? undefined : 'long'

		const result = new Intl.DateTimeFormat('fr-FR', {
			hour: 'numeric',
			minute: 'numeric',
			weekday,
		}).format(date)
		return result
	}

	const hourFormatter = new Intl.DateTimeFormat('fr-FR', {
		hour: 'numeric',
		minute: 'numeric',
	})

	const dayFormatter = new Intl.DateTimeFormat('fr-FR', {
		weekday: 'long',
	})

	const ohPerDay = intervals
		? intervals.reduce(
				(memo, next) => {
					const [from, to] = next
					const fromDay = dayFormatter.format(from)
					const toDay = dayFormatter.format(to)

					const simple = (h) => hourFormatter.format(h).replace(':00', 'h')
					const error = toDay !== fromDay
					const fromHour = simple(from),
						toHour = simple(to)
					const range = fromHour + ' - ' + toHour

					return {
						...memo,
						[fromDay]: [...(memo[fromDay] || []), range],
						error: memo.error || error,
					}
				},
				{ error: false }
		  )
		: {}

	console.log(ohPerDay)
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
					<OpenIndicator isOpen={isOpen === 'error' ? false : isOpen} />{' '}
					{isOpen === 'error' && <span>Problème dans les horaires</span>}
					{nextChange === 'error' ? null : !nextChange ? (
						<span>Ouvert 24/24 7j/7</span>
					) : (
						<span>
							{isOpen ? 'Ouvert' : 'Fermé'} jusqu'à {formatDate(nextChange)}
						</span>
					)}
				</summary>

				{intervals != null && !ohPerDay.error ? (
					<ul
						css={`
							padding-left: 2rem;
							width: 100%;
							> li {
								display: flex;
								justify-content: space-between;
								> span {
									margin-right: 2rem;
								}
							}
							> li > ul {
								display: flex;
								list-style-type: none;
								li {
									margin: 0 0.4rem;
								}
							}
						`}
					>
						{Object.entries(ohPerDay).map(
							([day, ranges]) =>
								day !== 'error' && (
									<li key={day}>
										<span>{day}</span>
										<ul>
											{ranges.map((hour) => (
												<li key={hour}>{hour}</li>
											))}
										</ul>
									</li>
								)
						)}
					</ul>
				) : (
					opening_hours
				)}
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
