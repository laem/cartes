import Route404 from 'Components/Route404'
import { sessionBarMargin } from 'Components/SessionBar'
import 'Components/ui/index.css'
import News from 'Pages/News'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useLocation } from 'react-router'
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
import Diffuser from './Diffuser'
import Fin from './Fin'
import Landing from './Landing'
import Logo from './Logo'
import Navigation from './Navigation'
import Documentation from './pages/Documentation'
import Personas from './Personas.tsx'
import Privacy from './Privacy'
import Profil from './Profil.tsx'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
const ConferenceLazy = React.lazy(() => import('./conference/Conference'))

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

	const iframeShareData = new URLSearchParams(
		document?.location.search.substring(1)
	).get('shareData')

	const persistedSimulation = retrievePersistedSimulation()
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
				previousSimulation: persistedSimulation,
				iframeOptions: { iframeShareData },
				actionChoices: persistedSimulation?.actionChoices || {},
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
			<Main />
		</Provider>
	)
}
const Main = ({}) => {
	const location = useLocation()
	const isHomePage = location.pathname === '/'
	return (
		<div
			className="ui__ container"
			css={`
				@media (min-width: 800px) {
					display: flex;
					min-height: 100vh;
				}

				@media (min-width: 1200px) {
					${!isHomePage &&
					`
						transform: translateX(-4vw);
						`}
				}
				${sessionBarMargin}
			`}
		>
			<Navigation isHomePage={isHomePage} />
			<main
				css={`
					@media (min-width: 800px) {
						flex-grow: 1;
						padding: 1rem;
					}
				`}
			>
				{isHomePage && (
					<nav
						css={`
							display: flex;
							align-items: center;
							justify-content: center;
							text-decoration: none;
							font-size: 170%;
							margin-bottom: 1rem;
						`}
					>
						<Logo />
					</nav>
				)}
				<Routes />
			</main>
		</div>
	)
}

const Routes = ({}) => {
	return (
		<Switch>
			<Route exact path="/" component={Landing} />
			{/* Removes trailing slashes */}
			<Route
				path={'/:url*(/+)'}
				exact
				strict
				render={({ location }) => (
					<Redirect to={location.pathname.replace(/\/+$/, location.search)} />
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
			<Route path="/partenaires" component={Diffuser} />
			<Route path="/diffuser" component={Diffuser} />
			<Route path="/vie-privée" component={Privacy} />
			<Route path="/nouveautés" component={News} />
			<Route path="/profil" component={Profil} />
			<Route path="/conférence/:room?">
				<Suspense fallback="Chargement">
					<ConferenceLazy />
				</Suspense>
			</Route>
			<Redirect from="/conference/:room" to="/conférence/:room" />
			<Route component={Route404} />
		</Switch>
	)
}
