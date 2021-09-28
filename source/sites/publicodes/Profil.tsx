import { deletePreviousSimulation, resetSimulation } from 'Actions/actions'
import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import AnswerList from '../../components/conversation/AnswerList'
import { ScrollToTop } from '../../components/utils/Scroll'

export default ({}) => {
	const dispatch = useDispatch()
	return (
		<div>
			<div className="ui__ container">
				<ScrollToTop />
				<h1>Mon profil</h1>
				<details>
					<summary>Où sont mes données ? </summary>
					Vos données sont stockées dans votre navigateur, vous avez donc le
					contrôle total sur elles.
				</details>
				<button
					className="ui__ button plain"
					css="margin: 1rem 0"
					onClick={() => {
						dispatch(resetSimulation())
						dispatch(deletePreviousSimulation())
					}}
				>
					{emoji('♻️ ')}
					Recommencer
				</button>
				<AnswerList />
			</div>
		</div>
	)
}
