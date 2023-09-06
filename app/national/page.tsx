import { Metadata } from 'next'
import InteractiveGrid from './InteractiveGrid'
import { Main } from './UI'

const title = "Le tableau de bord d'une République verte",
	description =
		"Vous êtes le pilote à bord du paquebot France. Votre objectif : respecter l'Accord de Paris, un engagement international pour garder le réchauffement climatique sous les 1,5 à 2°."
export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		images: [
			`https://ogenerateur.osc-fr1.scalingo.io/capture/${encodeURIComponent(
				'https://' + process.env.VERCEL_URL + '/national'
			)}/shareImage?timeout=3000&width=800&height=530`,
		],
	},
}

export default function Home() {
	return (
		<Main>
			<header>
				<h1>{title}</h1>
				<p>{description}</p>
			</header>
			<InteractiveGrid />
		</Main>
	)
}
