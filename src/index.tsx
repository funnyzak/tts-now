import { createRoot } from 'react-dom/client'

import App from './App'

// 引入normalize.css
import 'normalize.css'

import './App.less'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<App />)
