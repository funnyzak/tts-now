import { createRoot } from 'react-dom/client'

import App from './App'

// 引入normalize.css
import 'normalize.css'

// 引入antd样式
import 'antd/dist/reset.css'

import './App.css'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<App />)
