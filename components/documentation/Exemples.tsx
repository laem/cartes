import { useDispatch, useSelector } from 'react-redux'
import FriendlyObjectViewer from '../FriendlyObjectViewer'
import {
	Circle,
	ExemplesList,
	ExempleTitle,
	ExplainedHeader,
} from './DocumentationStyle'
import ExempleItem from './ExempleItem'

export default function Exemples({ exemples }) {
	if (!exemples) return null

	return (
		<section>
			<ExplainedHeader>
				<h2>Exemples de calcul</h2>
				<small>Cliquez pour en tester un</small>
			</ExplainedHeader>
			<ExemplesList>
				{exemples.map((exemple) => (
					<ExempleItem exemple={exemple} />
				))}
			</ExemplesList>
		</section>
	)
}
