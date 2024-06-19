import { allArticles } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { dateCool } from './utils'

const title = `Le blog - Futureco`
const description =
	"Découvrez l'histoire, les nouveautés et le futur de futureco"

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
			<ul>
				{articles.map(({ url, date, titre }) => (
					<li key={url}>
						<div>
							<Link href={url}>{titre}</Link>
						</div>
						<small>{dateCool(date)}</small>
					</li>
				))}
			</ul>
		</main>
	)
}

export default Page
