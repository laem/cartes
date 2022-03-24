import { Markdown } from 'Components/utils/markdown'
import about from 'raw-loader!./about.md'
import React from 'react'
import { Link } from 'react-router-dom'
import Meta from '../../components/utils/Meta'
import FuturecoMonochrome from '../../images/FuturecoMonochrome'

export default () => (
	<section className="ui__ container" id="about">
		<Link to="/">
			<img
				src="/logo.svg"
				css="width: 4rem !important; margin: 0 auto;display: block"
			/>
		</Link>
		<Meta
			title="À propos de futur.eco"
			description={`
La catastrophe climatique n'est plus une menace lointaine, c'est une actualité. En savoir plus. Testez si vous êtes écolo. Découvrez l'impact de vos consommations quotidiennes.

		`}
		/>
		<p className="ui__ container">
			<Markdown>{about}</Markdown>
			Le code de ce site{' '}
			<a href="https://github.com/laem/futureco"> est libre</a>. Plongez-vous
			dans nos modèles carbone en explorant la{' '}
			<Link to="/documentation">documentation</Link>. Ce site respecte votre{' '}
			<Link to="/documentation">vie privée</Link>.
		</p>
	</section>
)
