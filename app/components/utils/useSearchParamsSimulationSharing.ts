import { useEngine } from 'Components/utils/EngineContext'
import Engine, { ParsedRules, serializeEvaluation } from 'publicodes'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { configSelector } from 'Selectors/simulationSelectors'
import { batchUpdateSituation } from '@/app/actions'
import {
	RootState,
	SimulationConfig,
	Situation,
} from '../../reducers/rootReducer'
import { situationSelector } from '../../selectors/simulationSelectors'

type Objectifs = (string | { objectifs: string[] })[]
type ShortName = string
type DottedName = string
type ParamName = DottedName | ShortName

export function syncSearchParams() {
	const [searchParams, setSearchParams] = useSearchParams()
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)
	const situationSearchParams = useParamsFromSituation(situation)
	const engine = useEngine()

	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)
	useEffect(() => {
		const newSituation = getSituationFromSearchParams(
			searchParams,
			dottedNameParamName
		)
		dispatch(batchUpdateSituation(newSituation as Situation))
	}, [])
	useEffect(() => {
		setSearchParams(situationSearchParams, { replace: true })
	}, [situationSearchParams.toString()])
}

export default function useSearchParamsSimulationSharing() {
	const [urlSituationIsExtracted, setUrlSituationIsExtracted] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const config = useSelector(configSelector)
	const simulationUrl = useSelector((state: RootState) => state.simulation?.url)
	const currentUrl = useLocation().pathname
	const dispatch = useDispatch()
	const engine = useEngine()

	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)

	useEffect(() => {
		// const hasConfig = Object.keys(config).length > 0

		// // TODO: this check is specific to `useSimulationConfig` and
		// // `setSimulationConfig`, so we'd prefer not doing it here. Other ideas
		// // include having the config in a provider rather than in state.
		// const configLoadedInState = simulationUrl === currentUrl
		// if (!hasConfig || !configLoadedInState) return

		// On load:
		if (!urlSituationIsExtracted) {
			const objectifs = objectifsOfConfig(config)
			const newSituation = getSituationFromSearchParams(
				searchParams,
				dottedNameParamName
			)

			dispatch(batchUpdateSituation(newSituation as Situation))

			cleanSearchParams(
				searchParams,
				setSearchParams,
				dottedNameParamName,
				Object.keys(newSituation) as DottedName[]
			)

			setUrlSituationIsExtracted(true)
		}
		return
	}, [
		currentUrl,
		simulationUrl,
		dispatch,
		dottedNameParamName,
		config,
		searchParams,
		setSearchParams,
		urlSituationIsExtracted,
	])

	// Cleanup:
	useEffect(() => {
		return () => {
			setUrlSituationIsExtracted(false)
		}
	}, [])
}

export const useParamsFromSituation = (situation: Situation) => {
	const engine = useEngine()
	const dottedNameParamName = useMemo(
		() => getRulesParamNames(engine.getParsedRules()),
		[engine]
	)
	return getSearchParamsFromSituation(engine, situation, dottedNameParamName)
}

const objectifsOfConfig = (config: Partial<SimulationConfig>) =>
	(config.objectifs ?? ([] as Objectifs)).flatMap((objectifOrSection) => {
		if (typeof objectifOrSection === 'string') {
			return [objectifOrSection]
		}
		return objectifOrSection.objectifs
	})

export const cleanSearchParams = (
	searchParams: ReturnType<typeof useSearchParams>[0],
	setSearchParams: ReturnType<typeof useSearchParams>[1],
	dottedNameParamName: [DottedName, ParamName][],
	dottedNames: DottedName[]
) => {
	const dottedNameParamNameMapping = Object.fromEntries(dottedNameParamName)
	dottedNames.forEach((dottedName) =>
		searchParams.delete(dottedNameParamNameMapping[dottedName])
	)
	setSearchParams(searchParams.toString(), { replace: true })
}

export const getRulesParamNames = (
	parsedRules: ParsedRules<DottedName>
): [DottedName, ParamName][] =>
	(
		Object.entries(parsedRules) as [
			DottedName,
			{ rawNode: { 'identifiant court'?: ShortName } }
		][]
	).map(([dottedName, ruleNode]) => [
		dottedName,
		ruleNode.rawNode['identifiant court'] || dottedName,
	])

export function getSearchParamsFromSituation(
	engine: Engine,
	situation: Situation,
	dottedNameParamName: [DottedName, ParamName][]
): URLSearchParams {
	const searchParams = new URLSearchParams()
	const dottedNameParamNameMapping = Object.fromEntries(dottedNameParamName)
	;(Object.entries(situation) as [DottedName, any][]).forEach(
		([dottedName, value]) => {
			const paramName = dottedNameParamNameMapping[dottedName]
			//Do not store in searchParams variable values that are injected by the simulator
			try {
				if (engine.getRule(dottedName).rawNode.injecté) return
			} catch (e) {}
			const serializedValue = serializeEvaluation(engine.evaluate(value))
			if (typeof serializedValue !== 'undefined')
				searchParams.set(paramName, serializedValue)
		}
	)
	searchParams.sort()
	return searchParams
}

export function getSituationFromSearchParams(
	searchParams: URLSearchParams,
	dottedNameParamName: [DottedName, ParamName][]
) {
	const situation: { [key in DottedName]?: string } = {}

	const paramNameDottedName = dottedNameParamName.reduce(
		(dottedNameBySearchParamName, [dottedName, paramName]) => ({
			...dottedNameBySearchParamName,
			[paramName]: dottedName,
		}),
		{} as Record<ParamName, DottedName>
	)

	searchParams.forEach((value, paramName) => {
		if (Object.prototype.hasOwnProperty.call(paramNameDottedName, paramName)) {
			situation[paramNameDottedName[paramName]] = value
		}
	})

	return situation
}
