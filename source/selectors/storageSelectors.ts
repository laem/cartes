import { RootState, Simulation } from 'Reducers/rootReducer'
import { DottedName } from 'Rules'

// Note: it is currently not possible to define SavedSimulation as the return
// type of the currentSimulationSelector function because the type would then
// circulary reference itself.
export type SavedSimulation = {
	situation: Simulation['situation']
	foldedSteps: Array<DottedName> | undefined
	actionChoices: Object
}

export const currentSimulationSelector = (
	state: RootState
): SavedSimulation => {
	return {
		situation: state.simulation?.situation ?? {},
		foldedSteps: state.simulation?.foldedSteps,
		actionChoices: state.actionChoices,
	}
}

export const createStateFromSavedSimulation = (
	state: RootState
): Partial<RootState> =>
	state.previousSimulation
		? {
				simulation: {
					...state.simulation,
					situation: state.previousSimulation.situation || {},
					foldedSteps: state.previousSimulation.foldedSteps,
				} as Simulation,
				previousSimulation: null,
		  }
		: {}
