import { allArticles } from 'contentlayer/generated'
import Article from '@/components/Article'
import { dateCool } from '../utils'
import { getMDXComponent } from 'next-contentlayer/hooks'

export const generateMetadata = ({ params }) => {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)
	return { title: post.titre, description: post.description }
}

export default async function Post({ params }: Props) {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)

	const Content = getMDXComponent(post.body.code)

	return (
		<Article>
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
