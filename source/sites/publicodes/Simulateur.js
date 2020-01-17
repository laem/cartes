import { setSimulationConfig } from 'Actions/actions'
import { EndingCongratulations } from 'Components/conversation/Conversation'
import PeriodSwitch from 'Components/PeriodSwitch'
import ShareButton from 'Components/ShareButton'
import Simulation from 'Components/Simulation'
import { Markdown } from 'Components/utils/markdown'
import { decodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import CarbonImpact from './CarbonImpact'
import ItemCard from './ItemCard'
import withTarget from './withTarget'

let CarbonImpactWithData = withTarget(CarbonImpact)

let ItemCardWithData = ItemCard(true)

const Simulateur = props => {
	const { name: objectif } = useParams(),
		decoded = decodeRuleName(objectif),
		rules = useSelector(flatRulesSelector),
		rule = findRuleByDottedName(rules, decoded),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded]
		},
		configSet = useSelector(state => state.simulation?.config)
	useEffect(() => dispatch(setSimulationConfig(config, true)), [])

	if (!configSet) return null

	return (
		<div className="ui__ container" css="margin-bottom: 1em">
			<Helmet>
				<title>{rule.title}</title>
				{rule.description && (
					<meta name="description" content={rule.description} />
				)}
			</Helmet>
			<Simulation
				noFeedback
				noProgressMessage
				showConversation
				customEnd={
					<>
						{rule.description ? (
							<Markdown source={rule.description} />
						) : (
							<EndingCongratulations />
						)}
						{props.redirection && <Link to={props.redirection}>Continuer</Link>}
					</>
				}
				targets={
					<>
						<ItemCardWithData />
						{rule.period === 'flexible' && <PeriodBlock />}
					</>
				}
			/>
			<CarbonImpactWithData />
			<ShareButton
				text="Mesure ton impact sur Futur.eco !"
				url={window.location.href}
				title={rule.title}
			/>
		</div>
	)
}

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)

export default Simulateur
