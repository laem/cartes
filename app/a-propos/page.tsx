import Article from '@/app/components/Article'
import { Metadata } from 'next'
import Content from './about.mdx'

export const metadata: Metadata = {
	title: 'Explications - villes.plus',
	description: `Nos villes se transforment. Deux critères s'imposent comme fondamentaux : la place donnée aux piétons, et celle donnée aux vélos. Voici le premier classement libre des grandes villes françaises les plus piétonnes et cyclables.`,
}
export default () => (
	<Article>
		<Content />
	</Article>
)
