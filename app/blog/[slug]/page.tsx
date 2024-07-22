import { allArticles } from '@/.contentlayer/generated'
import Article from '@/components/Article'
import { dateCool, getLastEdit } from '../utils'
import { getMDXComponent } from 'next-contentlayer2/hooks'
import Link from 'next/link'
import Image from 'next/image'
import LastEdit from '@/components/blog/LastEdit'
import Contribution from '../Contribution'

export const generateMetadata = async ({ params }) => {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)
	const lastEdit = await getLastEdit(params.slug)
	return {
		title: post.titre.raw,
		description: post.description,
		openGraph: {
			images: [post.image],
			type: 'article',
			publishedTime: post.date + 'T00:00:00.000Z',
			modifiedTime: lastEdit + 'T00:00:00.000Z',
		},
	}
}

export default async function Post({ params }: Props) {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)

	const Content = getMDXComponent(post.body.code)
	const lastEdit = await getLastEdit(params.slug)

	const sameEditDate =
		!lastEdit || post.date.slice(0, 10) === lastEdit.slice(0, 10)
	return (
		<Article>
			{lastEdit}
			<Link href="/blog">← Retour au blog</Link>
			<header>
				{post.image && (
					<Image
						src={post.image}
						width="600"
						height="400"
						alt="Illustration de l'article"
					/>
				)}
				<h1 dangerouslySetInnerHTML={{ __html: post.titre.html }} />
				<small>
					publié le <time dateTime={post.date}>{dateCool(post.date)}</time>
					{!sameEditDate && (
						<span>
							, mis à jour <time dateTime={lastEdit}>{dateCool(lastEdit)}</time>
						</span>
					)}
				</small>
			</header>
			<Content />
			<Contribution slug={params.slug} />
		</Article>
	)
}
