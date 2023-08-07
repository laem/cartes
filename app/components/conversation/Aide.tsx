import animate from 'Components/ui/animate'
import { Markdown } from 'Components/utils/markdown'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './Aide.css'
import mosaicQuestions from './mosaicQuestions'

export default function Aide() {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const stopExplaining = () => dispatch({ type: 'EXPLAIN_VARIABLE' })

	if (!explained) return null

	const rule =
			rules[explained] ||
			mosaicQuestions.find((question) => question.dottedName === explained),
		text = rule.description

	return (
		<animate.fromTop>
			<div
				css={`
					padding: 0.6rem;
					position: relative;
					> button {
						text-align: right;
					}
				`}
			>
				{rule.title && <h2>{rule.title}</h2>}
				<Markdown>{text}</Markdown>
				<button onClick={stopExplaining} className="ui__ button simple">
					Refermer
				</button>
			</div>
		</animate.fromTop>
	)
}
