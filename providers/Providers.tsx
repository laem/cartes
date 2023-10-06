import { ThemeColorsProvider } from '@/components/utils/colors'
import { PropsWithChildren } from 'react'
import PublicodesProvider from './PublicodesContext'
import ReduxProvider from './ReduxProvider'

type P = PropsWithChildren

export default function Providers({ children }: P) {
	return (
		// you can have multiple client side providers wrapped, in this case I am also using NextUIProvider
		<ReduxProvider>
			<ThemeColorsProvider>
				<PublicodesProvider>{children}</PublicodesProvider>
			</ThemeColorsProvider>
		</ReduxProvider>
	)
}
