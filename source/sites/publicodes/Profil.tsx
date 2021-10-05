import { deletePreviousSimulation, resetSimulation } from 'Actions/actions'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import AnswerList from '../../components/conversation/AnswerList'
import { ScrollToTop } from '../../components/utils/Scroll'
import { answeredQuestionsSelector } from '../../selectors/simulationSelectors'

export default ({}) => {
	const dispatch = useDispatch()
	const persona = useSelector((state) => state.simulation?.persona)
	const answeredQuestionsLength = useSelector(answeredQuestionsSelector).length
	const actionChoicesLength = Object.keys(
		useSelector((state) => state.actionChoices)
	).length
	return (
		<div>
			<div className="ui__ container">
				<ScrollToTop />
				<h1>Mon profil</h1>
				{persona && (
					<p>
						<em>
							{emoji('👤')}&nbsp; Vous utilisez actuellement le persona{' '}
							<code>{persona}</code>
						</em>
					</p>
				)}
				{answeredQuestionsLength > 0 ? (
					<div>
						<p>
							Vous avez répondu à {answeredQuestionsLength} questions et choisi{' '}
							{actionChoicesLength} actions.
						</p>
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
					</div>
				) : (
					<p>{emoji('🕳️')} Vous n'avez pas encore fait le test.</p>
				)}
				<AnswerList />
			</div>
		</div>
	)
}
