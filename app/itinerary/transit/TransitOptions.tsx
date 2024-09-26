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
				<Button
					css={`
						flex-direction: row !important;
						width: 8rem;
					`}
				>
					{false && (
						<>
							<Image
								src={startIcon}
								alt="Icône d'une flèche représentant le départ"
							/>
							<ModalCloseButton
								css={`
									img {
										width: 0.8rem !important;
									}
								`}
								onClick={() => setSearchParams({ debut: undefined })}
							/>
						</>
					)}
					<div
						css={`
							position: absolute;
							top: calc(50% - 1px);
							width: 8rem;
							background: linear-gradient(
								90deg,
								var(--lighterColor) 0%,
								transparent 20%,
								transparent 80%,
								var(--color) 100%
							);
							height: 2px;
						`}
					/>

					<button
						css={`
							img {
								height: 2rem !important;
								width: auto !important;
								filter: invert(46%) sepia(13%) saturate(5002%)
									hue-rotate(181deg) brightness(92%) contrast(88%);
							}
						`}
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
						css={`
							border: 2px solid var(--color);
							color: var(--color);
							border-radius: 3rem;
							width: 2rem;
							height: 2rem;
							text-align: center;
							font-size: 80%;
							position: relative;
							> div {
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								line-height: 1.1rem;
								div,
								small {
									line-height: 0.65rem;
								}
							}
						`}
					>
						<span
							css={`
								height: 5px;
								width: 5px;
								position: absolute;
								top: -5px;
								left: 43%;
								background: var(--color);
							`}
						></span>
						<div>
							{debutTime == null ? (
								'auto'
							) : (
								<div>
									<div>{debutTime}</div>
									<small>min</small>
								</div>
							)}
						</div>
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
						css={`
							width: 1.6rem !important;
						`}
					/>
					<button>
						{correspondances == 0 ? (
							'direct'
						) : (
							<div>
								<div>
									{correspondances == null ? (
										<div css="font-size: 140%; max-height: .8rem; line-height: .6rem">
											∞
										</div>
									) : (
										<span css="font-size: 100%; line-height: .8rem">
											{correspondances}
										</span>
									)}
								</div>
								{false && <small>corresp.</small>}
							</div>
						)}
					</button>
				</Button>
			</ol>
		</section>
	)
}

export const Button = styled.div`
	display: flex;
	flex-direction: column;
	width: fit-content;
	align-items: center;
	justify-content: center;
	position: relative;
	margin: 0 0.4rem;
	button {
		padding: 0;
		margin: 0 0.1rem;
	}
	color: var(--color);
`
