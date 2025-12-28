import { Sparkles, CheckCircle } from 'lucide-react'
import './App.css'

function App() {
  return (
    <div className="popup-container">
      <header>
        <Sparkles className="logo-icon" size={24} />
        <h1>xCard</h1>
      </header>
      <main>
        <p>Your X.com extension is active!</p>
        <ul className="features">
          <li><CheckCircle size={16} /> Button injected on every tweet</li>
          <li><CheckCircle size={16} /> Custom backgrounds & padding</li>
          <li><CheckCircle size={16} /> Dark mode support</li>
          <li><CheckCircle size={16} /> One-click PNG export</li>
        </ul>
        <div className="status-badge">Ready to go</div>
      </main>
      <footer>
        Go to X.com to start creating cards.
      </footer>
    </div>
  )
}

export default App
