'use client'
import { useDispatch, useSelector } from 'react-redux'
import FriendlyObjectViewer from '../FriendlyObjectViewer'
import { Circle, ExempleTitle } from './DocumentationStyle'
export default function ExempleItem({ exemple }) {
	const stateExemple = useSelector((state) => state.exemple) || {}
	const clicked = stateExemple.titre === exemple.titre
	const dispatch = useDispatch()

	return (
		<li key={exemple.titre}>
			<button
				onClick={() =>
					dispatch({
						type: 'SET_EXEMPLE',
						exemple: stateExemple.titre === exemple.titre ? null : exemple,
					})
				}
			>
				<Circle $clicked={clicked} />
				<ExempleTitle $clicked={clicked}>{exemple.titre}</ExempleTitle>
			</button>
			{clicked && (
				<div
					css={`
						> div {
							max-width: 20rem;
							margin: 0.8rem 4rem 1.6rem;
						}
					`}
				>
					<FriendlyObjectViewer data={exemple.situation} />
				</div>
			)}
		</li>
	)
}
