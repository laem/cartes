import futurecoSitemap from '@/app/(futureco)/sitemap'
import voyageSitemap from '@/app/voyage/sitemap'
export default async function sitemap() {
	if (process.env.VOYAGE === 'non') {
		const sitemap = await futurecoSitemap()
		return sitemap
	}
	const sitemap = await voyageSitemap()
	return sitemap
}
