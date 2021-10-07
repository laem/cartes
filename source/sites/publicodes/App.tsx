import Route404 from 'Components/Route404'
import 'Components/ui/index.css'
import News from 'Pages/News'
import React, { Suspense } from 'react'
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
import Diffuser from './Diffuser'
import Actions from './Actions'
import Contribution from './Contribution'
import Fin from './Fin'
import Landing from './Landing'
import Logo, { InlineLogo } from './Logo'
import Documentation from './pages/Documentation'
import Personas from './Personas.tsx'
import Profil from './Profil.tsx'
import Privacy from './Privacy'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
const ConferenceLazy = React.lazy(() => import('./conference/Conference'))
import ConferenceBarLazy from './conference/ConferenceBarLazy'
import SessionBar, { sessionBarMargin } from 'Components/SessionBar'

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
			<Router />
		</Provider>
	)
}

const Router = ({}) => {
	const location = useLocation()
	return (
		<>
			<div
				className="ui__ container"
				css={`
					@media (min-width: 800px) {
						display: flex;
						min-height: 100vh;
					}

					${sessionBarMargin}
				`}
			>
				<ConferenceBarLazy />
				<nav
					css={`
						display: flex;
						justify-content: center;
						margin: 0.6rem auto;

						@media (min-width: 800px) {
							flex-shrink: 0;
							width: 14rem;
							height: 100vh;
							overflow: auto;
							position: sticky;
							top: 0;
							flex-direction: column;
							justify-content: start;
							border-right: 1px solid #eee;
						}
					`}
				>
					<Link
						to="/"
						css={`
							display: flex;
							align-items: center;
							justify-content: center;
							text-decoration: none;
							font-size: 170%;
							margin-bottom: 0;
							#blockLogo {
								display: none;
							}
							@media (min-width: 800px) {
								margin-bottom: 0.4rem;
								#inlineLogo {
									display: none;
								}
								justify-content: start;
								#blockLogo {
									margin: 1rem;
									display: block;
								}
							}
						`}
					>
						<Logo />
						<InlineLogo />
					</Link>
					{location.pathname !== '/' && <SessionBar />}
				</nav>
				<main
					css={`
						@media (min-width: 800px) {
							flex-grow: 1;
							padding: 1rem;
						}
					`}
				>
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
				</main>
			</div>
		</>
	)
}
