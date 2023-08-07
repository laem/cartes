'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { PropsWithChildren } from 'react'
import ReduxProvider from './ReduxProvider'

type P = PropsWithChildren

export default function Providers({ children }: P) {
	return (
		// you can have multiple client side providers wrapped, in this case I am also using NextUIProvider
		<>
			<ReduxProvider>{children}</ReduxProvider>
		</>
	)
}
