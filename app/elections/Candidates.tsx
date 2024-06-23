import { findContrastedTextColor } from '@/components/utils/colors'
import Image from 'next/image'

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
	if (data === 'Error')
		return <p>Candidats non trouvés. Ils seront ajoutés prochainement.</p>
	return (
		<section
			css={`
				h3 {
					margin-bottom: 0;
				}
				header {
					margin-bottom: 1rem;
				}
				ul {
					list-style-type: none;
				}
			`}
		>
			<header>
				<h3>Vos candidates et candidats</h3>
				<small>1er tour des législatives du 30 juin 2024</small>
			</header>
			<ul>
				{data.map(({ NomPsn, PrenomPsn, LibNuaCand, Couleur }) => {
					const safeColor = Couleur || '#333333'
					console.log('couleur', Couleur)

					return (
						<li
							key={PrenomPsn + NomPsn}
							css={`
								margin: 0.8rem 0 0.8rem 0;
								display: flex;
								align-items: center;
							`}
						>
							<div
								css={`
									background: ${safeColor};
									width: 2.2rem;
									height: 2.2rem;
									border-radius: 4rem;
									margin-right: 1rem;
								`}
							></div>
							<div>
								<div
									css={`
										text-decoration: underline;
										text-decoration-color: #bbb;
										margin-right: 0.6rem;
										line-height: 1.2rem;
										min-width: 6rem;
										margin-bottom: 0.2rem;
										width: 16rem;
									`}
									title={
										LibNuaCand
											? 'Le parti sous lequel ce candidat ou cette candidate se présente'
											: 'Parti non renseigné dans les données dont nous disposons'
									}
								>
									{LibNuaCand || ' ? '}
								</div>
								<div css={``}>
									{PrenomPsn} {NomPsn}
								</div>
							</div>
						</li>
					)
				})}
			</ul>
			<a
				href="https://github.com/f3reg/lg2024/"
				about="_blank"
				css={`
					text-decoration: none;
					color: gray;
					small {
						text-align: right;
						display: block;
						margin-top: 1rem;
						img {
							width: 1.2rem;
							height: auto;
							vertical-align: text-top;
							margin-left: 0.3rem;
						}
					}
				`}
			>
				<small>
					Source : Ministère de l'Intérieur via
					<Image
						src="https://france3-regions.francetvinfo.fr/assets/img/logos/france-3-black.svg"
						width="10"
						height="10"
						alt="Logo de France 3 Régions"
					/>{' '}
					France 3 Régions
				</small>
			</a>
		</section>
	)
}
