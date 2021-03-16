import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router'

type PropType = {
	title: string
	description: string
	ogDescription?: string
	ogTitle?: string
	ogImage?: string
	url: string
}

export default function Meta({
	title,
	description,
	ogDescription,
	ogTitle,
	ogImage,
	url,
}: PropType) {
	const { pathname } = useLocation()
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={ogTitle ?? title} />
			<meta property="og:description" content={ogDescription ?? description} />
			{ogImage && <meta property="og:image" content={ogImage} />}
			<meta property="twitter:card" content="summary_large_image" />
		</Helmet>
	)
}
