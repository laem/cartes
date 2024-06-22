'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useParams, usePathname } from 'next/navigation'
import transformRules from './transformRules'
import setDefaultsToZero from './setDefaultsToZero'

const devMode = process.env.NODE_ENV === 'development'

export default ({ children }) => {
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const setRules = (rules) => dispatch({ type: 'SET_RULES', rules })

	const urlParams = new URLSearchParams(useParams())
	const pathname = usePathname()

	const branch = urlParams.get('branch')
	const pullRequestNumber = urlParams.get('PR')

	useEffect(() => {
		const rulesDomain = ['/simulateur/bilan', '/instructions', '/fin'].find(
			(url) => pathname.indexOf(url) === 0
		)
			? 'data.nosgestesclimat.fr/co2-model.FR-lang.fr.json'
			: 'futureco-data.netlify.app/co2.json'

		/* This enables loading the rules of a branch,
		 * to showcase the app as it would be once this branch of -data  has been merged*/
		const rulesURL = `https://${
			branch
				? `${branch}--`
				: pullRequestNumber
				? `deploy-preview-${pullRequestNumber}--`
				: ''
		}${rulesDomain}`
		const dataBranch = branch || pullRequestNumber
		if (
			false && // To be reactivated when in a dev branch for the final work on this test section on the site, that is based on nosgestesclimat's model
			devMode &&
			!dataBranch &&
			rulesDomain.includes('ecolab-data')
		) {
			// Rules are stored in nested yaml files
			const req = require.context(
				'../../nosgestesclimat/data/',
				true,
				/\.(yaml)$/
			)

			// Bigger rule explanations are stored in nested .md files
			const reqPlus = require.context(
				'raw-loader!../../nosgestesclimat/data/actions-plus/',
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
				const jsonRuleSet = req(key).default || {}
				const ruleSetPlus = Object.fromEntries(
					Object.entries(jsonRuleSet).map(([k, v]) =>
						plusDottedNames[k]
							? [k, { ...v, plus: plusDottedNames[k] }]
							: [k, v]
					)
				)
				return { ...memo, ...ruleSetPlus }
			}, {})

			setRules(setDefaultsToZero(rules))
		} else if (
			false &&
			devMode &&
			!dataBranch &&
			rulesDomain.includes('futureco-data')
		) {
			// Rules are stored in nested yaml files
			const req = require.context(
				'../../../futureco-data/data/',
				true,
				/\.(yaml)$/
			)
			const rules = req.keys().reduce((memo, key) => {
				const jsonRuleSet = req(key).default || {}
				const splitName = key.replace('./', '').split('>.yaml')
				const prefixedRuleSet =
					splitName.length > 1
						? Object.fromEntries(
								Object.entries(jsonRuleSet).map(([k, v]) => [
									k === 'index' ? splitName[0] : splitName[0] + ' . ' + k,
									v,
								])
						  )
						: jsonRuleSet
				return { ...memo, ...prefixedRuleSet }
			}, {})

			setRules(transformRules(rules))
		} else {
			fetch(rulesURL, { mode: 'cors' })
				.then((response) => response.json())
				.then((json) => {
					const newRules = rulesURL.includes('futureco')
						? transformRules(json)
						: setDefaultsToZero(json)
					setRules(newRules)
					const questions = Object.entries(newRules).filter(
						([k, v]) => v && v.question
					)
				})
		}
	}, [pathname, branch, pullRequestNumber])

	if (!rules) return null
	return children
}
