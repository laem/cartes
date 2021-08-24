import { setSimulationConfig } from 'Actions/actions'
import { splitName } from 'Components/publicodesUtils'
import SessionBar from 'Components/SessionBar'
import { EngineContext } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import { partition, sortBy, union } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useLocation, useParams } from 'react-router'
import { Link, Route, Switch } from 'react-router-dom'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import tinygradient from 'tinygradient'
import { setActionMode } from '../../actions/actions'
import IllustratedButton from 'Components/IllustratedButton'
import {
	answeredQuestionsSelector,
	configSelector,
} from '../../selectors/simulationSelectors'
import Action from './Action'
import ActionsList from './ActionsList'
import ActionPlus from './ActionPlus'
import ActionVignette, { disabledAction } from './ActionVignette'
import { extractCategories } from 'Components/publicodesUtils'
import ListeActionPlus from './ListeActionPlus'
import ModeChoice from './ModeChoice'
import CategoryFilters from './CategoryFilters'
import { correctValue } from '../../components/publicodesUtils'
import { sessionBarMargin } from '../../components/SessionBar'
import Meta from '../../components/utils/Meta'

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
			<Switch>
				<Route exact path="/actions/plus">
					<ListeActionPlus />
				</Route>
				<Route exact path="/actions/catégorie/:category">
					<ActionsList />
				</Route>
				<Route path="/actions/plus/:encodedName+">
					<ActionPlus />
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
