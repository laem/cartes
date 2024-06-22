export const updateSituation = (
	fieldName: DottedName,
	value: unknown,
	objectives
) =>
	({
		type: 'UPDATE_SITUATION',
		fieldName,
		value,
		objectives,
	} as const)

export const batchUpdateSituation = (
	situation: NonNullable<Parameters<Engine<DottedName>['setSituation']>[0]>,
	doNotFold: Boolean,
	objectives
) =>
	({
		type: 'BATCH_UPDATE_SITUATION',
		situation,
		doNotFold,
		objectives,
	} as const)
