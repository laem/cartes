import { ThemeColorsProvider } from 'Components/utils/colors'
import Providers from '@/providers/Providers'
import { Analytics } from '@vercel/analytics/react'
import Nav, { NavFooter } from 'Components/Nav'
import StyledComponentsRegistry from '../../lib/registry'
import '../globals.css'

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

export default function FuturecoLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="fr">
			<body>
				<StyledComponentsRegistry>
					<ThemeColorsProvider>
						<Providers>
							<Nav />
							{children}
							<NavFooter />
						</Providers>
					</ThemeColorsProvider>
				</StyledComponentsRegistry>
				<Analytics />
			</body>
		</html>
	)
}
