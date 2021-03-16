import Route404 from 'Components/Route404'
import 'Components/ui/index.css'
import News from 'Pages/News'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useLocation } from 'react-router'
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
import Logo, { InlineLogo } from './Logo'
import Documentation from './pages/Documentation'
import Personas from './Personas.tsx'
import Privacy from './Privacy'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
import BandeauContribuer from './VersionBeta'

let tracker = devTracker
if (process.env.NODE_ENV === 'production') {
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

const Router = ({}) => {
	const location = useLocation()
	return (
		<>
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
						{location.pathname === '/' ? <Logo /> : <InlineLogo />}
					</Link>
				</nav>
				<Switch>
					<Route exact path="/" component={Landing} />
					{/* Removes trailing slashes */}
					<Route
						path={'/:url*(/+)'}
						exact
						strict
						render={({ location }) => (
							<Redirect
								to={location.pathname.replace(/\/+$/, location.search)}
							/>
						)}
					/>

					<Route path="/documentation" component={Documentation} />
					<Route path="/simulateur/:name+" component={Simulateur} />
					{/* Lien de compatibilité, à retirer par exemple mi-juillet 2020*/}
					<Route path="/fin/:score" component={Fin} />
					<Route path="/fin" component={Fin} />
					<Route path="/personas" component={Personas} />
					<Route path="/actions" component={Actions} />
					<Route path="/contribuer/:input?" component={Contribution} />
					<Route path="/à-propos" component={About} />
					<Route path="/vie-privée" component={Privacy} />
					<Route path="/nouveautés" component={News} />

					<Route component={Route404} />
				</Switch>
			</div>
			<BandeauContribuer />
		</>
	)
}
