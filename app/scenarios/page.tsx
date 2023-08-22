import Emoji from 'Components/Emoji'
import List from './List'

const Page = () => {
	return (
		<main id="scenarios">
			<h1>Votre scénario climat</h1>
			<h2 css="display: inline-block;background: var(--color); padding: .1rem .4rem; margin-right: .4rem;  color: white; margin-top: 1rem; width: 21rem;">
				Quel futur souhaitez vous ?
			</h2>
			<p>
				L'évolution du climat, et donc notre futur, est directement lié à la
				somme de toutes nos émissions de carbone individuelles de consommation.
			</p>
			<p>
				Par défaut, le crédit carbone <strong>est fixé à 2 tonnes</strong>, car
				c'est l'objectif le plus connu du grand public aujourd'hui. Mais libre à
				vous de choisir votre objectif parmi ces trois scénarios. &nbsp;
				<Emoji e={'👇'} />
			</p>
			<List />
			<div
				css={`
					display: none;
					margin: 0.6em auto;
					@media (max-width: 600px) {
						display: block;
						text-align: center;
					}
					font-size: 200%;
					filter: invert(1);
				`}
			>
				<Emoji extra="E105" alt="glisser horizontalement" black />
			</div>
			<p>
				Les conséquences de ces scénarios sont bien évidemment très compliquées
				à prévoir : ces descriptions sont indicatives et évolueront notamment
				lors du prochain rapport du{' '}
				<a href="https://fr.wikipedia.org/wiki/Groupe_d%27experts_intergouvernemental_sur_l%27%C3%A9volution_du_climat">
					GIEC
				</a>
				.
			</p>
			<p>
				Si vous êtes à l'aise en anglais, l'article{' '}
				<a href="http://nymag.com/intelligencer/2017/07/climate-change-earth-too-hot-for-humans.html">
					The Uninhabitable Earth
				</a>{' '}
				et le livre associé décrivent de façon très convainquante le pire des
				scénarios, et{' '}
				<a href="https://climatefeedback.org/evaluation/scientists-explain-what-new-york-magazine-article-on-the-uninhabitable-earth-gets-wrong-david-wallace-wells/">
					cet autre article
				</a>{' '}
				l remet en perspective de façon scientifiquement plus rigoureuse.
			</p>
		</main>
	)
}

export default Page
