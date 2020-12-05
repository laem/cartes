import { EngineProvider } from 'Components/utils/EngineContext'
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
			var req = require.context('../../ecolab-data/data/', true, /\.(yaml)$/)

			const rules = req.keys().reduce((memo, key) => {
				const jsonRuleSet = req(key)
				return { ...memo, ...jsonRuleSet }
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
	const engine = useMemo(() => new Engine(rules), [rules])

	return <EngineProvider value={engine}>{children}</EngineProvider>
}
