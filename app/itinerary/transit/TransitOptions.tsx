import Image from 'next/image'
import correspondanceIcon from '@/public/correspondance.svg'
import useSetSearchParams from '@/components/useSetSearchParams'
import styled from 'styled-components'
import carIcon from '@/public/car.svg'
import startIcon from '@/public/start.svg'

export default function TransitOptions({ searchParams }) {
	const { correspondances, debut } = searchParams
	const setSearchParams = useSetSearchParams()

	return (
		<section
			css={`
				img {
					width: 1.4rem;
					height: auto;
				}
				ol {
					list-style-type: none;
					display: flex;
					align-items: center;
				}
			`}
		>
			{false && (
				<p>
					🚶🚌 définir vos modes de transport. On va faire une frise [mode de
					départ / temps | transport (choix : bus, etc ; choix direct ; temps de
					correspondance minimum ; ) | à destination / temps / parking relais
					pour les voitures]
				</p>
			)}
			<ol>
				<Button
					onClick={() =>
						setSearchParams({
							debut: debut === 'marche' ? 'voiture' : 'marche',
						})
					}
				>
					<Image
						src={startIcon}
						alt="Icône d'une flèche représentant le départ"
					/>
					<button>
						{debut == null || debut === 'marche' ? (
							<Image
								src={'/walking.svg'}
								alt="Icône de quelqu'un qui marche"
								width="10"
								height="10"
							/>
						) : debut === 'voiture' ? (
							<Image src={carIcon} alt="Icône d'une voiture" />
						) : (
							<span>quoi ?</span>
						)}
					</button>
				</Button>
				<Button
					onClick={() =>
						setSearchParams({
							correspondances:
								correspondances == null
									? 0
									: +correspondances >= 2
									? undefined
									: +correspondances + 1,
						})
					}
				>
					<Image
						src={correspondanceIcon}
						alt="Icône de correspondance de transport en commun"
					/>
					<button>
						{correspondances == null ? (
							'∞ corresp.'
						) : correspondances === 0 ? (
							'direct uniquement'
						) : (
							<span>{correspondances} corresp.</span>
						)}
					</button>
				</Button>
			</ol>
		</section>
	)
}

export const Button = styled.div`
	cursor: pointer;
	display: flex;
	flex-direction: column;
	width: fit-content;
	align-items: center;
	justify-content: center;
`
