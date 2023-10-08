export const setSimulationConfig =
	(config: Object, url: string): ThunkResult<void> =>
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

export const updateSituation = (fieldName: DottedName, value: unknown) =>
	({
		type: 'UPDATE_SITUATION',
		fieldName,
		value,
	} as const)

export const batchUpdateSituation = (
	situation: NonNullable<Parameters<Engine<DottedName>['setSituation']>[0]>,
	doNotFold: Boolean
) =>
	({
		type: 'BATCH_UPDATE_SITUATION',
		situation,
		doNotFold,
	} as const)
