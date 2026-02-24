import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import N8nForPMs from './N8nForPMs.tsx'

// Console easter egg
const ASCII_ART = `\n ███████╗ █████╗ ███╗   ██╗████████╗██╗███████╗███████╗██████╗ \n ██╔════╝██╔══██╗████╗  ██║╚══██╔══╝██║██╔════╝██╔════╝██╔══██╗\n ███████╗███████║██╔██╗ ██║   ██║   ██║█████╗  █████╗  ██████╔╝\n ╚════██║██╔══██║██║╚██╗██║   ██║   ██║██╔══╝  ██╔══╝  ██╔══██╗\n ███████║██║  ██║██║ ╚████║   ██║   ██║██║     ███████╗██║  ██║\n ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝\n`
console.log(`%c${ASCII_ART}`, 'color: #f97316; font-size: 12px; font-family: monospace;')
console.log('%c Most people scroll. You inspect. I like that. ', 'background: #f97316; color: #1a1a1a; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 3px;')
console.log('%cThe %cbest %cwork %cis %cinvisible.', 'color: #94a3b8; font-size: 13px;', 'color: #7e8d9d; font-size: 13px;', 'color: #687882; font-size: 13px;', 'color: #526268; font-size: 13px;', 'color: #3d4d52; font-size: 13px;')
console.log('%cYou just found some of it.', 'color: #94a3b8; font-size: 13px;')
console.log('%c I build the details. Let\'s solve something hard → hi@santifer.io ', 'background: #f97316; color: #1a1a1a; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 3px;')

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/en" element={<App />} />
        <Route path="/n8n-for-pms" element={<N8nForPMs />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

// Hydrate if pre-rendered content exists, createRoot for dev mode
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
