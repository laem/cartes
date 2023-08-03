import 'core-js/stable'
import App from './App'
import i18n from '../../locales/i18n'

import { createRoot } from 'react-dom/client'
const anchor = document.querySelector('#js')
const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
i18n.changeLanguage('fr')
root.render(<App />)
