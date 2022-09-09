import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import App from './App'

const anchor = document.querySelector('#js')
const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
