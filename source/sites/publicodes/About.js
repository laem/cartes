import { Markdown } from 'Components/utils/markdown'
import about from 'raw-loader!./about.md'
import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
	<section className="ui__ container" id="about">
		<p>
			<Markdown source={about} />
			Le code de ce site{' '}
			<a href="https://github.com/betagouv/ecolab-data"> est libre</a>. Plongez-vous
			dans nos modèles carbone en explorant la{' '}
			<Link to="/documentation">documentation</Link>.
		</p>
	</section>
)
