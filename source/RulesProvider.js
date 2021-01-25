import {
	EngineProvider,
	SituationProvider,
	engineOptions,
} from 'Components/utils/EngineContext'
import {
	configSituationSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'

import Engine from 'publicodes'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const removeLoader = () => {
	// Remove loader
	var css = document.createElement('style')
	css.type = 'text/css'
	css.innerHTML = `
		#js {
				animation: appear 0.5s;
				opacity: 1;
		}
		#loading {
				display: none !important;
		}
    `
	document.body.appendChild(css)
}

export default ({ children, rulesURL, dataBranch }) => {
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const setRules = (rules) => dispatch({ type: 'SET_RULES', rules })

	useEffect(() => {
		if (process.env.NODE_ENV === 'development' && !dataBranch) {
			// Rules are stored in nested yaml files
			const req = require.context('../../ecolab-data/data/', true, /\.(yaml)$/)

			// Bigger rule explanations are stored in nested .md files
			const reqPlus = require.context(
				'raw-loader!../../ecolab-data/data/actions/plus/',
				true,
				/\.(md)$/
			)

			const plusDottedNames = Object.fromEntries(
				reqPlus
					.keys()
					.map((path) => [
						path.replace(/(\.\/|\.md)/g, ''),
						reqPlus(path).default,
					])
			)

			const rules = req.keys().reduce((memo, key) => {
				const jsonRuleSet = req(key) || {}
				const ruleSetPlus = Object.fromEntries(
					Object.entries(jsonRuleSet).map(([k, v]) =>
						plusDottedNames[k]
							? [k, { ...v, plus: plusDottedNames[k] }]
							: [k, v]
					)
				)
				return { ...memo, ...ruleSetPlus }
			}, {})
			setRules(rules)
			removeLoader()
		} else {
			fetch(rulesURL, { mode: 'cors' })
				.then((response) => response.json())
				.then((json) => {
					setRules(json)
					removeLoader()
				})
		}
	}, [])

	if (!rules) return null
	return <EngineWrapper rules={rules}>{children}</EngineWrapper>
}

const EngineWrapper = ({ rules, children }) => {
	const engine = useMemo(() => new Engine(rules, engineOptions), [
			rules,
			engineOptions,
		]),
		userSituation = useSelector(situationSelector),
		configSituation = useSelector(configSituationSelector),
		situation = useMemo(
			() => ({
				...configSituation,
				...userSituation,
			}),
			[configSituation, userSituation]
		)

	return (
		<EngineProvider value={engine}>
			<SituationProvider situation={situation}>{children}</SituationProvider>
		</EngineProvider>
	)
}
