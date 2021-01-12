import 'core-js/stable'
import { render } from 'react-dom'
import App from './App'
import i18n from '../../locales/i18n'

i18n.changeLanguage('fr')

let anchor = document.querySelector('#js')

render(<App />, anchor)
