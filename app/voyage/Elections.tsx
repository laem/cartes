import Emoji from '@/components/Emoji'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useEffect } from 'react'
import { ModalCloseButton } from './UI'
import Candidates from './elections/Candidates'
import useCircoData from './elections/useCircoData'

export default function ({ searchParams, setSnap }) {
	const setSearchParams = useSetSearchParams()
	const { id_circo: idCirco, name, dep } = searchParams
	useEffect(() => {
		if (!idCirco) return
		setSnap(1)
	}, [idCirco])

	const candidates = useCircoData(idCirco)

	if (!idCirco) return <NoCircoYet />

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
				<div>Code : {idCirco}</div>
				<div>Département : {dep}</div>
				<div>Nom : {name}</div>
			</div>
			<Candidates data={candidates} />
		</section>
	)
}

const NoCircoYet = () => (
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
			Cliquez sur la carte pour trouver votre circonscription de vote aux les
			élections législatives.
		</p>
	</section>
)
