'use client'
import pays from '@/app/carburants/prix-a-la-pompe/pays.yaml'

const CountriesGraph = ({}) => {
	const max = Math.max(...Object.values(pays))

	return (
		<div>
			<ul
				css={`
					padding-left: 0;
					margin-top: 1rem;
					width: 95vw;
					max-width: 30rem;
					li {
						display: flex;
						line-height: 1.2rem;
						align-items: center;
						padding: 0.2rem 0;
					}
				`}
			>
				{Object.entries(pays)
					.sort(([, a], [, b]) => -a + b)
					.map(([nom, valeur]) => (
						<li key={nom}>
							<span
								css={`
									width: 40%;
									text-align: right;
									padding-right: 0.6rem;
								`}
							>
								{nom}
							</span>
							<span
								css={`
									width: ${(valeur / max) * 60}%;
									height: 1.2rem;
									background: #cf6a87;
									border-radius: 0.2rem;
									color: black;
									display: inline;
									line-height: 1.4rem;
									vertical-align: middle;
									font-weight: bold;
									padding-left: 0.2rem;
									font-size: 90%;
								`}
							>
								{valeur.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}%
							</span>
						</li>
					))}
			</ul>
			<p>
				Données{' '}
				<a href="https://www.insee.fr/fr/statistiques/2119697">INSEE 2022</a>
			</p>
		</div>
	)
}

export default CountriesGraph
