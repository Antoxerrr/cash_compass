import { useState, useMemo, useCallback } from 'react'
import { load, save, loadTodayLog, saveTodayLog } from '../utils/storage'
import { getDaysUntilPayday, getDailyBudget } from '../utils/calculations'

function createLogEntry(type, amount, balanceAfter) {
  return {
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    type,
    amount,
    balanceAfter,
  }
}

export function useFinance() {
  const [data, setData] = useState(load)
  const [todayLog, setTodayLog] = useState(loadTodayLog)

  const todayNet = useMemo(
    () => todayLog.reduce((sum, e) => e.type === 'adjust' ? sum + e.amount : sum, 0),
    [todayLog]
  )

  const daysUntilPayday = useMemo(
    () => getDaysUntilPayday(data.paydays),
    [data.paydays]
  )

  // Anchor: daily budget from "clean" balance (without today's adjustments)
  const cleanBalance = data.balance - todayNet
  const anchor = useMemo(
    () => getDailyBudget(cleanBalance, daysUntilPayday),
    [cleanBalance, daysUntilPayday]
  )

  // Actual: what's left of today's budget after transactions
  const todayRemaining = anchor + todayNet

  const adjustBalance = useCallback((amount) => {
    const current = load()
    const nextBalance = current.balance + amount
    const nextData = { ...current, balance: nextBalance }
    save(nextData)
    setData(nextData)

    const entry = createLogEntry('adjust', amount, nextBalance)
    const nextLog = [entry, ...loadTodayLog()]
    saveTodayLog(nextLog)
    setTodayLog(nextLog)
  }, [])

  const adjustBalanceSilent = useCallback((amount) => {
    const current = load()
    const nextData = { ...current, balance: current.balance + amount }
    save(nextData)
    setData(nextData)
  }, [])

  const setPaydays = useCallback((paydays) => {
    const current = load()
    const nextData = { ...current, paydays }
    save(nextData)
    setData(nextData)
  }, [])

  const setBalance = useCallback((balance) => {
    const current = load()
    const nextData = { ...current, balance }
    save(nextData)
    setData(nextData)

    const entry = createLogEntry('set', balance, balance)
    const nextLog = [entry, ...loadTodayLog()]
    saveTodayLog(nextLog)
    setTodayLog(nextLog)
  }, [])

  return {
    balance: data.balance,
    paydays: data.paydays,
    daysUntilPayday,
    anchor,
    todayRemaining,
    todayNet,
    todayLog,
    adjustBalance,
    adjustBalanceSilent,
    setPaydays,
    setBalance,
  }
}
