import Emoji from 'Components/Emoji'
import useSetSearchParams from 'Components/useSetSearchParams'
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
		<div>
			<section
				css={`
					position: relative;
					margin-top: 1rem;
					h3 {
						margin-top: 0;
					}
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
				<h3>Votre circonscription</h3>
				<div
					css={`
						background: white;
						padding: 0.2rem 0.6rem;
						border-radius: 0.4rem;
						border: 1px solid var(--lighterColor);
						width: fit-content;
					`}
				>
					<div>Nom : {name}</div>
					<div>Code : {idCirco}</div>
					<div>Département : {dep}</div>
				</div>
			</section>
			<Candidates data={candidates} />
		</div>
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
			Cliquez sur la carte pour trouver votre circonscription et vos candidats
			aux élections législatives.
		</p>
	</section>
)
