let initialState = {
	scenario: 'C',
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
		case 'ADD_ITEMS':
			return {
				...state,
				items: [...state.items, ...action.items]
			}
		default:
			throw new Error('Unexpected action')
	}
}
export { initialState, reducer }
