import { Markdown } from 'Components/utils/markdown'
import about from 'raw-loader!./diffuser.md'
import React from 'react'
import { Link } from 'react-router-dom'
import Meta from '../../components/utils/Meta'

export default () => (
	<section className="ui__ container" id="about">
		<Meta
			title="À propos de Nos Gestes Climat"
			description={`
Ce simulateur vous permet d'évaluer votre empreinte carbone individuelle annuelle totale et par grandes catégories (alimentation, transport, logement, divers, services publics, numérique), de la situer par rapport aux objectifs climatiques et surtout de passer à l’action à votre niveau avec des gestes personnalisés en fonction de vos réponses.

		`}
		/>
		<p>
			<Markdown source={about} />
		</p>
	</section>
)
