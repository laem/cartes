import Route404 from 'Components/Route404'
import 'Components/ui/index.css'
import News from 'Pages/News'
import Wiki from 'Pages/Wiki'
import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import Provider from '../../Provider'
import {
	persistSimulation,
	retrievePersistedSimulation,
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import About from './About'
import Contribution from './Contribution'
const Ferry = React.lazy(() => import('./ferry/Ferry'))
const Carburants = React.lazy(() => import('./carburants/Carburants'))
import GameOver from './GameOver'
import Instructions from './Instructions'
import Landing from './Landing'
import Documentation from './pages/Documentation'
import Privacy from './Privacy'
import Scenarios from './Scenarios'
import CreditExplanation from './CreditExplanation'
import Simulateur from './Simulateur'
import sitePaths from './sitePaths'

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
				<Route exact path="/" element={<Wiki />} />
				<Route path="/documentation" element={<Documentation />} />
				<Route path="/instructions" element={<Instructions />} />
				<Route path="/simulateur/:name+" element={<Simulateur />} />
				<Route path="/fin/*" element={<GameOver />} />
				{/* Lien de compatibilité, à retirer par exemple mi-juillet 2020*/}
				<Route path="/contribuer/:input?" element={<Contribution />} />
				<Route path="/à-propos" element={<About />} />
				<Route path="/vie-privée" element={<Privacy />} />
				<Route path="/nouveautés" element={<News />} />
				<Route path="/ferry">
					<Suspense fallback={<div>Chargement</div>}>
						<Ferry />
					</Suspense>
				</Route>
				<Route path="/carburants">
					<Suspense fallback={<div>Chargement</div>}>
						<Carburants />
					</Suspense>
				</Route>
				<Route path="/wiki" element={<Wiki />} />
				<Route path="/scénarios" element={<Scenarios />} />
				<Route
					path="/crédit-climat-personnel"
					element={<CreditExplanation />}
				/>

				<Route element={<Route404 />} />
			</Routes>
		</div>
	</>
)
