import { resetSimulation, setSimulationConfig } from 'Actions/actions'
import { compose, equals } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { noUserInputSelector } from 'Selectors/analyseSelectors'

export default config => SimulationComponent =>
	compose(
		connect(
			state => ({
				config: state.simulation?.config,
				noUserInput: noUserInputSelector(state)
			}),
			{
				setSimulationConfig,
				resetSimulation
			}
		),
		withRouter
	)(
		class DecoratedSimulation extends React.Component {
			constructor(props) {
				super(props)
				if (!equals(config, props.config)) {
					props.setSimulationConfig(config)
					if (props.config) {
						props.resetSimulation()
					}
				}
			}
			render() {
				if (!this.props.config) return null
				return <SimulationComponent {...this.props} />
			}
		}
	)
