import type { MetadataRoute } from 'next'
import { getAllPostIds } from '../(futureco)/blog/getPosts'

const basePaths = ['', '/blog', '/elections-legislatives-2024']

export default function sitemap(): MetadataRoute.Sitemap {
	const blogEntries = getAllPostIds().map(({ params: { id } }) => '/blog/' + id)
	const entries = [...basePaths, ...blogEntries].map((path) => ({
		url: 'https://cartes.app' + path,
		lastModified: new Date(),
		changeFrequency: 'weekly',
	}))
	console.log('Sitemap', entries)
	return entries
}
