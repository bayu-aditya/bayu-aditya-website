import { lazy } from 'react'

export const RootPage = lazy(() => import('./routes/root'))
export const TimerPage = lazy(() => import('./routes/timer/timer'))
export const MonopolyBankingPage = lazy(
  () => import('./routes/monopolybanking/monopolybanking'),
)
