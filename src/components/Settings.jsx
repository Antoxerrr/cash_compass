import { useState } from 'react'

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export default function Settings({ finance, onClose }) {
  const [balance, setBalance] = useState(String(finance.balance))
  const [confirmReset, setConfirmReset] = useState(false)

  const togglePayday = (day) => {
    const current = finance.paydays
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort((a, b) => a - b)
    finance.setPaydays(next)
  }

  const handleBalanceSubmit = (e) => {
    e.preventDefault()
    const num = parseFloat(balance)
    if (!isNaN(num)) finance.setBalance(num)
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>Настройки</h2>
        <button className="back-btn" onClick={onClose}>
          ← Назад
        </button>
      </div>

      <section className="settings-section">
        <h3>Дни зарплаты</h3>
        <p className="settings-hint">Выберите числа месяца</p>
        <div className="days-grid">
          {DAYS.map((day) => (
            <button
              key={day}
              className={`day-btn ${finance.paydays.includes(day) ? 'active' : ''}`}
              onClick={() => togglePayday(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h3>Текущий баланс</h3>
        <form className="balance-form" onSubmit={handleBalanceSubmit}>
          <input
            type="number"
            className="amount-input"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            inputMode="numeric"
          />
          <button type="submit" className="apply-btn">
            Установить
          </button>
        </form>
      </section>

      <section className="settings-section reset-section">
        {!confirmReset ? (
          <button className="reset-btn" onClick={() => setConfirmReset(true)}>
            Сбросить все данные
          </button>
        ) : (
          <div className="reset-confirm">
            <p className="reset-warning">Все данные будут удалены. Точно?</p>
            <div className="reset-actions">
              <button className="reset-btn confirm" onClick={() => { finance.resetAll(); onClose() }}>
                Да, удалить
              </button>
              <button className="reset-btn cancel" onClick={() => setConfirmReset(false)}>
                Отмена
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
