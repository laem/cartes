'use client'

import reducers from '@/app/reducers'
import { PropsWithChildren, useMemo } from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

const composeEnhancers =
	(typeof window !== 'undefined' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
	compose

export default function ReduxProvider({ children }: PropsWithChildren) {
	const store = useMemo(() => {
		const storeEnhancer = applyMiddleware(thunk)
		return createStore(reducers, {}, composeEnhancers(storeEnhancer))
	}, [])

	return <Provider store={store}>{children}</Provider>
}
