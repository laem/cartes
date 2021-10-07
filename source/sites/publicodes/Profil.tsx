import { Link } from 'react-router-dom'
import {
	deletePreviousSimulation,
	resetActionChoices,
	resetSimulation,
} from 'Actions/actions'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import AnswerList from '../../components/conversation/AnswerList'
import Title from '../../components/Title'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
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
						<p></p>
						<details>
							<summary>
								Vous avez répondu à {answeredQuestionsLength} questions et
								choisi {actionChoicesLength} actions. Où sont mes données ?{' '}
							</summary>
							Vos données sont stockées dans votre navigateur, vous avez donc le
							contrôle total sur elles. <br />
							<Link to="/vie-privée">En savoir plus</Link>
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
					<IllustratedMessage
						emoji="🕳️"
						message={<p>Vous n'avez pas encore fait le test.</p>}
					></IllustratedMessage>
				)}
				<AnswerList />
			</div>
		</div>
	)
}
