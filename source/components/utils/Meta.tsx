import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router'

type PropType = {
	title: string
	description: string
	image?: string
	url?: string
}

export default function Meta({ title, description, image, url }: PropType) {
	const { pathname } = useLocation()
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="twitter:card" content="summary_large_image" />
			{image && <meta property="og:image" content={image} />}
			{url && <meta property="og:url" content={url} />}
		</Helmet>
	)
}
