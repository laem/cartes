import './globals.css'
import StyledComponentsRegistry from '../lib/registry'
import Nav, { NavFooter } from 'Components/Nav'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Providers from '@/providers/Providers'

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
		<html lang="fr" >
			<Script
				defer
				strategy="lazyOnload"
				data-domain="futur.eco"
				src="https://plausible.io/js/script.js"
			/>
			<body>
				<Providers>
					<StyledComponentsRegistry>
						<Nav />
						{children}
						<NavFooter />
					</StyledComponentsRegistry>
				</Providers>
			</body>
		</html>
	)
}
