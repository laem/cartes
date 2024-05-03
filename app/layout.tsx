import { Analytics } from '@vercel/analytics/react'
import StyledComponentsRegistry from '../lib/registry'
import './globals.css'
import { ThemeColorsProvider } from '@/components/utils/colors'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="fr">
			<head>
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title="Voyage"
					href="https://futur.eco/voyage-search.xml"
				/>
			</head>
			<body>
				<StyledComponentsRegistry>
					<ThemeColorsProvider>{children}</ThemeColorsProvider>
				</StyledComponentsRegistry>
				<Analytics />
			</body>
		</html>
	)
}
