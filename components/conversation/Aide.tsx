'use client'
import { RootState } from '@/reducers'
import animate from 'Components/ui/animate'
import { Markdown } from 'Components/utils/ClientMarkdown'
import { useDispatch, useSelector } from 'react-redux'
import { LightButton } from '../UI'
import './Aide.css'
import mosaicQuestions from './mosaicQuestions'

export default function Aide({ rules }) {
	const explained = useSelector((state: RootState) => state.explainedVariable)

	const dispatch = useDispatch()

	const stopExplaining = () => dispatch({ type: 'EXPLAIN_VARIABLE' })

	if (!explained) return null

	const rule =
			rules[explained] ||
			mosaicQuestions.find((question) => question.dottedName === explained),
		text = rule.rawNode.description

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
				{rule.rawNode.title && <h2>{rule.rawNode.title}</h2>}
				<Markdown>{text}</Markdown>
				<LightButton onClick={stopExplaining}>Refermer</LightButton>
			</div>
		</animate.fromTop>
	)
}
