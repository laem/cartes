import Providers from '@/providers/Providers'
import Nav, { NavFooter } from 'Components/Nav'

export const metadata = {
	title: 'Futureco',
	description: "L'empreinte climat de notre quotidien",
	metadataBase: new URL('https://futur.eco'),
	openGraph: {
		images: ['https://futur.eco/logo.svg'],
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Providers>
			<Nav />
			{children}
			<NavFooter />
		</Providers>
	)
}
