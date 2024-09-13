import Image from 'next/image'
import correspondanceIcon from '@/public/correspondance.svg'
import useSetSearchParams from '@/components/useSetSearchParams'
import styled from 'styled-components'

export default function TransitOptions({ searchParams }) {
	const { correspondances } = searchParams
	const setSearchParams = useSetSearchParams()

	return (
		<section
			css={`
				img {
					width: 1.4rem;
					height: auto;
				}
			`}
		>
			{' '}
			{false && (
				<p>
					🚶🚌 définir vos modes de transport. On va faire une frise [mode de
					départ / temps | transport (choix : bus, etc ; choix direct ; temps de
					correspondance minimum ; ) | à destination / temps / parking relais
					pour les voitures]
				</p>
			)}
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
