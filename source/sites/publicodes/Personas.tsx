import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
import { title } from '../../components/publicodesUtils'
import { CardGrid } from './ListeActionPlus'
import personas from './personas.yaml'
import { utils } from 'publicodes'
import { ScrollToTop } from '../../components/utils/Scroll'
import { useDispatch, useSelector } from 'react-redux'
import { setDifferentSituation } from '../../actions/actions'
import CarbonImpact from './CarbonImpact'
import { useEngine } from '../../components/utils/EngineContext'

export default () => {
	const dispatch = useDispatch(),
		objectif = 'bilan',
		engine = useEngine(),
		evaluation = engine.evaluate(objectif),
		configSet = useSelector((state) => state.simulation?.config)

	return (
		<div>
			<div className="ui__ container">
				<ScrollToTop />
				<h1>Personas</h1>
				<p>
					<em>Cliquez pour charger ce persona dans le simulateur.</em>
				</p>
				{configSet && <CarbonImpact evaluation={evaluation} />}
				<CardGrid>
					{personas.map(({ nom, icônes, data }) => (
						<li key={nom}>
							<Link
								to={'/personas'}
								onClick={() =>
									dispatch(
										setDifferentSituation({
											config: { objectifs: [objectif] },
											url: '/simulateur/bilan',
											situation: data,
										})
									)
								}
							>
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
