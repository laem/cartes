import { explainVariable } from 'Actions/actions'
import Overlay from 'Components/Overlay'
import { Markdown } from 'Components/utils/markdown'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import { References } from 'publicodes-react'
import { Trans } from 'react-i18next'
import './Aide.css'
import { EngineContext } from 'Components/utils/EngineContext'
import mosaicQuestions from './mosaicQuestions'
import animate from 'Components/ui/animate'

export default function Aide() {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const stopExplaining = () => dispatch(explainVariable())

	if (!explained) return null

	const rule =
			rules[explained] ||
			mosaicQuestions.find((question) => question.dottedName === explained),
		text = rule.description,
		refs = rule.références

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
				<Markdown source={text} />
				{refs && (
					<>
						<h3>
							<Trans>En savoir plus</Trans>
						</h3>
						<References refs={refs} />
					</>
				)}
				<button onClick={stopExplaining} className="ui__ button simple">
					Refermer
				</button>
			</div>
		</animate.fromTop>
	)
}
