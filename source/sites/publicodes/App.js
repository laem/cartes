import Route404 from 'Components/Route404'
import RulePage from 'Components/RulePage'
import React, { Component, Suspense } from 'react'
import { Link, Route, Redirect, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import RulesList from '../mon-entreprise.fr/pages/Documentation/RulesList'
import About from './About'
import Privacy from './Privacy'
import Contribution from './Contribution'
import Landing from './Landing'
import Simulateur from './Simulateur'
import Fin from './Fin'
import VersionBeta from './VersionBeta'
import Actions from './Actions'
import sitePaths from './sitePaths'
import Logo from './Logo'
import { StoreProvider } from './StoreContext'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'

let Studio = React.lazy(() => import('./Studio'))

class App extends Component {
	render() {
		const urlParams = new URLSearchParams(window.location.search)
		/* This enables loading the rules of a branch,
		 * to showcase the app as it would be once this branch of -data  has been merged*/
		const branch = urlParams.get('branch')
		const pullRequestNumber = urlParams.get('PR')
		return (
			<Provider
				basename="publicodes"
				rulesURL={`https://${
					branch
						? `${branch}--`
						: pullRequestNumber
						? `deploy-preview-${pullRequestNumber}--`
						: ''
				}ecolab-data.netlify.app/co2.json`}
				dataBranch={branch || pullRequestNumber}
				sitePaths={sitePaths()}
				reduxMiddlewares={[]}
				onStoreCreated={(store) => {
					//persistEverything({ except: ['rules', 'simulation'] })(store)
					persistSimulation(store)
				}}
				initialStore={{
					//...retrievePersistedState(),
					previousSimulation: retrievePersistedSimulation(),
				}}
			>
				<StoreProvider>
					<VersionBeta />
					<div className="ui__ container">
						<nav css="display: flex; justify-content: center; margin-top: .6rem">
							<Link
								to="/"
								css={`
									display: flex;
									align-items: center;
									text-decoration: none;
									font-size: 170%;
									margin-bottom: 0.4rem;
								`}
							>
								<Logo />
							</Link>
						</nav>
						<Switch>
							<Route exact path="/" component={Landing} />
							<Route path="/documentation/:name+" component={RulePage} />
							<Route path="/documentation" component={RulesList} />
							<Route path="/simulateur/:name+" component={Simulateur} />
							{/* Lien de compatibilité, à retirer par exemple mi-juillet 2020*/}
							<Route path="/fin/:score" component={Fin} />
							<Route path="/fin" component={Fin} />
							<Route path="/actions" component={Actions} />
							<Route path="/contribuer/:input?" component={Contribution} />
							<Route path="/à-propos" component={About} />
							<Route path="/vie-privée" component={Privacy} />
							<Route
								path="/studio"
								component={() => (
									<Suspense fallback={<div>Chargement de l'éditeur ...</div>}>
										<Studio />
									</Suspense>
								)}
							/>
							<Route component={Route404} />
						</Switch>
					</div>
				</StoreProvider>
			</Provider>
		)
	}
}

export default App
