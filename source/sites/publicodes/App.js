import Route404 from 'Components/Route404'
import 'Components/ui/index.css'
import React, { Component, Suspense } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import Provider from '../../Provider'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import About from './About'
import Actions from './Actions'
import Contribution from './Contribution'
import Fin from './Fin'
import Landing from './Landing'
import Logo from './Logo'
import Documentation from './pages/Documentation'
import Privacy from './Privacy'
import Simulateur from './Simulateur'
import { StoreProvider } from './StoreContext'
import VersionBeta from './VersionBeta'

let Studio = React.lazy(() => import('./Studio'))

let tracker = devTracker
if (process.env.NODE_ENV === 'production') {
	tracker = new Tracker()
}

class App extends Component {
	render() {
		const urlParams = new URLSearchParams(window.location.search)
		/* This enables loading the rules of a branch,
		 * to showcase the app as it would be once this branch of -data  has been merged*/
		const branch = urlParams.get('branch')
		const pullRequestNumber = urlParams.get('PR')
		return (
			<Provider
				rulesURL={`https://${
					branch
						? `${branch}--`
						: pullRequestNumber
						? `deploy-preview-${pullRequestNumber}--`
						: ''
				}ecolab-data.netlify.app/co2.json`}
				dataBranch={branch || pullRequestNumber}
				tracker={tracker}
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
						<nav css="display: flex; justify-content: center; margin: .6rem auto">
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
							<Route path="/documentation" component={Documentation} />
							<Route path="/simulateur/:name+" component={Simulateur} />
							{/* Lien de compatibilité, à retirer par exemple mi-juillet 2020*/}
							<Route path="/fin/:score" component={Fin} />
							<Route path="/fin" component={Fin} />
							<Route path="/actions/:action+" component={Actions} />
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
