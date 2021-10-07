import { utils } from 'publicodes'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import tinygradient from 'tinygradient'
import Title from '../../components/Title'
import Meta from '../../components/utils/Meta'
import Action from './Action'
import ActionPlus from './ActionPlus'
import ActionsList from './ActionsList'
import CarbonImpact from './CarbonImpact'
import ListeActionPlus from './ListeActionPlus'

const { encodeRuleName, decodeRuleName } = utils

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	return (
		<>
			<Meta
				title="Passer à l'action"
				title="Découvrez les gestes qui vous permettent de réduire votre empreinte climat"
			/>
			<Title>Agir</Title>
			<CarbonImpact actionMode />
			<Switch>
				<Route exact path="/actions/plus">
					<ListeActionPlus />
				</Route>
				<Route path="/actions/plus/:encodedName+">
					<ActionPlus />
				</Route>
				<Route path="/actions/liste">
					<ActionsList display="list" />
				</Route>
				<Route path="/actions/:encodedName+">
					<Action />
				</Route>

				<Route path="/actions">
					<ActionsList />
				</Route>
			</Switch>
		</>
	)
}
