import data from '../../data.yaml'
import Markdown from 'markdown-to-jsx'
import { utils } from 'publicodes'
const { decodeRuleName } = utils

export default ({ params }) => {
	const { nom: raw } = params

	const nom = decodeRuleName(raw)

	const rule = data.find((r) => r.titre === decodeURIComponent(nom))

	if (!rule) return <p>Cette action n'existe pas.</p>
	return (
		<main>
			<h1>{rule.titre}</h1>
			<Markdown>{rule.notes}</Markdown>
		</main>
	)
}
