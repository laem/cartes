'use client'

import reducers from '@/app/reducers'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

export default function ReduxProvider({ children }: PropsWithChildren) {
	const store = createStore(reducers)
	return <Provider store={store}>{children}</Provider>
}
