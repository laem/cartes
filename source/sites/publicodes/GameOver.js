import { useState } from 'react'
import emoji from 'react-easy-emoji'

export default () => {
	return (
		<div
			className="ui__ container"
			css={`
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				text-align: center;
				height: 70%;
			`}
		>
			<Steps />
		</div>
	)
}

const Steps = () => {
	const [step, setStep] = useState(1)
	if (step === 1)
		return (
			<>
				<h1>Perdu {emoji('🙁')}</h1>
				<p>
					<strong>Vous n'êtes pas écolo.</strong>
				</p>
				<p>
					Pourquoi ? Après 5 questions sur 20, nous avons déjà calculé que votre
					train de vie nous emène vers une planète anormalement réchauffée.
				</p>
				<p>
					On ne vous avait jamais dit que c'était si compliqué ? Oui, ce genre
					de choses on préfère ne pas en parler.
				</p>
				<button className="ui__ button plain" onClick={() => setStep(2)}>
					Recommencer
				</button>
			</>
		)
	if (step === 2)
		return (
			<>
				<h1>On n'a qu'une planète</h1>
				<p>
					Malheureusement, le réchauffement climatique n'est pas un jeu avec des
					vies pour réparer nos erreurs.{' '}
				</p>
				<p>
					Chaque année, on pourrit la planète et notre futur et il n'y aura pas
					de bouton recommencer.
				</p>
				<button className="ui__ button plain" onClick={() => setStep(3)}>
					Que faire ?
				</button>
			</>
		)
	if (step === 3)
		return (
			<>
				<h1>C'est déprimant, hein ?</h1>
				<p>Oui, il y a de quoi désespérer.</p>
				<p>
					Quand on est tout seul, on déprime. Quand on est beaucoup, on agit.
					C'est de notre planète, notre futur, notre paix, notre bonheur qu'il
					s'agit, bordel !{' '}
				</p>
				<p>
					Vous avez des amis, de la famille, l'internet ? Partagez-leur ce test
					⬇️, on n'est tous dans la même merde.
				</p>
				<button className="ui__ button plain" onClick={() => setStep(4)}>
					La bonne nouvelle...
				</button>
			</>
		)
	if (step === 4)
		return (
			<>
				<h1>Changer, maintenant</h1>
				<p>Demain vous pourrez peut-etre ne pas prendre votre voiture.</p>
				<p>
					Dans deux semaines acheter un vélo. L'été prochain vous pouvez choisir
					d'autres destinations de vacances en train.{' '}
				</p>
				<p>L'année prochaine déménager, changer de boulot.</p>
			</>
		)
}
