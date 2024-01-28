import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { MonopolyEngine } from './rest'
import { Tlog, Tplayer, TstateStorage } from './types'

export const useScenePlay = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSearchParams] = useSearchParams()
  const stateRef = useRef<TstateStorage | null>()

  const [data, setData] = useState<{
    player: Tplayer
    players: Tplayer[]
    logs: Tlog[]
  }>({ player: { id: '', name: '', balance: 0 }, players: [], logs: [] })

  // payments
  const paymentAmountRef = useRef(0)
  const paymentTargetRef = useRef('')

  const [paymentMode, setPaymentMode] = useState<
    'none' | 'frombank' | 'tobank' | 'toplayer'
  >('none')

  const optionPaymentPlayer: Array<{ value: string; label: string }> = useMemo(
    () => data.players.map(e => ({ value: e.id, label: e.name })),
    [data.players],
  )

  useEffect(() => {
    // server sent event
    sseInit()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sseInit = async () => {
    const sse = await MonopolyEngine.SSE()
    sse.onmessage = () => {
      fetchState()
    }
  }

  const fetchState = async () => {
    stateRef.current = await MonopolyEngine.getState()

    const resp = await MonopolyEngine.getRoomState()
    setData(prev => ({
      ...prev,
      player: resp.player,
      players: resp.players,
      logs: resp.logs,
    }))
  }

  const setPaymentTarget = (targetID: string) => {
    paymentTargetRef.current = targetID
  }

  const setPaymentAmount = (amount: number) => {
    paymentAmountRef.current = amount
  }

  const handlePayment = async () => {
    const args = {
      amount: paymentAmountRef.current,
      targetPlayerID: '',
      type: '' as 'pay' | 'ask',
    }

    switch (paymentMode) {
      case 'tobank':
        args.targetPlayerID = ''
        args.type = 'pay'
        break

      case 'frombank':
        args.targetPlayerID = ''
        args.type = 'ask'
        break

      case 'toplayer':
        args.targetPlayerID = paymentTargetRef.current
        args.type = 'pay'
        break
    }

    await MonopolyEngine.createTransaction(args)
    setPaymentMode('none')
  }

  const handleLeaveRoom = () => {
    setSearchParams(prev => ({ ...prev, scene: 'init' }))
    MonopolyEngine.leaveRoom()
  }

  return {
    roomID: stateRef.current?.roomID || '',
    roomPass: stateRef.current?.roomPass || '',
    player: data.player,
    players: data.players,
    logs: data.logs,

    optionPaymentPlayer,
    paymentMode: paymentMode,
    setPaymentMode,
    setPaymentTarget,
    setPaymentAmount,
    handlePayment,

    handleLeaveRoom,
  }
}
