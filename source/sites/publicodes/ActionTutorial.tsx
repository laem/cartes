import emoji from 'react-easy-emoji'
import { useDispatch } from 'react-redux'
import { actionImg } from '../../components/SessionBar'
import { skipTutorial } from '../../actions/actions'

export default ({ value, unit }) => {
	const dispatch = useDispatch()
	return (
		<div className="ui__ card light colored content" css="margin-top: 1.6rem">
			<h1 css="display: flex; align-items: center">
				<img src={actionImg} css="width: 2rem" />
				Passer à l'action !
			</h1>
			<p>Vous avez terminé votre simulation, {emoji('👏')} bravo !</p>
			<p>
				Vous connaissez maintenant votre empreinte, estimée à {value} {unit}, et
				vous avez sûrement déjà des idées pour la réduire...
			</p>
			<p>
				Pour vous aider, nous vous présenterons{' '}
				<strong>une liste d'actions</strong> :
				<ul css="li {list-style-type: none;}">
					<li>{emoji('✅')} sélectionnez celles qui vous intéressent</li>
					<li>
						{' '}
						{emoji('❌')} écartez celles qui vous semblent trop ambitieuses ou
						déplacées.
					</li>
				</ul>
			</p>
			<p>
				{emoji('💡')} Pour améliorer la précision, certaines actions vous
				poseront quelques questions en plus.
			</p>
			<button
				className="ui__ button plain cta"
				onClick={() => dispatch(skipTutorial('actions'))}
			>
				Démarrer
			</button>
		</div>
	)
}
