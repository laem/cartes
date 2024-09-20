import Image from 'next/image'
import correspondanceIcon from '@/public/correspondance.svg'
import useSetSearchParams from '@/components/useSetSearchParams'
import styled from 'styled-components'
import carIcon from '@/public/car.svg'
import startIcon from '@/public/start.svg'

import { getTimePart } from '@/components/transit/modes'
import { ModalCloseButton } from '@/app/UI'

export default function TransitOptions({ searchParams }) {
	const { correspondances, debut } = searchParams
	// marche-10min
	// vélo-45min
	const setSearchParams = useSetSearchParams()

	const debutTime = debut && getTimePart(debut)
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
				<Button>
					<Image
						src={startIcon}
						alt="Icône d'une flèche représentant le départ"
					/>
					<ModalCloseButton
						onClick={() => setSearchParams({ debut: undefined })}
					/>
					<div>
						<button
							onClick={() =>
								setSearchParams({
									debut:
										(debut
											? debut.startsWith('marche')
												? 'vélo'
												: debut.startsWith('vélo')
												? 'voiture'
												: 'marche'
											: 'marche') +
										'-' +
										(!debut ? '5min' : getTimePart(debut) + 'min'),
								})
							}
						>
							{debut == null ? (
								<Image
									src={'/mode-auto.svg'}
									alt="Icône de quelqu'un qui marche ou roule à vélo"
									width="10"
									height="10"
								/>
							) : debut.startsWith('marche') ? (
								<Image
									src={'/walking.svg'}
									alt="Icône de quelqu'un qui marche"
									width="10"
									height="10"
								/>
							) : debut.startsWith('voiture') ? (
								<Image src={carIcon} alt="Icône d'une voiture" />
							) : debut.startsWith('vélo') ? (
								<Image
									src={'/cycling.svg'}
									alt="Icône d'un vélo"
									width="10"
									height="10"
								/>
							) : (
								<span>quoi ?</span>
							)}
						</button>
						<button
							onClick={() =>
								setSearchParams({
									debut:
										(debut ? debut.split('-')[0] : 'marche') +
										'-' +
										(!debutTime
											? '5min'
											: debutTime == 5
											? '15min'
											: debutTime == 15
											? '30min'
											: '5min'),
								})
							}
						>
							{debutTime == null ? 'auto' : debutTime + ' min'}
						</button>
					</div>
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
						) : correspondances == 0 ? (
							'direct'
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
	position: relative;
`
