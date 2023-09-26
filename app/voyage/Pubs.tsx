'use client'
import Image from 'next/image'
import zoe from '@/public/voiture/zoé.jpg'
import rules from '@/app/voyage/data/rules'
import Publicodes, { formatValue } from 'publicodes'
import { styled } from 'styled-components'

const engine = new Publicodes(rules)
export default function Pubs() {
	const target = 'trajet voiture . coût trajet par personne'
	const newEngine = engine.setSituation({
			'trajet voiture . distance': 'voiture . distance totale',
			'voiture . motorisation': '"électrique"',
			"voiture . prix d'achat": 30000,
		}),
		total = formatValue(newEngine.evaluate(target), {
			precision: 0,
			displayedUnit: '€',
		}),
		lifeTime = newEngine.evaluate('voiture . durée de vie').nodeValue
	const perKm = formatValue(
		newEngine
			.setSituation({
				'trajet voiture . distance': 1,
			})
			.evaluate(target),
		{ precision: 2, displayedUnit: '€ / km' }
	)

	return (
		<div
			css={`
				position: relative;
				height: 30rem;
				> div,
				> img {
					position: absolute;
					top: 0;
					right: 0;
				}
				img {
					width: auto;
					height: inherit;
				}
				> div {
					right: 1rem;
				}
				p {
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
			<Image src={zoe} />
			<div>
				<p>
					Nouvelle Renault <strong>ZOE</strong>
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
				<br />
				<p>
					<SuperSmall>
						Essence, péages, achat, parking, assurance, entretien, lavage,
						équipements, accidents, infractions, et bonus écologique inclus.
					</SuperSmall>
				</p>
			</div>
		</div>
	)
}
const Small = styled.small`
	font-size: 75%;
`

const SuperSmall = styled.small`
	font-size: 40%;
	line-height: 0.1rem;
`

const WhiteBackground = styled.span`
	background: #ffffff90;
`
