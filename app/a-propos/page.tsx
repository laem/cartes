import Article from 'Components/Article'
import Content from './about.mdx'

export const metadata = {
	title: 'À propos - Futur.eco',
	description:
		"Pourquoi est né futur.eco ? Quel est l'objectif ? Où en sommes-nous ?",
}
const Page = () => (
	<Article>
		<Content />
	</Article>
)

export default Page
