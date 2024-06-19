import generateFuturecoSitemap from '@/app/(futureco)/sitemap'
import generateVoyageSitemap from '@/app/voyage/generateVoyageSitemap'

export default async function sitemap() {
	if (process.env.VOYAGE !== 'oui') {
		const futurecoSitemap = await generateFuturecoSitemap()
		return futurecoSitemap
	}
	const cartesSitemap = await generateVoyageSitemap()
	return cartesSitemap
}
