import {
	deletePreviousSimulation,
	resetActionChoices,
	resetSimulation,
} from 'Actions/actions'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import AnswerList from '../../components/conversation/AnswerList'
import Title from '../../components/Title'
import Meta from '../../components/utils/Meta'
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
			<Meta
				title="Mon profil"
				title="Explorez et modifiez les informations que vous avez saisies dans le parcours nosgestesclimat."
			/>
			<Title>Mon profil</Title>
			<div className="ui__ container" css="padding-top: 1rem">
				<ScrollToTop />
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
								dispatch(resetActionChoices())
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
