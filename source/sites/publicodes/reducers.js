let initialState = {
	scenario: { quota: 500, warming: '1.5' },
	items: []
}

let reducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SCENARIO':
			return {
				...state,
				scenario: action.scenario
			}
		case 'SET_ITEMS':
			return {
				...state,
				items: action.items
			}
		default:
			throw new Error('Unexpected action')
	}
}
export { initialState, reducer }
