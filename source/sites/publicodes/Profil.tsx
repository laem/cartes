import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setDifferentSituation } from '../../actions/actions'
import AnswerList from '../../components/conversation/AnswerList'
import SessionBar from '../../components/SessionBar'
import { ScrollToTop } from '../../components/utils/Scroll'
import { CardGrid } from './ListeActionPlus'
import personas from './personas.yaml'

export default ({}) => {
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
				<AnswerList />
			</div>
		</div>
	)
}
