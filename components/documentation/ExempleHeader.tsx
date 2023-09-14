'use client'

import { useSelector } from 'react-redux'
import FriendlyObjectViewer from '../FriendlyObjectViewer'
import { Circle } from './DocumentationStyle'

export default () => {
	const exemple = useSelector((state) => state.exemple)

	if (!exemple) return null

	return (
		<div
			css={`
				display: flex;
				flex-direction: column;
				align-items: end;
			`}
		>
			<div>
				<Circle $clicked />
				{exemple.titre}
			</div>
			<div
				css={`
					> div {
						margin: 0.8rem 4rem 1.6rem;
					}
				`}
			>
				<FriendlyObjectViewer data={exemple.situation} />
			</div>
		</div>
	)
}
