'use client'
import Publicodes, { formatValue } from 'publicodes'
import rules from './data/rules'
import exemples from './data/exemples.yaml'
import {
	ExplanationBlock,
	HorizontalOl,
	Table,
	VerticalOl,
} from './ExempleTableUI'
import { useState } from 'react'
import Passengers, { PersonImage } from './Passengers'
import Emoji from '@/components/Emoji'

export default function ExempleTable() {
	const engine = new Publicodes(rules),
		objective = 'voyage . trajet voiture . coût trajet par personne'
	const distances = exemples.dimensions[0],
		voiture = exemples.dimensions[1]

	const [passengers, setPassengers] = useState(1)

	return (
		<div>
			<Passengers {...{ passengers, setPassengers }} />
			<Table>
				<HorizontalOl $header>
					<li key={'distance'}>Distance</li>
					{voiture.valeurs.map((element2) => (
						<li key={element2.titre}>{element2.titre}</li>
					))}
				</HorizontalOl>
				<VerticalOl>
					{distances.valeurs.map((element, i) => (
						<li key={element.titre}>
							<HorizontalOl $spotlight={i === 0}>
								<li>
									{element.titre}
									<small>{element['sous-titre']}</small>
								</li>

								{voiture.valeurs.map((element2) => (
									<li key={element2.titre}>
										{formatValue(
											engine
												.setSituation({
													...element.situation,
													...element2.situation,
													'trajet . voyageurs': passengers,
												})
												.evaluate(objective).nodeValue,
											{ precision: i === 0 ? 2 : 0 }
										)}
										<small>
											&nbsp; € / <PersonImage />
										</small>
									</li>
								))}
							</HorizontalOl>
						</li>
					))}
				</VerticalOl>
			</Table>
			<Explanation {...{ distances, voiture, engine, objective, passengers }} />
		</div>
	)
}

const plural = (integer) => (integer > 1 ? 's' : '')
export const Explanation = ({
	distances,
	voiture,
	engine,
	objective,
	passengers,
}) => {
	const { titre, 'sous-titre': subTitle } = distances.valeurs[0]
	return (
		<ExplanationBlock>
			<Emoji e="🧑‍🏫" />
			<p>
				Interprétation : pour un trajet <strong>{subTitle}</strong> de{' '}
				<strong>{titre}</strong> , en citadine diesel, pour {passengers}{' '}
				voyageur{plural(passengers)} (soit 1 conducteur et {passengers - 1}{' '}
				passager{plural(passengers)}, le coût du trajet par personne est de x €,
				la valeur indiquée dans le tableau.
			</p>
		</ExplanationBlock>
	)
}
