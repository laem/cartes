import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import Simu from 'Components/Simu'
import React from 'react'
import Marianne from '../images/marianne.svg'
import './Home.css'

const Home = () => (
	<div id="home" className="ui__ container">
		<PreviousSimulationBanner />
		<Simu />
		<a href="https://beta.gouv.fr" target="_blank" rel="noopener noreferrer">
			<img id="marianne" src={Marianne} alt="Un service de l'État français" />
		</a>
	</div>
)

export default Home
