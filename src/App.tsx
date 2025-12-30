import { CheckCircle } from 'lucide-react'
import logo from './assets/card-light.svg'
import { t } from './content/i18n'
import './App.css'

function App() {
  return (
    <div className="popup-container">
      <header>
        <img src={logo} className="logo-img" alt="logo" />
        <h1>{t('brandName')}</h1>
      </header>
      <main>
        <p>{t('extensionActive')}</p>
        <ul className="features">
          <li><CheckCircle size={16} /> {t('feature1')}</li>
          <li><CheckCircle size={16} /> {t('feature2')}</li>
          <li><CheckCircle size={16} /> {t('feature3')}</li>
          <li><CheckCircle size={16} /> {t('feature4')}</li>
        </ul>
        <div className="status-badge">{t('ready')}</div>
      </main>
      <footer>
        {t('footer')}
      </footer>
    </div>
  )
}

export default App
