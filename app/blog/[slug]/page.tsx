import { allArticles } from 'contentlayer/generated'
import Article from '@/components/Article'
import { dateCool } from '../utils'
import { getMDXComponent } from 'next-contentlayer/hooks'
import Link from 'next/link'

export const generateMetadata = ({ params }) => {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)
	return {
		title: post.titre,
		description: post.description,

		openGraph: {
			images: [post.image],
			type: 'article',
			publishedTime: post.date + 'T00:00:00.000Z',
		},
	}
}

export default async function Post({ params }: Props) {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)

	const Content = getMDXComponent(post.body.code)

	return (
		<Article>
			<Link href="/blog">← Retour au blog</Link>
			<header>
				<h1>{post.titre}</h1>
				<small>
					<time dateTime={post.date}>{dateCool(post.date)}</time>
				</small>
			</header>

			<Content />
		</Article>
	)
}
