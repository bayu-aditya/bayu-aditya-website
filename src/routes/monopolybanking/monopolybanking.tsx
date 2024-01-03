import { FC, useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'

import { generateRandomString } from '../../tools/random'
import styles from './monopolybanking.module.scss'
import { Tplayer } from './types'

export default function MonopolyBankingSystemPageBody(): JSX.Element {
  const [scene, setScene] = useState<Tscene>('create')

  useEffect(() => {
    document.title = 'Monopoly Banking System'
  }, [])

  const handleBack = () => setScene('init')

  switch (scene) {
    case 'init':
      return <SceneInit onChangeScene={setScene} />
    case 'create':
      return <SceneCreateRoom onBack={handleBack} />
    case 'join':
      return <SceneJoinRoom onBack={handleBack} />
  }
}

const SceneInit: FC<{ onChangeScene: (scene: Tscene) => void }> = props => {
  const handleChangeScene = props.onChangeScene

  return (
    <div className={styles.page}>
      <div className="flex justify-center gap-3">
        <button onClick={() => handleChangeScene('create')}>Create Room</button>
        <button onClick={() => handleChangeScene('join')}>Join Room</button>
      </div>
    </div>
  )
}

const SceneCreateRoom: FC<{ onBack: () => void }> = () => {
  const [data, setData] = useState<{
    initBalance: number
    players: TnewPlayer[]
  }>({
    initBalance: 0,
    players: [{ id: generateRandomString(idPlayerLength), name: '' }],
  })

  const handleAddPlayer = () => {
    setData(prev => ({
      ...prev,
      players: [
        ...prev.players,
        { id: generateRandomString(idPlayerLength), name: '' },
      ],
    }))
  }

  const handleDeletePlayer = (idx: number) => {
    const newPlayers = [...data.players]
    newPlayers.splice(idx, 1)
    setData(prev => ({ ...prev, players: newPlayers }))
  }

  const handleChangePlayer = (idx: number, name: string) => {
    const newPlayers = [...data.players]
    newPlayers[idx].name = name
    setData(prev => ({ ...prev, players: newPlayers }))
  }

  const handleChangeInitialBalance = (balance: number) => {
    setData(prev => ({ ...prev, initBalance: balance }))
  }

  const handlePlay = () => {
    const body = {
      initial_balance: data.initBalance,
      players: data.players,
    }

    console.log(body)
  }

  const isPlayable = data.players.length >= 2

  return (
    <div className={styles.page}>
      <div className="font-bold text-2xl">Create Room</div>
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
        <div>Players</div>
        {data.players.map((player, i) => (
          <div key={i} className="grid grid-cols-[auto_55px] gap-x-2 my-2">
            <input
              autoFocus
              placeholder="Name"
              className="p-2"
              value={player.name}
              onChange={e => handleChangePlayer(i, e.target.value)}
            />
            <button onClick={() => handleDeletePlayer(i)}>
              <MdDeleteOutline />
            </button>
          </div>
        ))}
      </div>
      <div className="grid gap-y-2">
        <button onClick={handleAddPlayer}>Add</button>
        <button onClick={handlePlay} hidden={!isPlayable}>
          Play
        </button>
      </div>
    </div>
  )
}

const SceneJoinRoom: FC<{ onBack: () => void }> = props => {
  const handleBack = props.onBack

  return (
    <div className={styles.page}>
      <button onClick={handleBack}>Back</button>
      <input />
    </div>
  )
}

type Tscene = 'init' | 'create' | 'join'

type TnewPlayer = Pick<Tplayer, 'id' | 'name'>

const idPlayerLength = 5
