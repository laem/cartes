import { Markdown } from 'Components/utils/markdown'
import about from 'raw-loader!./about.md'
import React from 'react'
import { Link } from 'react-router-dom'
import Meta from '../../components/utils/Meta'
import FuturecoMonochrome from '../../images/FuturecoMonochrome'

export default () => (
	<section className="ui__ container" id="about">
		<Link to="/"></Link>
		<Meta
			title="À propos de futur.eco"
			description={`
La catastrophe climatique n'est plus une menace lointaine, c'est une actualité. En savoir plus. Testez si vous êtes écolo. Découvrez l'impact de vos consommations quotidiennes.

		`}
		/>
		<p>
			<Markdown source={about} />
			Le code de ce site{' '}
			<a href="https://github.com/laem/futureco"> est libre</a>. Plongez-vous
			dans nos modèles carbone en explorant la{' '}
			<Link to="/documentation">documentation</Link>.
		</p>
	</section>
)
