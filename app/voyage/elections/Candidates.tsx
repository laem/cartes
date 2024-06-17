import { findContrastedTextColor } from '@/components/utils/colors'

export default function Candidates({ data }) {
	/*
	 {
        "NumTour":"1",
        "CodDpt":"49",
        "LibDpt":"Maine-et-Loire",
        "CodCirElec":"4907",
        "LibCirElec":"7ème circonscription",
        "PrenomPsn":"Philippe",
        "NomPsn":"BOLO",
        "LibNuaCand":"Modem",
        "Couleur":"#ff8400",
        "Sortant":"sortant",
        "Details":null
    }
	*/
	if (!data) return <p>Téléchargement des candidats.</p>
	return (
		<section>
			<h2>Candidats</h2>
			<ul>
				{data.map(({ NomPsn, PrenomPsn, LibNuaCand, Couleur }) => {
					const safeColor = Couleur || '#333333'
					console.log('couleur', Couleur)

					return (
						<li
							key={PrenomPsn + NomPsn}
							css={`
								display: flex;
								align-items: center;
								justify-content: start;
								margin: 0.6rem 0;
							`}
						>
							<div
								css={`
									background: ${safeColor};
									padding: 0.2rem 0.4rem;
									border-radius: 0.4rem;
									margin-right: 0.6rem;
									color: ${findContrastedTextColor(safeColor, true)};
									font-size: 80%;
									line-height: 1.2rem;
								`}
							>
								{LibNuaCand}
							</div>
							<div css={``}>
								{PrenomPsn} {NomPsn}
							</div>
						</li>
					)
				})}
			</ul>
			<small css="text-align: right; display: block; margin-top: 1rem">
				Source : France 3 Régions
			</small>
		</section>
	)
}
