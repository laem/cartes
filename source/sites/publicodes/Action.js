import { setSimulationConfig } from 'Actions/actions'
import SessionBar from 'Components/SessionBar'
import Simulation from 'Components/Simulation'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils, formatValue } from 'publicodes'
import React, { useContext, useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { HumanWeight } from './HumanWeight'
import BallonGES from './images/ballonGES.svg'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { EngineContext } from '../../components/utils/EngineContext'
import { splitName } from 'Components/publicodesUtils'
import { parentName } from '../../components/publicodesUtils'
import { correctValue } from './Actions'

const { decodeRuleName, encodeRuleName } = utils

export const Footprint = ({ value }) => <div>Lala {value}</div>

export default ({}) => {
	const { encodedName } = useParams()
	const rules = useSelector((state) => state.rules)
	const nextQuestions = useNextQuestions()
	const dottedName = decodeRuleName(encodedName)
	const configSet = useSelector((state) => state.simulation?.config)

	// TODO here we need to apply a rustine to accommodate for this issue
	// https://github.com/betagouv/mon-entreprise/issues/1316#issuecomment-758833973
	// to be continued...
	const actionParent = parentName(dottedName)
	const config = {
		objectifs: [dottedName],
		situation: { ...(configSet?.situation || {}) },
	}

	const engine = useContext(EngineContext)

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setSimulationConfig(config))
	}, [encodedName])
	if (!configSet) return null

	const evaluation = engine.evaluate(dottedName),
		{ nodeValue, title, plus } = evaluation

	const { description, icônes: icons } = rules[dottedName]

	const flatActions = rules['actions']
	const relatedActions = flatActions.formule.somme
		.filter(
			(actionDottedName) =>
				actionDottedName !== dottedName &&
				splitName(dottedName)[0] === splitName(actionDottedName)[0]
		)
		.map((name) => engine.getRule(name))

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<ScrollToTop />
			<Link to="/actions">
				<button className="ui__ button simple small ">
					{emoji('◀')} Retour à la liste
				</button>
			</Link>
			<div className="ui__ card" css={'padding: .1rem; margin: .8rem 0'}>
				<header css="margin-bottom: 1rem; h1 {font-size: 180%;}; h1 > span {margin-right: 1rem}">
					<h1>
						{icons && <span>{emoji(icons)}</span>}
						{title}
					</h1>
					{nodeValue != null && (
						<div css="display: flex; align-items: center">
							<img src={BallonGES} css="height: 6rem" />
							<div>
								<HumanWeight
									nodeValue={correctValue({ nodeValue, unit: evaluation.unit })}
								/>
								<div>
									<Link to={'/documentation/' + encodeRuleName(dottedName)}>
										{emoji('🔬 ')} comprendre le calcul
									</Link>
								</div>
							</div>
						</div>
					)}
				</header>
				<div css="margin: 1.6rem 0">
					<Markdown source={description} />
					{plus && (
						<Link to={'/actions/plus/' + encodedName}>
							<button className="ui__ button plain">En savoir plus</button>
						</Link>
					)}
				</div>
			</div>
			<SessionBar answerButtonOnly />
			{nextQuestions.length > 0 && (
				<>
					<p>Personnalisez cette estimation</p>
					<Simulation
						noFeedback
						showConversation
						customEnd={<div />}
						targets={<div />}
						explanations={null}
					/>
				</>
			)}
			{relatedActions && (
				<>
					<p>Sur le même sujet</p>
					<div>
						{relatedActions.map((action) => (
							<Link
								to={'/actions/' + encodeRuleName(action.dottedName)}
								css="> button {margin: .3rem .6rem}"
							>
								<button className="ui__ small button">{action.title}</button>
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	)
}
