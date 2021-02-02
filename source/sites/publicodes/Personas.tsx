import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import { title } from '../../components/publicodesUtils'
import { CardGrid } from './ListeActionPlus'
import personas from './personas.yaml'
import { utils } from 'publicodes'
import { ScrollToTop } from '../../components/utils/Scroll'
console.log(personas)

export default () => {
	return (
		<div>
			<div className="ui__ container">
				<ScrollToTop />
				<h1>Personas</h1>
				<p>
					<em>Cliquez pour charger ce persona dans le simulateur.</em>
				</p>
				<CardGrid>
					{personas.map(({ nom, icônes }) => (
						<li key={nom}>
							<Link to={'/actions/plus/'}>
								<div className="ui__ card">
									<div>{emoji(icônes || '👥')}</div>
									<div>{nom}</div>
								</div>
							</Link>
						</li>
					))}
				</CardGrid>
			</div>
		</div>
	)
}
