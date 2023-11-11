import Article from '@/components/Article'
import { Markdown } from '@/components/utils/markdown'
import { getPostData } from '../getPosts'

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
			<h1>{postData.title}</h1>

			<div>{postData.date}</div>

			<Markdown>{postData.contentHtml}</Markdown>
		</Article>
	)
}
