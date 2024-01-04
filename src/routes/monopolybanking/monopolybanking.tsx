import Cookie from 'js-cookie'
import moment from 'moment'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { When } from 'react-if'
import Select from 'react-select'

import { numberWithCommas } from '../../tools/format'
import { generateRandomString } from '../../tools/random'
import { mockData } from './mock'
import styles from './monopolybanking.module.scss'
import { keyDeviceID, Tlog, Tplayer } from './types'

export default function MonopolyBankingSystemPageBody(): JSX.Element {
  const [scene, setScene] = useState<Tscene>('play')

  useEffect(() => {
    document.title = 'Monopoly Banking System'

    // set device id for monopoly banking identity
    gettingDeviceID()
  }, [])

  const handleBack = () => setScene('init')
  const handlePlay = () => setScene('play')

  switch (scene) {
    case 'init':
      return <SceneInit onChangeScene={setScene} />
    case 'create':
      return <SceneCreateRoom onBack={handleBack} onPlay={handlePlay} />
    case 'join':
      return <SceneJoinRoom onBack={handleBack} onPlay={handlePlay} />
    case 'play':
      return <ScenePlay />
  }
}

/* getting device id if exist, otherwise create it */
function gettingDeviceID(): string {
  let deviceID = Cookie.get(keyDeviceID)

  // if not found, then set it
  if (!deviceID) {
    deviceID = generateRandomString(10)
    Cookie.set(keyDeviceID, deviceID)
  }

  return deviceID
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
  onBack: () => void
  onPlay: () => void
}> = props => {
  const [data, setData] = useState<{
    initBalance: number
    player: TnewPlayer
  }>({
    initBalance: 0,
    player: { id: gettingDeviceID(), name: '' },
  })

  useEffect(() => {
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => ''

    // Unmount the window.onbeforeunload event
    return () => {
      window.onbeforeunload = null
    }
  }, [])

  const handleBack = props.onBack

  const handleChangePlayer = (name: string) => {
    setData(prev => ({ ...prev, player: { ...prev.player, name } }))
  }

  const handleChangeInitialBalance = (balance: number) => {
    setData(prev => ({ ...prev, initBalance: balance }))
  }

  const handlePlay = () => {
    const body = {
      initial_balance: data.initBalance,
      players: data.player,
    }

    console.log(body)
    props.onPlay()
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
          value={data.player.name}
          onChange={e => handleChangePlayer(e.target.value)}
        />
      </div>
      <button className="w-full" onClick={handlePlay}>
        Play
      </button>
    </div>
  )
}

const SceneJoinRoom: FC<{ onBack: () => void; onPlay: () => void }> = props => {
  const handleBack = props.onBack

  const dataRef = useRef<{ name: string; pass: string }>({ name: '', pass: '' })

  useEffect(() => {
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => ''

    // Unmount the window.onbeforeunload event
    return () => {
      window.onbeforeunload = null
    }
  }, [])

  const handleJoin = () => {
    const body = {
      player_id: gettingDeviceID(),
      name: dataRef.current.name,
      pass: dataRef.current.pass,
    }

    console.log(body)
    props.onPlay()
  }

  const handleChange = (key: 'id' | 'pass', value: string) => {
    switch (key) {
      case 'id':
        dataRef.current.name = value
        break
      case 'pass':
        dataRef.current.pass = value
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
          placeholder="Room ID"
          className="p-2"
          onChange={e => handleChange('id', e.target.value)}
        />
        <input
          placeholder="Pass"
          className="p-2"
          onChange={e => handleChange('pass', e.target.value)}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  )
}

const ScenePlay: FC = () => {
  const [data] = useState<{
    player: Tplayer
    players: Tplayer[]
    logs: Tlog[]
  }>(mockData)

  useEffect(() => {
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => ''

    // Unmount the window.onbeforeunload event
    return () => {
      window.onbeforeunload = null
    }
  }, [])

  const [paymentMode, setPaymentMode] = useState<
    'none' | 'frombank' | 'tobank' | 'player'
  >('none')

  const optionPaymentPlayer: Array<{ value: string; label: string }> = useMemo(
    () => data.players.map(e => ({ value: e.id, label: e.name })),
    [data.players],
  )

  return (
    <div className={styles.page}>
      <div className="text-center text-xl font-bold mb-1">
        Monopoly Banking System
      </div>
      <div className="text-xs text-center mb-8">
        Room ID: 12345 <br />
        Pass: abcde
      </div>
      <div className="flex justify-between my-5">
        <div>{data.player.name}</div>
        <div>{numberWithCommas(data.player.balance)}</div>
      </div>
      <div className="my-5">
        <div className="font-bold text-lg mb-1">Opponents</div>
        {data.players.map(player => (
          <div
            key={player.id}
            className="flex justify-between odd:bg-slate-700"
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
            onClick={() => setPaymentMode('player')}
          >
            Pay to Player
          </button>
        </div>
        <When condition={paymentMode !== 'none'}>
          <div className="grid gap-y-2">
            <div hidden={paymentMode !== 'player'}>
              <Select
                isSearchable={false}
                placeholder="Select player"
                options={optionPaymentPlayer}
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
            <input placeholder="amount" type="number" className="p-2" />
            <div className="grid grid-cols-2 gap-x-2">
              <button>Submit</button>
              <button onClick={() => setPaymentMode('none')}>Cancel</button>
            </div>
          </div>
        </When>
      </div>
      <div className="mt-5 w-full">
        <div className="font-bold text-lg mb-1">Logs</div>
        <div className="h-[200px] overflow-y-scroll">
          {data.logs.map((log, i) => (
            <div key={i} className="mb-2 odd:bg-slate-700">
              <div className="text-xs">
                {moment(log.dateTime).format('yyyy-mm-DD HH:MM:SS')}
              </div>
              <div>{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type Tscene = 'init' | 'create' | 'join' | 'play'

type TnewPlayer = Pick<Tplayer, 'id' | 'name'>
