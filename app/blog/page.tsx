import { allArticles } from '@/.contentlayer/generated'
import { compareDesc } from 'date-fns'
import Link from 'next/link'
import { List } from './UI'
import { dateCool } from './utils'
import Logo from '@/public/logo.svg'
import Image from 'next/image'
import css from '@/components/css/convertToJs'

export const blogArticles = allArticles.filter(
	(article) =>
		!article.tags?.includes('page') && !article.tags?.includes('brouillon')
)

const title = `Le blog - Cartes`
const description =
	"Découvrez l'histoire, les nouveautés et le futur de Cartes.app"

export const metadata: metadata = {
	title,
	description,
}

const Page = () => {
	const articles = blogArticles.sort((a, b) =>
		compareDesc(new Date(a.date), new Date(b.date))
	)
	return (
		<main>
			<nav
				style={css`
					margin-top: 1rem;
				`}
			>
				<Link href="/">
					<Image
						src={Logo}
						alt="Logo de Cartes.app"
						width="100"
						height="100"
						style={css`
							width: 2rem;
							height: auto;
							margin-right: 0.6rem;
							vertical-align: middle;
						`}
					/>
					Revenir sur la carte
				</Link>
			</nav>
			<h1>Le blog de Cartes.app</h1>
			<p>{description}</p>
			<p>
				Pour l'instant, nous sommes dans une phase de construction : l'objectif
				est de sortir une version 1 en 2024, et ces articles en expliquent
				l'avancement. L'application reste largement utilisable, mais
				attendez-vous à quelques bugs.
			</p>
			<List>
				{articles.map(({ url, date, titre }) => (
					<li key={url}>
						<div>
							<Link
								href={url}
								dangerouslySetInnerHTML={{ __html: titre.html }}
							/>
						</div>
						<small>publié le {dateCool(date)}</small>
					</li>
				))}
			</List>
		</main>
	)
}

export default Page
