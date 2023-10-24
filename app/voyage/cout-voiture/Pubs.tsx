'use client'
import Image from 'next/image'
import rules from '@/app/voyage/cout-voiture/data/rules'
import Publicodes, { formatValue } from 'publicodes'
import { styled } from 'styled-components'
import pubs from './pubs.yaml'
import Markdown from 'markdown-to-jsx'

const engine = new Publicodes(rules)
const target = 'voyage . trajet voiture . coût trajet par personne'
export default function Pubs() {
	return pubs.map((data) => <Pub data={data} key={data.titre} />)
}
function Pub({ data }) {
	const { situation, titre, image } = data
	const newSituation = {
		...situation,
		'voyage . trajet voiture . distance': 'voyage . voiture . distance totale',
	}
	const newEngine = engine.setSituation(newSituation),
		total = formatValue(newEngine.evaluate(target), {
			precision: 0,
			displayedUnit: '€',
		}),
		lifeTime = newEngine.evaluate('voyage . voiture . durée de vie').nodeValue
	const perKm = formatValue(
		newEngine
			.setSituation({
				...newSituation,
				'voyage . trajet voiture . distance': 1,
			})
			.evaluate(target),
		{ precision: 2, displayedUnit: '€ / km' }
	)
	const isElec =
		situation['voyage . voiture . motorisation'].includes('électrique')

	return (
		<div
			css={`
				margin: 3rem auto;
				position: relative;
				height: 30rem;
				> div,
				> img {
					position: absolute;
					top: 0;
					right: 0;
				}
				img {
					width: 100%;
					height: auto;
				}
				> div {
					right: 1rem;
				}
				div > p {
					margin: 1.6rem 0;
					text-align: right;
					height: inherit;
					top: 2rem;
					right: 5rem;
					color: black;
					font-size: 260%;
					max-width: 30rem;
					em {
						font-size: 150%;
						font-style: normal;
					}
				}
			`}
		>
			<Image
				src={'/voiture/' + data.image}
				alt={"Belle photo publicitaire d'une " + data.titre}
				width={500}
				height={500}
			/>
			<div>
				<p>
					<Markdown>{titre}</Markdown>
				</p>
				<br />
				<p>
					<Small>Accessible dès </Small>
				</p>
				<p>
					<em>{total} </em>
				</p>
				<p>
					<Small> sur {lifeTime} ans </Small>
				</p>
				<p>
					<Small>
						<WhiteBackground>Soit {perKm}</WhiteBackground>
					</Small>
				</p>
			</div>
			<Legend>
				{isElec ? 'Électricité' : 'Carburant'}, péages, achat, parking,
				assurance, entretien, lavage, équipements, accidents, infractions
				{isElec ? ', et bonus écologique inclus.' : '.'}
			</Legend>
		</div>
	)
}
const Small = styled.small`
	font-size: 75%;
`

const Legend = styled.p`
	font-style: italic;
	font-size: 100%;
	text-align: right;
	color: black;
	line-height: 0.9rem;
	background: #ffffff90;
	padding: 1rem 0.4rem;
	position: absolute;
	bottom: 0;
	right: 0 !important;
	top: unset !important;
	height: unset !important;
	margin: 0;
	max-width: 30rem;
	padding: 0.6rem;
`

const WhiteBackground = styled.span`
	background: #ffffff90;
	padding: 0 0.4rem;
`
