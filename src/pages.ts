import { lazy } from 'react'

const TimerPage = lazy(() => import('./routes/timer/timer'))
const MonopolyBankingPage = lazy(
  () => import('./routes/monopolybanking/monopolybanking'),
)

export { MonopolyBankingPage, TimerPage }
