import { useState } from 'react'

const QUICK_AMOUNTS = [1, 10, 50, 500]
const MODES = { adjust: 'Изменить', past: 'Коррекция', set: 'Установить' }

export default function Dashboard({ finance, onOpenSettings }) {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('adjust')

  const addToInput = (value) => {
    setInput((prev) => {
      const current = parseFloat(prev) || 0
      return String(current + value)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(input)
    if (isNaN(num) || num === 0) return

    if (mode === 'set') {
      finance.setBalance(num)
    } else if (mode === 'past') {
      finance.adjustBalanceSilent(num)
    } else {
      finance.adjustBalance(num)
    }
    setInput('')
  }

  const configured = finance.paydays.length > 0
  const hasTransactions = finance.todayNet !== 0

  return (
    <div className="dashboard">
      <button className="settings-btn" onClick={onOpenSettings} aria-label="Настройки">
        ⚙
      </button>

      {!configured ? (
        <div className="setup-prompt">
          <p className="setup-text">Укажите дни зарплаты в настройках</p>
          <button className="setup-btn" onClick={onOpenSettings}>
            Настроить
          </button>
        </div>
      ) : (
        <>
          <div className="budget-display">
            <div className="budget-label">Можно потратить сегодня</div>
            <div className="budget-main">
              {hasTransactions ? (
                <>
                  <span className={`budget-actual ${finance.todayRemaining < 0 ? 'negative' : ''}`}>
                    {finance.todayRemaining.toLocaleString('ru-RU')}
                  </span>
                  <span className="budget-separator">/</span>
                  <span className="budget-anchor">
                    {finance.anchor.toLocaleString('ru-RU')}
                  </span>
                  <span className="budget-currency"> ₽</span>
                </>
              ) : (
                <span className={`budget-actual ${finance.anchor < 0 ? 'negative' : ''}`}>
                  {finance.anchor.toLocaleString('ru-RU')} ₽
                </span>
              )}
            </div>
            <div className="budget-details">
              <span>Завтра: ~{finance.tomorrow.toLocaleString('ru-RU')} ₽</span>
              <span>Баланс: {finance.balance.toLocaleString('ru-RU')} ₽</span>
              <span>До ЗП: {finance.daysUntilPayday} дн.</span>
            </div>
          </div>

          <div className="mode-toggle">
            {Object.entries(MODES).map(([key, label]) => (
              <button
                key={key}
                className={`mode-btn ${mode === key ? 'active' : ''}`}
                onClick={() => { setMode(key); setInput('') }}
              >
                {label}
              </button>
            ))}
          </div>

          <form className="input-section" onSubmit={handleSubmit}>
            <input
              type="text"
              className="amount-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'set' ? 'Новый баланс' : 'Сумма'}
            />
            <button type="submit" className="apply-btn" disabled={!input}>
              {MODES[mode]}
            </button>
          </form>

          {(mode === 'adjust' || mode === 'past') && (
            <div className="quick-buttons">
              <div className="quick-row">
                {QUICK_AMOUNTS.map((a) => (
                  <button key={`+${a}`} className="quick-btn plus" onClick={() => addToInput(a)}>
                    +{a.toLocaleString('ru-RU')}
                  </button>
                ))}
              </div>
              <div className="quick-row">
                {QUICK_AMOUNTS.map((a) => (
                  <button key={`-${a}`} className="quick-btn minus" onClick={() => addToInput(-a)}>
                    −{a.toLocaleString('ru-RU')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {finance.todayLog.length > 0 && (
            <div className="today-log">
              <div className="log-header">Сегодня</div>
              <div className="log-entries">
                {finance.todayLog.map((entry, i) => (
                  <div key={i} className="log-entry">
                    <span className="log-time">{entry.time}</span>
                    <span className={`log-amount ${entry.type === 'set' ? 'set' : entry.amount >= 0 ? 'plus' : 'minus'}`}>
                      {entry.type === 'set'
                        ? `= ${entry.amount.toLocaleString('ru-RU')}`
                        : `${entry.amount >= 0 ? '+' : '−'}${Math.abs(entry.amount).toLocaleString('ru-RU')}`
                      }
                    </span>
                    <span className="log-balance">{entry.balanceAfter.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}