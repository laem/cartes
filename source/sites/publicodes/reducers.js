let initialState = {
	scenario: 'C',
	items: [],
	situation: {}
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
		case 'AMEND_DAY_SITUATION':
			return {
				...state,
				situation: { ...state.situation, situation: action.situation }
			}
		default:
			throw new Error('Unexpected action')
	}
}
export { initialState, reducer }
