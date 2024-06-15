import useSetSearchParams from '@/components/useSetSearchParams'
import { ModalCloseButton } from './UI'
import Emoji from '@/components/Emoji'

export default function ({ searchParams }) {
	const setSearchParams = useSetSearchParams()
	if (!searchParams.id_circo)
		return (
			<section
				css={`
					position: relative;
					padding-top: 0.2rem;
					margin-top: 1rem;
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					img {
						margin-right: 1rem;
						width: 3rem;
						height: auto;
					}
				`}
			>
				<Emoji e="🗳️" />

				<p>
					Cliquez sur la carte pour trouver votre circonscription de vote aux
					les élections législatives.
				</p>
			</section>
		)

	const { id_circo, name, dep } = searchParams
	return (
		<section
			css={`
				position: relative;
				padding-top: 0.2rem;
				margin-top: 1rem;
			`}
		>
			<ModalCloseButton
				title="Fermer l'encart circo"
				onClick={() => {
					console.log('will yo')
					setSearchParams({
						id_circo: undefined,
						dep: undefined,
						name: undefined,
					})
				}}
			/>
			<h3>Votre circonscription :</h3>
			<div>
				<div>Code : {id_circo}</div>
				<div>Département : {dep}</div>
				<div>Nom : {name}</div>
			</div>
		</section>
	)
}
