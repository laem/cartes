import Providers from '@/providers/Providers'
import Nav, { NavFooter } from 'Components/Nav'
import StyledComponentsRegistry from '../lib/registry'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

/*
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
})
className={inter.className}>
*/

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
		<html lang="fr">
			<body>
				<StyledComponentsRegistry>
					<Providers>
						<Nav />
						{children}
						<NavFooter />
					</Providers>
				</StyledComponentsRegistry>
				<Analytics />
			</body>
		</html>
	)
}
