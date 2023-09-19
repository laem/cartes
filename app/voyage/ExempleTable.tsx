import Publicodes, { formatValue } from 'publicodes'
import rules from './data/rules'
import exemples from './data/exemples.yaml'
import { HorizontalOl, VerticalOl } from './ExempleTableUI'

export default function ExempleTable() {
	const engine = new Publicodes(rules),
		objective = 'trajet voiture . coût trajet par personne'
	const distances = exemples.dimensions[0],
		voiture = exemples.dimensions[1]
	return (
		<div>
			<HorizontalOl $header>
				<li key={'distance'}>Distance</li>
				{voiture.valeurs.map((element2) => (
					<li key={element2.titre}>{element2.titre}</li>
				))}
			</HorizontalOl>
			<VerticalOl>
				{distances.valeurs.map((element) => (
					<li key={element.titre}>
						<HorizontalOl>
							<li>
								{element.titre}
								<small>{element['sous-titre']}</small>
							</li>

							{voiture.valeurs.map((element2) => (
								<li>
									{formatValue(
										engine
											.setSituation({
												...element.situation,
												...element2.situation,
											})
											.evaluate(objective).nodeValue,
										{ precision: 0 }
									)}
									&nbsp; €
								</li>
							))}
						</HorizontalOl>
					</li>
				))}
			</VerticalOl>
		</div>
	)
}
