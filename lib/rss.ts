import { blogArticles } from '@/app/blog/page'
import { writeFileSync } from 'fs'
import RSS from 'rss'

// Credits :
// https://notebook.lachlanjc.com/2022-08-18_set_up_rss_with_contentlayer_and_mdx
//
const domain = 'https://cartes.app'
export async function generateFeed() {
	const feed = new RSS({
		title: 'Le blog de Cartes',
		site_url: domain,
		feed_url: domain + '/feed.xml',
		image_url: domain + '/logo.svg',
		language: 'fr',
	})

	const capitalLetter = /^[A-Z]/
	await Promise.all(
		blogArticles.map(async (post) => {
			feed.item({
				title: post.titre.raw,
				url: domain + post.url,
				guid: post.url.replace('/blog/', ''),
				date: post.date,
				/*
        description: await remark()
          .use(strip)
          .process(
            post.body.raw
              .split('\n\n')
              .filter((text) => text.match(capitalLetter))?.[0],
          )
          .then((file) => String(file).trim()),
		  */
				description: post.description,
			})
		})
	)

	const body = feed.xml({ indent: true })
	writeFileSync('./.next/static/feed.xml', body)
	console.log('🗞️ RSS feed written in .next/static/feed.xml')
}

generateFeed()
