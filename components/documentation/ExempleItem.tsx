import Link from 'next//link'
import { omit } from '../utils/utils'
import { Circle, ExempleTitle } from './DocumentationStyle'

export default function ExempleItem({ exemple, searchParams }) {
	const stateExemple = searchParams.docExemple
	const clicked = stateExemple === exemple.titre

	return (
		<li key={exemple.titre}>
			<Link
				href={{
					query: clicked
						? omit(['docExemple'], searchParams)
						: { ...searchParams, docExemple: exemple.titre },
				}}
				scroll={false}
			>
				<Circle $clicked={clicked} />
				<ExempleTitle $clicked={clicked}>{exemple.titre}</ExempleTitle>
			</Link>
		</li>
	)
}
