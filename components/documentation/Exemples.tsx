import { ExemplesList, ExplainedHeader } from './DocumentationStyle'
import ExempleItem from './ExempleItem'

export default function Exemples({ exemples, searchParams }) {
	if (!exemples) return null

	return (
		<section>
			<ExplainedHeader>
				<h2>Exemples de calcul</h2>
				<small>Cliquez pour en tester un</small>
			</ExplainedHeader>
			<ExemplesList>
				{exemples.map((exemple) => (
					<ExempleItem exemple={exemple} searchParams={searchParams} />
				))}
			</ExemplesList>
		</section>
	)
}
