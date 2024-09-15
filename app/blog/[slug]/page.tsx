import { allArticles } from '@/.contentlayer/generated'
import Article from '@/components/Article'
import BlueskyComments from '@/components/BlueskyComments'
import css from '@/components/css/convertToJs'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import Image from 'next/image'
import Link from 'next/link'
import Contribution from '../Contribution'
import OtherArticles from '../OtherArticles'
import { mdxComponents } from '../mdxComponents'
import { dateCool, getLastEdit } from '../utils'

export const generateMetadata = async ({ params }) => {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)
	const lastEdit = await getLastEdit(params.slug)
	return {
		title: post.titre.raw,
		description: post.description,
		openGraph: {
			images: post.image && [post.image],
			type: 'article',
			publishedTime: post.date + 'T00:00:00.000Z',
			modifiedTime: lastEdit + 'T00:00:00.000Z',
			url: '/blog/' + params.slug,
		},
	}
}

export default async function Post({ params }: Props) {
	const post = allArticles.find(
		(post) => post._raw.flattenedPath === params.slug
	)

	const MDXContent = useMDXComponent(post.body.code)
	const lastEdit = await getLastEdit(params.slug)

	const sameEditDate =
		!lastEdit || post.date.slice(0, 10) === lastEdit.slice(0, 10)
	return (
		<div>
			<Article>
				{!post.tags?.includes('page') && (
					<Link
						href="/blog"
						style={css`
							margin-top: 0.6rem;
							display: inline-block;
						`}
					>
						← Retour au blog
					</Link>
				)}
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
					<p>{post?.description}</p>
					<small>
						publié le <time dateTime={post.date}>{dateCool(post.date)}</time>
						{!sameEditDate && (
							<span>
								, mis à jour{' '}
								<time dateTime={lastEdit}>{dateCool(lastEdit)}</time>
							</span>
						)}
					</small>
					<hr />
				</header>
				<MDXContent components={mdxComponents} />
				<Contribution slug={params.slug} />
				<OtherArticles excludeUrl={post.url} />
			</Article>
			{post?.bluesky && <BlueskyComments uri={post.bluesky} />}
		</div>
	)
}
