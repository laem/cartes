import Emoji from 'Components/Emoji'
import { omit } from 'Components/utils/utils'
import Address, { addressKeys } from 'Components/voyage/Address'
import ContactAndSocial from 'Components/voyage/ContactAndSocial'
import OsmLinks from 'Components/voyage/OsmLinks'
import Tags, { SoloTags } from 'Components/voyage/Tags'
import Wikipedia from 'Components/voyage/Wikipedia'
import languageIcon from '@/public/language.svg'
import Image from 'next/image'
import GareInfo from './GareInfo'
import Heritage, { isHeritageTag } from './osm/Heritage'
import { OpeningHours } from './osm/OpeningHours'
import getName, { getNameKeys, getNames } from './osm/getName'
import { getTagLabels } from './osmTagLabels'
import Brand, { Wikidata } from './tags/Brand'
import Stop, { isNotTransportStop, transportKeys } from './transport/stop/Stop'
import { computeSncfUicControlDigit } from './utils'

export default function OsmFeature({ data, transportStopData }) {
	if (!data.tags) return null
	const { tags } = data
	console.log('tags', tags)

	const id = data.id
	const featureType = data.type || data.featureType

	// Copy tags here that could be important to qualify the object with icons :
	// they should not be extracted, just copied

	const { leisure } = tags
	// Extract here tags that do not qualify the object : they won't be available
	// anymore in `rest`
	const {
		description,
		'name:br': nameBrezhoneg,
		opening_hours,
		phone: phone1,
		'contact:phone': phone2,
		'contact:mobile': phone3,
		email,
		'contact:email': email2,
		website: website1,
		'website:menu': menu,
		'contact:website': website2,
		'contact:instagram': instagram,
		'contact:facebook': facebook,
		'contact:whatsapp': whatsapp,
		'ref:FR:SIRET': siret,
		brand: brand,
		'brand:wikidata': brandWikidata,
		'brand:wikipedia': brandWikipedia,
		'ref:FR:Allocine': allocine,
		'ref:mhs': mérimée,
		admin_level: adminLevel,
		wikipedia,
		wikidata,
		image,
		...rest
	} = tags

	const isFrenchAdministration = tags['ref:FR:SIREN'] || tags['ref:INSEE'] // this is an attempt, edge cases can exist
	const frenchAdminLevel =
		isFrenchAdministration &&
		{
			3: 'Outre-mer français',
			4: 'Région française',
			5: 'Circonscription départementale',
			6: 'Département',
			7: 'Arrondissement départemental',
			8: 'Commune',
			9: 'Arrondissement municipal',
			10: 'Quartier',
		}[adminLevel]

	const phone = phone1 || phone2 || phone3,
		website = website1 || website2

	const name = getName(tags)
	const nameKeys = getNameKeys(tags)

	const filteredRest = omit([addressKeys, transportKeys, nameKeys].flat(), rest)

	const [keyValueTags, soloTags] = processTags(filteredRest)

	const filteredSoloTags = frenchAdminLevel
		? [
				...soloTags.filter((tag) => {
					return !['Limite administrative', 'Frontière'].includes(tag[1][0])
				}),
				['hexagone-contour.svg', [frenchAdminLevel]],
		  ]
		: soloTags

	return (
		<div
			css={`
				a {
					color: var(--darkColor);
				}
				> small {
					line-height: 0.9rem;
					display: inline-block;
				}
			`}
		>
			{' '}
			<SoloTags tags={filteredSoloTags} />
			<div
				css={`
					position: relative;
					margin-bottom: 0.8rem;
					h2 {
						margin: 0;
						margin-bottom: 0.3rem;
						font-size: 140%;
						line-height: 1.3rem;
					}
					details {
						margin-top: -2rem;
						summary {
							display: block;
							text-align: right;
						}
						summary img {
							width: 1.2rem;
							height: auto;
						}
						ul {
							margin-left: 1.6rem;
						}
					}
					small {
						text-align: right;
					}
					h3 {
						font-size: 105%;
					}
				`}
			>
				<h2>{name}</h2>
				<details css={``}>
					<summary title="Nom du lieu dans d'autres langues">
						<Image src={languageIcon} alt="Icône polyglotte" />
					</summary>
					<h3>Noms dans les autres langues : </h3>
					<ul>
						{getNames(tags).map(([key, [value, altNames]]) => (
							<li key={key}>
								<span
									css={`
										color: gray;
									`}
								>
									{key.replace('name:', '')}
								</span>{' '}
								: {value} {altNames.length > 0 && `, ${altNames.join(', ')}`}
							</li>
						))}
					</ul>
				</details>
				{nameBrezhoneg && nameBrezhoneg !== name && (
					<small>
						<Emoji extra="1F3F4-E0066-E0072-E0062-E0072-E0065-E007F" />{' '}
						{nameBrezhoneg}
					</small>
				)}
			</div>
			{description && <small>{description}</small>}
			{adminLevel && !frenchAdminLevel && (
				<div>
					<span>Niveau administratif : {adminLevel}</span>
				</div>
			)}
			<Address tags={tags} />
			{tags.uic_ref && (
				<GareInfo
					{...{
						nom: tags.name,
						uic8: tags.uic_ref + computeSncfUicControlDigit(tags.uic_ref),
					}}
				/>
			)}
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
						<Emoji e="🌍️" /> <span>Site web</span>
					</a>
				</div>
			)}
			{menu && (
				<div>
					<a href={menu} target="_blank" title="Menu">
						<Emoji e="📋" /> <span>Menu</span>
					</a>
				</div>
			)}
			{opening_hours && <OpeningHours opening_hours={opening_hours} />}
			<ContactAndSocial
				{...{ email: email || email2, instagram, facebook, whatsapp, siret }}
			/>
			{!isNotTransportStop(tags) && (
				<Stop tags={tags} data={transportStopData} />
			)}
			<Heritage tags={tags} />
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
	const translatedTags = Object.entries(filteredRest)
			// Tags to exclude because handled by other components that provide a test function
			.filter(([k, v]) => !isHeritageTag(k))
			.map(([key, value]) => {
				const tagLabels = getTagLabels(key, value)
				return [{ [key]: value }, tagLabels]
			}),
		keyValueTags = translatedTags.filter(([, t]) => t.length === 2),
		soloTags = translatedTags.filter(([, t]) => t.length === 1)

	return [keyValueTags, soloTags]
}
const cleanHttp = (v) => v.replace(/https?:\/\//g, '').replace(/www\./g, '')
