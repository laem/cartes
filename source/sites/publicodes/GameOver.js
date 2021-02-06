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
				h1 {
					font-size: 250%;
				}
			`}
		>
			<Steps />
		</div>
	)
}

const Steps = () => {
	const [step, setStep] = useState(0)
	if (step === 0)
		return (
			<>
				<h1>Perdu {emoji('🙁')}</h1>
				<p>
					<strong>Vous n'êtes pas écolo.</strong>
				</p>
				<p>
					Vos x premières réponses au test sont formelles : votre train de vie
					nous emène déjà vers une planète anormalement réchauffée. [caler
					l'avancemement visuel ici]
				</p>
				<p>
					On ne vous avait jamais dit que c'était si compliqué ? Eh oui, face à
					la falaise on enfile les œillères des petits gestes qui nous allègent
					la conscience et de la technologie qui nous rassure.
				</p>
				<button className="ui__ button plain" onClick={() => setStep(1)}>
					Comment ça, "pas écolo" ?
				</button>
			</>
		)
	if (step === 1)
		return (
			<>
				<h1>Être écolo, définition !</h1>
				<p>
					On ne peut pas être écolo si on défonce le climat. Avoir une empreinte
					climat de moins de 3 tonnes est une <em>condition nécessaire </em>.
				</p>

				<p>Graphique, explication visuelle.</p>

				<p>
					Ce n'est pas parce qu'on respecte le climat qu'on est écolo, mais en
					pratique, vu l'effort de sobriété que cela demande, c'est déjà une
					super étape.
				</p>
				<button className="ui__ button plain" onClick={() => setStep(3)}>
					Que faire ?
				</button>
			</>
		)
	if (step === 3)
		return (
			<>
				<h1>Changer, maintenant</h1>
				<p>
					On n'a qu'une planète, pas de bouton "recommencer", mais tout n'est
					pas cuit !
				</p>
				<p>Demain vous pourrez ne pas prendre votre voiture.</p>
				<p>Dans deux semaines acheter un vélo. </p>
				<p>
					L'été prochain choisir d'autres destinations de vacances en train.{' '}
				</p>

				<p>L'année prochaine déménager, changer de boulot.</p>
				<button className="ui__ button plain" onClick={() => setStep(4)}>
					On s'y met ?
				</button>
			</>
		)
	if (step === 4)
		return (
			<>
				<h1>Comment prendre le bon chemin ?</h1>
				<p>La règle est simple : -10% d'empreinte par an.</p>
				<p>Expérience intéractive qui propose des pistes de changement</p>
				<button className="ui__ button plain" onClick={() => setStep(5)}>
					Est-ce que ça suffit ?
				</button>
			</>
		)
	if (step === 5)
		return (
			<>
				<h1>En parler, partout, tout le temps</h1>
				<p>
					Quand on comprendre l'ampleur de la catastrophe et de l'effort à
					faire, on a de quoi désespérer.
				</p>
				<p>
					Quand on est tout seul, on déprime. Quand on est beaucoup, on change
					le monde. C'est de notre planète, notre futur, notre paix, notre
					bonheur qu'il s'agit, bordel !{' '}
				</p>
				<p>
					Vous avez des amis, de la famille, l'internet ? Partagez-leur ce test
					⬇️, on est tous dans la <strong>même merde</strong>.
				</p>
				<p>Gros bouton partager</p>
			</>
		)
}
