import Route404 from 'Components/Route404'
import 'Components/ui/index.css'
import News from 'Pages/News'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'
import Provider from '../../Provider'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import About from './About'
import Actions from './Actions'
import Contribution from './Contribution'
import GameOver from './GameOver'
import Instructions from './Instructions'
import Landing from './Landing'
import Documentation from './pages/Documentation'
import Privacy from './Privacy'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
import Ferry from './ferry/Ferry'
import Wiki from 'Pages/Wiki'

let tracker = devTracker
if (NODE_ENV === 'production') {
	tracker = new Tracker()
}

export default function Root({}) {
	const { language } = useTranslation().i18n
	const paths = sitePaths()

	const urlParams = new URLSearchParams(window.location.search)
	/* This enables loading the rules of a branch,
	 * to showcase the app as it would be once this branch of -data  has been merged*/
	const branch = urlParams.get('branch')
	const pullRequestNumber = urlParams.get('PR')
	return (
		<Provider
			tracker={tracker}
			sitePaths={paths}
			reduxMiddlewares={[]}
			onStoreCreated={(store) => {
				//persistEverything({ except: ['simulation'] })(store)
				persistSimulation(store)
			}}
			initialStore={{
				//...retrievePersistedState(),
				previousSimulation: retrievePersistedSimulation(),
			}}
			rulesURL={`https://${
				branch
					? `${branch}--`
					: pullRequestNumber
					? `deploy-preview-${pullRequestNumber}--`
					: ''
			}ecolab-data.netlify.app/co2.json`}
			dataBranch={branch || pullRequestNumber}
		>
			<Router />
		</Provider>
	)
}

const Router = ({}) => (
	<>
		<div css="height: 100%">
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route path="/documentation" component={Documentation} />
				<Route path="/instructions" component={Instructions} />
				<Route path="/simulateur/:name+" component={Simulateur} />
				{/* Lien de compatibilité, à retirer par exemple mi-juillet 2020*/}
				<Route path="/fin" component={GameOver} />
				<Route path="/actions" component={Actions} />
				<Route path="/contribuer/:input?" component={Contribution} />
				<Route path="/à-propos" component={About} />
				<Route path="/vie-privée" component={Privacy} />
				<Route path="/nouveautés" component={News} />
				<Route path="/ferry" component={Ferry} />
				<Route path="/wiki" component={Wiki} />

				<Route component={Route404} />
			</Switch>
		</div>
	</>
)
