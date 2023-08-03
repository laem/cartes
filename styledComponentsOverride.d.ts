import { CSSProp } from 'styled-components'

interface DefaultTheme {}

declare module 'react' {
	interface HTMLAttributes<T> extends DOMAttributes<T> {
		css?: CSSProp<DefaultTheme>
	}
}
