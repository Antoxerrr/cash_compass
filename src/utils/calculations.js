export function getDaysUntilPayday(paydays) {
  if (!paydays.length) return null

  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  let minDays = Infinity

  for (const payday of paydays) {
    let target = new Date(currentYear, currentMonth, payday)

    // If payday is today or already passed this month, look at next month
    if (target <= today) {
      target = new Date(currentYear, currentMonth + 1, payday)
    }

    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
    if (diff < minDays) {
      minDays = diff
    }
  }

  return minDays
}

export function getDailyBudget(balance, daysUntilPayday) {
  if (!daysUntilPayday || daysUntilPayday <= 0) return balance
  return Math.floor(balance / daysUntilPayday)
}
