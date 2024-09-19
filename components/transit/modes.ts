export const decodeStepModeParams = (searchParams) => {
	try {
		const { debut, fin } = searchParams
		const [modeStart, timeStartRaw] = debut.split('-')
		const timeStart = timeStartRaw.split('min')[0]
		const [modeEnd, timeEndRaw] = fin.split('-')
		const timeEnd = timeEndRaw.split('min')[0]
		return {
			start: { time: timeStart, mode: modeStart },
			end: { time: timeEnd, mode: modeEnd },
		}
	} catch (e) {
		console.error('Error decoding start mode, start time, or end...', e)
	}
}
