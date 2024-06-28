import { allArticles } from '@/.contentlayer/generated'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { dateCool } from './utils'
import { List } from './UI'

const title = `Le blog - Cartes`
const description =
	"Découvrez l'histoire, les nouveautés et le futur de Cartes.app"

export const metadata: metadata = {
	title,
	description,
}

const Page = () => {
	const articles = allArticles.sort((a, b) =>
		compareDesc(new Date(a.date), new Date(b.date))
	)
	return (
		<main>
			<h1>Le blog</h1>
			<List>
				{articles.map(({ url, date, titre }) => (
					<li key={url}>
						<div>
							<Link href={url}>{titre}</Link>
						</div>
						<small>{dateCool(date)}</small>
					</li>
				))}
			</List>
		</main>
	)
}

export default Page
