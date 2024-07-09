import { allArticles } from '@/.contentlayer/generated'
import Article from '@/components/Article'
import { dateCool } from '../utils'
import { getMDXComponent } from 'next-contentlayer2/hooks'
import Link from 'next/link'
import Image from 'next/image'

export const generateMetadata = ({ params }) => {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)
	return {
		title: post.titre.raw,
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
					<time dateTime={post.date}>{dateCool(post.date)}</time>
				</small>
			</header>

			<Content />
		</Article>
	)
}
