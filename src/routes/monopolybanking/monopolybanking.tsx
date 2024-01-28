import moment from 'moment'
import { FC, useEffect, useRef, useState } from 'react'
import { MdOutlineLogout } from 'react-icons/md'
import { When } from 'react-if'
import { useSearchParams } from 'react-router-dom'
import Select from 'react-select'

import { numberWithCommas } from '../../tools/format'
import { useScenePlay } from './hooks'
import styles from './monopolybanking.module.scss'
import { MonopolyEngine } from './rest'
import { Tscene } from './types'

export default function MonopolyBankingSystemPageBody(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams()

  const scene = searchParams.get('scene')

  useEffect(() => {
    document.title = 'Monopoly Banking System'

    // set device id for monopoly banking identity
    MonopolyEngine.getDeviceID()
  }, [])

  const handleChangeScene = (scene: string) => {
    setSearchParams(prev => ({ ...prev, scene }))
  }

  switch (scene) {
    case 'create':
      return <SceneCreateRoom onChangeScene={handleChangeScene} />
    case 'join':
      return <SceneJoinRoom onChangeScene={handleChangeScene} />
    case 'play':
      return <ScenePlay />
    default:
      return <SceneInit onChangeScene={handleChangeScene} />
  }
}

const SceneInit: FC<{ onChangeScene: (scene: Tscene) => void }> = props => {
  const handleChangeScene = props.onChangeScene

  return (
    <div className={styles.page}>
      <div className={styles.title}>Monopoly Banking System</div>
      <div className="flex justify-center gap-3">
        <button onClick={() => handleChangeScene('create')}>Create Room</button>
        <button onClick={() => handleChangeScene('join')}>Join Room</button>
      </div>
    </div>
  )
}

const SceneCreateRoom: FC<{
  onChangeScene: (scene: Tscene) => void
}> = props => {
  const [data, setData] = useState<{
    initBalance: number
    playerName: string
  }>({
    initBalance: 0,
    playerName: '',
  })

  useEffect(preventReload, [])

  const handleBack = () => props.onChangeScene('init')

  const handleChangePlayer = (name: string) => {
    setData(prev => ({ ...prev, playerName: name }))
  }

  const handleChangeInitialBalance = (balance: number) => {
    setData(prev => ({ ...prev, initBalance: balance }))
  }

  const handlePlay = async () => {
    await MonopolyEngine.createRoom(data)
    props.onChangeScene('play')
  }

  return (
    <div className={styles.page}>
      <div className={styles.appbar}>
        <button onClick={handleBack}>Back</button>
      </div>
      <div className={styles.title}>Create Room</div>
      <div className="my-4">
        <div>Initial Amount</div>
        <input
          placeholder="inital amount"
          className="w-full p-2"
          type="number"
          onChange={e => handleChangeInitialBalance(Number(e.target.value))}
        />
      </div>
      <div className="my-4">
        <div>Player</div>
        <input
          autoFocus
          placeholder="Name"
          className="w-full p-2"
          value={data.playerName}
          onChange={e => handleChangePlayer(e.target.value)}
        />
      </div>
      <button className="w-full" onClick={handlePlay}>
        Play
      </button>
    </div>
  )
}

const SceneJoinRoom: FC<{ onChangeScene: (scene: Tscene) => void }> = props => {
  const dataRef = useRef<{
    playerName: string
    roomID: string
    roomPass: string
  }>({ playerName: '', roomID: '', roomPass: '' })

  useEffect(preventReload, [])

  const handleJoin = async () => {
    await MonopolyEngine.joinRoom(dataRef.current)
    props.onChangeScene('play')
  }

  const handleBack = () => props.onChangeScene('init')

  const handleChange = (
    key: 'playername' | 'roomid' | 'roompass',
    value: string,
  ) => {
    switch (key) {
      case 'playername':
        dataRef.current.playerName = value
        break
      case 'roomid':
        dataRef.current.roomID = value
        break
      case 'roompass':
        dataRef.current.roomPass = value
        break
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.appbar}>
        <button onClick={handleBack}>Back</button>
      </div>
      <div className="grid gap-y-3">
        <div className={styles.title}>Join Room</div>
        <input
          placeholder="Player Name"
          className="p-2"
          onChange={e => handleChange('playername', e.target.value)}
        />
        <input
          placeholder="Room ID"
          className="p-2"
          onChange={e => handleChange('roomid', e.target.value)}
        />
        <input
          placeholder="Room Pass"
          className="p-2"
          onChange={e => handleChange('roompass', e.target.value)}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  )
}

const ScenePlay: FC = () => {
  const {
    roomID,
    roomPass,
    player,
    players,
    logs,

    optionPaymentPlayer,
    paymentMode,
    setPaymentMode,
    setPaymentTarget,
    setPaymentAmount,
    handlePayment,

    handleLeaveRoom,
  } = useScenePlay()

  useEffect(preventReload, [])

  return (
    <div className={styles.page}>
      <div className="text-center text-lg font-bold mb-1">
        Monopoly Banking System
      </div>
      <div className="text-xs text-center mb-8">
        Room ID: {roomID} <br />
        Pass: {roomPass}
      </div>
      <button
        className="absolute top-2 right-1 p-[10px]"
        onClick={handleLeaveRoom}
      >
        <MdOutlineLogout />
      </button>
      <div className="flex justify-between my-5">
        <div>{player.name}</div>
        <div>{numberWithCommas(player.balance)}</div>
      </div>
      <div className="my-5">
        <div className="font-bold text-lg mb-1">Opponents</div>
        {players.map(player => (
          <div
            key={player.id}
            className="flex justify-between px-2 py-1 even:bg-slate-700"
          >
            <div>{player.name}</div>
            <div>{numberWithCommas(player.balance)}</div>
          </div>
        ))}
      </div>
      <div className="my-5">
        <div className="font-bold text-lg mb-1">Payments</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            hidden={paymentMode !== 'none'}
            onClick={() => setPaymentMode('frombank')}
          >
            Ask from Bank
          </button>
          <button
            hidden={paymentMode !== 'none'}
            onClick={() => setPaymentMode('tobank')}
          >
            Pay to Bank
          </button>
          <button
            className="w-full col-span-2"
            hidden={paymentMode !== 'none'}
            onClick={() => setPaymentMode('toplayer')}
          >
            Pay to Player
          </button>
        </div>
        <When condition={paymentMode !== 'none'}>
          <div className="grid gap-y-2">
            <div hidden={paymentMode !== 'toplayer'}>
              <Select
                isSearchable={false}
                placeholder="Select player"
                options={optionPaymentPlayer}
                onChange={val => setPaymentTarget(val?.value || '')}
                styles={{
                  control: provided => ({
                    ...provided,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: '#3B3B3B',
                    color: '#000000',
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    cursor: 'pointer',
                    backgroundColor: state.isFocused ? 'white' : '#3B3B3B',
                    color: state.isFocused ? 'black' : 'white',
                  }),
                  input: provided => ({
                    ...provided,
                    color: 'white',
                  }),
                  singleValue: provided => ({
                    ...provided,
                    color: 'white',
                  }),
                  menu: provided => ({
                    ...provided,
                    backgroundColor: '#3B3B3B',
                  }),
                }}
              />
            </div>
            <input
              placeholder="amount"
              type="number"
              className="p-2"
              onChange={e => setPaymentAmount(Number(e.target.value))}
            />
            <div className="grid grid-cols-2 gap-x-2">
              <button onClick={handlePayment}>Submit</button>
              <button onClick={() => setPaymentMode('none')}>Cancel</button>
            </div>
          </div>
        </When>
      </div>
      <div className="mt-5 w-full">
        <div className="font-bold text-lg mb-1">Logs</div>
        <div className="h-[350px] overflow-y-scroll">
          {logs.map((log, i) => (
            <div key={i} className="mb-2 px-2 py-1 odd:bg-slate-700">
              <div className="text-xs">
                {moment(log.datetime, true).format('HH:mm:ss')}
              </div>
              <div>{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const preventReload = () => {
  // Prompt confirmation when reload page is triggered
  window.onbeforeunload = () => ''

  // Unmount the window.onbeforeunload event
  return () => {
    window.onbeforeunload = null
  }
}
