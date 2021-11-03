import { Markdown } from 'Components/utils/markdown'
import { toPairs } from 'ramda'
import React, { useState } from 'react'
import { renderToString } from 'react-dom/server'
import emoji from 'react-easy-emoji'
import Meta from '../../components/utils/Meta'
import { useQuery } from '../../utils'
import FAQ from './FAQ.yaml'

const formStyle = `
label {
	display: block;
	margin-bottom: 1em;
}
label input, label textarea {
	display: block;
	border-radius: .3em;
	padding: .3em ;
	border: 1px solid var(--color);
	box-shadow: none;
	margin-top: .6em;
	font-size: 100%;
	width: 80%

}
label textarea {
	height: 6em;
}`

const createIssue = (title, body, setURL, disableButton) => {
	if (title == null || body == null || [title, body].includes('')) {
		return null
	}

	fetch(
		'https://publicodes.netlify.app/.netlify/functions/createIssue?' +
			toPairs({
				repo: 'datagir/nosgestesclimat',
				title,
				body,
				labels: ['contribution'],
			})
				.map(([k, v]) => k + '=' + encodeURIComponent(v))
				.join('&'),
		{ mode: 'cors' }
	)
		.then((response) => response.json())
		.then((json) => {
			setURL(json.url)
			disableButton(false)
		})
}

export default ({}) => {
	const fromLocation = useQuery().get('fromLocation')
	const [sujet, setSujet] = useState('')
	const [comment, setComment] = useState('')
	const [URL, setURL] = useState(null)
	const [buttonDisabled, disableButton] = useState(false)

	const structuredFAQ = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: FAQ.map((element) => ({
			'@type': 'Question',
			name: element.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: renderToString(
					<Markdown escapeHtml={false} source={element.réponse} />
				),
			},
		})),
	}
	const categories = FAQ.reduce(
		(memo, next) =>
			memo.includes(next.catégorie) ? memo : [...memo, next.catégorie],
		[]
	)

	return (
		<div className="ui__ container" css="padding-bottom: 1rem">
			<Meta
				title="Contribuer"
				description="Découvrez les questions fréquentes sur Nos Gestes Climat, et comment en poser de nouvelles ou nous aider."
			>
				<script type="application/ld+json">
					{JSON.stringify(structuredFAQ)}
				</script>
			</Meta>
			<h1>Contribuer</h1>
			<p>
				Vous trouverez ici les réponses aux questions les plus fréquentes. S’il
				vous reste des interrogations ou si vous souhaitez nous proposer des
				améliorations, rendez-vous tout en bas. Bonne lecture !
			</p>
			<div
				css={`
					padding-bottom: 1rem;
					li {
						list-style-type: none;
					}
					h3 {
						display: inline;
					}
					h2 {
						text-transform: uppercase;
					}
					details > div {
						margin: 1rem;
						padding: 0.6rem;
					}
				`}
			>
				{categories.map((category) => (
					<li>
						<h2>{category}</h2>
						<ul>
							{FAQ.filter((el) => el.catégorie === category).map(
								({ category, question, réponse, id }) => (
									<li>
										<details id={id}>
											<summary>
												<h3>{question}</h3>
											</summary>
											<div className="ui__ card">
												<Markdown escapeHtml={false} source={réponse} />
											</div>
										</details>
									</li>
								)
							)}
						</ul>
					</li>
				))}
			</div>
			<h2 css="font-size: 180%">{emoji('🙋‍♀️')}J'ai une autre question</h2>
			<div className="ui__ card" css="padding: 1rem 0">
				<p>
					Pour toute remarque ou question, nous vous invitons à{' '}
					<a href="https://github.com/datagir/nosgestesclimat/issues/new?assignees=&labels=contribution&template=retour-utilisateur.md&title=">
						ouvrir un ticket directement sur Github
					</a>
					.
				</p>
				<details>
					<summary>
						{emoji('🐛')} Vous avez un bug qui vous empêche d'utiliser Nos
						Gestes Climat ?{' '}
					</summary>

					<div className="ui__ card" css="padding: 1rem 0">
						{!URL ? (
							<form css={formStyle}>
								<label css="color: var(--color)">
									Le titre bref de votre problème
									<input
										value={sujet}
										onChange={(e) => setSujet(e.target.value)}
										type="text"
										name="sujet"
										required
									/>
								</label>
								<label css="color: var(--color)">
									<p>La description complète de votre problème</p>
									<p>
										<small>
											En indiquant le navigateur que vous utilisez (par exemple
											Firefox version 93, Chrome version 95, Safari, etc.), et
											la plateforme (iPhone, Android, ordinateur Windows, etc.),
											vous nous aiderez à résoudre le bug plus rapidement.
										</small>
									</p>
									<textarea
										value={comment}
										onChange={(e) => setComment(e.target.value)}
										name="comment"
										required
									/>
								</label>
								<p>
									<em>
										Cette contribution sera publique : n'y mettez pas
										d'informations sensibles
									</em>
								</p>
								<button
									className="ui__ button"
									type="submit"
									disabled={buttonDisabled}
									onClick={(e) => {
										if (buttonDisabled) return null

										e.preventDefault()
										disableButton(true)
										const augmentedComment =
											comment +
											`

${fromLocation ? `Depuis la page : \`${fromLocation}\`` : ''}

> Ce ticket a été créé automatiquement par notre robot depuis notre [page de contribution](https://nosgestesclimat.fr/contribuer).

									`
										createIssue(sujet, augmentedComment, setURL, disableButton)
									}}
								>
									Valider
								</button>
							</form>
						) : (
							<p>
								Merci {emoji('😍')} ! Suivez l'avancement de votre suggestion en
								cliquant sur <a href={URL}>ce lien</a>.
							</p>
						)}
					</div>
				</details>
			</div>
		</div>
	)
}
