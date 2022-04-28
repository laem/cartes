import { SitePaths } from 'Components/utils/SitePathsContext'
import { useLocation } from 'react-router'
import { RootState, SimulationConfig } from 'Reducers/rootReducer'
import { ThunkAction } from 'redux-thunk'
import { DottedName } from 'Rules'
import { deletePersistedSimulation } from '../storage/persistSimulation'
import { CompanyStatusAction } from './companyStatusActions'

export type Action =
	| ResetSimulationAction
	| StepAction
	| UpdateAction
	| SetSimulationConfigAction
	| DeletePreviousSimulationAction
	| ExplainVariableAction
	| UpdateSituationAction
	| HideNotificationAction
	| LoadPreviousSimulationAction
	| SetSituationBranchAction
	| UpdateTargetUnitAction
	| SetActiveTargetAction
	| CompanyStatusAction

export type ThunkResult<R = void> = ThunkAction<R, RootState, {}, Action>

type StepAction = {
	type: 'STEP_ACTION'
	name: 'fold' | 'unfold'
	step: DottedName
}

type SetSimulationConfigAction = {
	type: 'SET_SIMULATION'
	url: string
	config: SimulationConfig
	useCompanyDetails: boolean
}

type DeletePreviousSimulationAction = {
	type: 'DELETE_PREVIOUS_SIMULATION'
}

type ResetSimulationAction = ReturnType<typeof resetSimulation>
type UpdateAction = ReturnType<typeof updateSituation>
type UpdateSituationAction = ReturnType<typeof updateSituation>
type LoadPreviousSimulationAction = ReturnType<typeof loadPreviousSimulation>
type SetSituationBranchAction = ReturnType<typeof setSituationBranch>
type SetActiveTargetAction = ReturnType<typeof setActiveTarget>
type HideNotificationAction = ReturnType<typeof hideNotification>
type ExplainVariableAction = ReturnType<typeof explainVariable>
type UpdateTargetUnitAction = ReturnType<typeof updateUnit>

export const resetSimulation = () =>
	({
		type: 'RESET_SIMULATION',
	} as const)
export const resetActionChoices = () =>
	({
		type: 'RESET_ACTION_CHOICES',
	} as const)
export const resetTutorials = () =>
	({
		type: 'RESET_TUTORIALS',
	} as const)

export const goToQuestion = (question: DottedName) =>
	({
		type: 'STEP_ACTION',
		name: 'unfold',
		step: question,
	} as const)

export const validateStepWithValue =
	(dottedName: DottedName, value: unknown): ThunkResult<void> =>
	(dispatch) => {
		dispatch(updateSituation(dottedName, value))
		dispatch({
			type: 'STEP_ACTION',
			name: 'fold',
			step: dottedName,
		})
	}

export const setSituationBranch = (id: number) =>
	({
		type: 'SET_SITUATION_BRANCH',
		id,
	} as const)

export const setDifferentSituation = ({
	situation,
	config,
	url,
	persona,
	foldedSteps,
}: Object) => ({
	type: 'SET_SIMULATION',
	situation,
	config,
	url,
	persona,
	foldedSteps,
})

export const setSimulationConfig =
	(config: Object, url): ThunkResult<void> =>
	(dispatch, getState): void => {
		const pastSimulationConfig = getState().simulation?.config
		if (pastSimulationConfig === config) {
			return
		}
		dispatch({
			type: 'SET_SIMULATION',
			url,
			config,
		})
	}

export const setActiveTarget = (targetName: DottedName) =>
	({
		type: 'SET_ACTIVE_TARGET_INPUT',
		name: targetName,
	} as const)

export const deletePreviousSimulation = (): ThunkResult<void> => (dispatch) => {
	dispatch({
		type: 'DELETE_PREVIOUS_SIMULATION',
	})
	deletePersistedSimulation()
}

export const updateSituation = (fieldName: DottedName, value: unknown) =>
	({
		type: 'UPDATE_SITUATION',
		fieldName,
		value,
	} as const)

export const batchUpdateSituation = (
	situation: NonNullable<Parameters<Engine<DottedName>['setSituation']>[0]>
) =>
	({
		type: 'BATCH_UPDATE_SITUATION',
		situation,
	} as const)

export const skipTutorial = (id: string) => ({ type: 'SKIP_TUTORIAL', id })

export const updateUnit = (targetUnit: string) =>
	({
		type: 'UPDATE_TARGET_UNIT',
		targetUnit,
	} as const)

export function loadPreviousSimulation() {
	return {
		type: 'LOAD_PREVIOUS_SIMULATION',
	} as const
}

export function hideNotification(id: string) {
	return { type: 'HIDE_NOTIFICATION', id } as const
}

export const explainVariable = (variableName: DottedName | null = null) =>
	({
		type: 'EXPLAIN_VARIABLE',
		variableName,
	} as const)

export const setActionChoice = (action: string, choice: boolean) =>
	({
		type: 'SET_ACTION_CHOICE',
		action,
		choice,
	} as const)
