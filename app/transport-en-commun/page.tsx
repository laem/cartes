import css from '@/components/css/convertToJs'
import TechDependenciesGallery from '@/components/TechDependenciesGallery'
import { PresentationWrapper } from '../presentation/UI'
import Link from 'next/link'

const title = 'Transports en commun'
const description = `
Découvrez les plans de chaque réseau de transport en commun en France,
et calculez vos itinéraires en bus, en tram, en métro, en train (TER,
Intercités, TGV, Ouigo, train de nuit) et la combinaison multimodale
des transports publics avec le vélo et la marche.
`
export const metadata: Metadata = {
	title,
	description,
}
export default function () {
	return (
		<PresentationWrapper>
			<header>
				<h1>{title}</h1>
				<p>{description}</p>
			</header>
			<section
				style={css`
					margin: 2rem 0;
				`}
			></section>
		</PresentationWrapper>
	)
}
