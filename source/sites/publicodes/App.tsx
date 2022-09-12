import 'Components/ui/index.css'
import News from 'Pages/News'
import Wiki from 'Pages/Wiki'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import Provider from '../../Provider'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import About from './About'
import Contribution from './Contribution'
import CreditExplanation from './CreditExplanation'
import GameOver from './GameOver'
import Instructions from './Instructions'
import Privacy from './Privacy'
import Scenarios from './Scenarios'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'
const Carburants = React.lazy(() => import('./carburants/Carburants'))
const Documentation = React.lazy(() => import('./pages/Documentation'))
const Lab = React.lazy(() => import('./ferry/Lab'))

let tracker = devTracker
if (NODE_ENV === 'production') {
	tracker = new Tracker()
}

export default function Root({}) {
	const { language } = useTranslation().i18n
	const paths = sitePaths()

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
		>
			<Router />
		</Provider>
	)
}

const Router = ({}) => (
	<>
		<div css="height: 100%">
			<Routes>
				<Route path="/" element={<Wiki />} />
				<Route
					path="documentation/*"
					element={
						<Suspense fallback={<div>Chargement</div>}>
							<Documentation />
						</Suspense>
					}
				/>
				<Route path="instructions" element={<Instructions />} />
				<Route path="simulateur/*" element={<Simulateur />} />
				<Route path="fin/*" element={<GameOver />} />
				<Route path="contribuer/:input" element={<Contribution />} />
				<Route path={encodeURIComponent('à-propos')} element={<About />} />
				<Route path={encodeURIComponent('vie-privée')} element={<Privacy />} />
				<Route path={encodeURIComponent('nouveautés')} element={<News />} />
				<Route
					path="carburants/*"
					element={
						<Suspense fallback={<div>Chargement</div>}>
							<Carburants />
						</Suspense>
					}
				/>
				<Route path="wiki" element={<Wiki />} />
				<Route path={encodeURIComponent('scénarios')} element={<Scenarios />} />
				<Route
					path={encodeURIComponent('crédit-climat-personnel')}
					element={<CreditExplanation />}
				/>

				<Route
					path="ferry"
					element={
						<Navigate
							replace
							to="/simulateur/transport/ferry/empreinte-du-voyage"
						/>
					}
				/>

				<Route
					path="ferry/surface-mega-express-four"
					element={
						<Suspense fallback={<div>Chargement</div>}>
							<Lab />
						</Suspense>
					}
				/>
					<Route
					path="avion"
					element={
						<Navigate
							replace
							to="/simulateur/transport/avion/impact"
						/>
					}
				/>
			</Routes>
		</div>
	</>
)
