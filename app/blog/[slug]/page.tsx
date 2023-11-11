import Article from '@/components/Article'
import { Markdown } from '@/components/utils/markdown'
import { getPostData } from '../getPosts'
import { dateCool } from '../utils'

export async function generateMetadata({ params }: Props) {
	const postData = await getPostData(params.slug)

	return {
		title: postData.title,
	}
}

export default async function Post({ params }: Props) {
	const postData = await getPostData(params.slug)

	return (
		<Article>
			<header>
				<h1>{postData.title}</h1>
				<small>{dateCool(postData.date)}</small>
			</header>

			<Markdown>{postData.contentHtml}</Markdown>
		</Article>
	)
}
