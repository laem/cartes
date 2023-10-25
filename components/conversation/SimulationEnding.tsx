import AvionExplanation from '../AvionExplanation'
import Emoji from '../Emoji'

const SimulationEnding = ({ rule, engine, objectives }) => {
	return (
		<div style={{ textAlign: 'center' }}>
			<>
				<h3>
					<Emoji e={'🌟'} /> Vous avez complété cette simulation
				</h3>
				{objectives[0] === 'transport . avion . impact' ? (
					<AvionExplanation engine={engine} />
				) : (
					<p>
						Vous avez maintenant accès à l'estimation la plus précise possible.
					</p>
				)}
			</>
		</div>
	)
}

export default SimulationEnding
