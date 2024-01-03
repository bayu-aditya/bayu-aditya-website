import clsx from 'clsx'
import { FC, Suspense, useEffect, useRef, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'

import { Timer } from './helper'
import styles from './timer.module.scss'
import { Tdata, TdataStep } from './types'

export default function TimerPageBody(): JSX.Element {
  const dataRef = useRef<Tdata>({ ...emptyData })
  // const dataRef = useRef<Tdata>({
  //   steps: [
  //     { name: 'Orang Pertama', duration: 10 },
  //     { name: 'Orang Kedua', duration: 5 },
  //     { name: 'Orang Ketiga', duration: 3 },
  //     { name: 'Orang Keempat', duration: 4 },
  //   ],
  // })

  const [scene, setScene] = useState<Tscene>('init')

  const handleClickStart = (reqData: Tdata) => {
    dataRef.current = reqData
    setScene('play')
  }

  useEffect(() => {
    document.title = 'Timer'
  }, [])

  const body = () => {
    switch (scene) {
      case 'init':
        return <SceneInit onStart={handleClickStart} />
      case 'play':
        return <ScenePlay data={dataRef.current} />
    }
  }

  return (
    <Suspense fallback={<div>Memuat tampilan timer ...</div>}>
      {body()}
    </Suspense>
  )
}

const SceneInit: FC<{ onStart: (data: Tdata) => void }> = props => {
  const { onStart } = props

  const [data, setData] = useState<Tdata>({ steps: [{ ...emptyDataStep }] })

  const handleAdd = () => {
    const newSteps = [...data.steps]
    newSteps.push({ ...emptyDataStep })
    setData(prev => ({ ...prev, steps: newSteps }))
  }

  const handleChange = (
    idx: number,
    key: 'name' | 'duration',
    value: string,
  ) => {
    const newDataSteps = [...data.steps]

    switch (key) {
      case 'name':
        newDataSteps[idx].name = value
        break
      case 'duration':
        newDataSteps[idx].duration = Number(value)
        break
      default:
        return
    }

    setData(prev => ({ ...prev, steps: newDataSteps }))
  }

  const handleDelete = (idx: number) => {
    const newSteps = [...data.steps]
    newSteps.splice(idx, 1)
    setData(prev => ({ ...prev, steps: newSteps }))
  }

  const handleStart = () => {
    onStart(data)
  }

  return (
    <div className={clsx(styles.page, 'w-screen p-3 flex justify-center')}>
      <div className="justify-center">
        <div className="mb-6 text-center">Insert your steps and duration</div>
        <div>
          <table className="w-full">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th>Duration</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {data.steps.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      placeholder="Name"
                      value={item.name}
                      onChange={e => handleChange(i, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Duration"
                      type="number"
                      value={item.duration || undefined}
                      onChange={e =>
                        handleChange(i, 'duration', e.target.value)
                      }
                    />
                  </td>
                  <td>Second</td>
                  <td>
                    <button className="w-fit" onClick={() => handleDelete(i)}>
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className="w-full my-2" onClick={handleAdd}>
              Add
            </button>
            <button
              className="w-full"
              hidden={data.steps.length <= 1}
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ScenePlay: FC<{ data: Tdata }> = props => {
  const { data } = props

  const { current: timer } = useRef(new Timer())

  const [turnIdx, setTurnIdx] = useState(0)
  const [second, setSecond] = useState(0)
  const [isPause, setIsPause] = useState(true)
  const [duration, setDuration] = useState(data.steps[0]?.duration || 0)

  useEffect(() => {
    timer.insertData({
      data: data.steps,
      onNextTurn: (nextIdx, data) => {
        setTurnIdx(nextIdx)
        setDuration(data.duration)
      },
      onTickSecond: sec => setSecond(sec),
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePause = () => {
    setIsPause(true)
    timer.pause()
  }

  const handleContinue = () => {
    setIsPause(false)
    timer.continue()
  }

  const handleReset = () => {
    setIsPause(true)
    timer.reset()
  }

  return (
    <div className="w-screen p-3">
      <div className="mb-10">
        {data.steps.map((step, i) => (
          <div
            key={i}
            className={clsx('px-3 text-lg', {
              ['bg-white text-black font-bold py-3']: i === turnIdx,
            })}
          >
            {step.name}
          </div>
        ))}
      </div>
      <div className="relative flex justify-center">
        <ProgressCircle duration={duration} second={second} />
        <div className="absolute top-[80px] text-4xl">{second}</div>
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={handlePause} hidden={isPause}>
          Pause
        </button>
        <button onClick={handleContinue} hidden={!isPause}>
          Continue
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}

const ProgressCircle: FC<{ duration: number; second: number }> = props => {
  const { duration, second } = props

  const radius = 90
  const dashArray = 2 * Math.PI * radius
  const dashOffset = dashArray * ((duration - second) / duration)

  return (
    <svg
      width="200"
      height="200"
      viewBox="-25 -25 250 250"
      style={{
        transform: 'rotate(-90deg)',
        transformOrigin: 'center',
      }}
    >
      <circle
        r={radius}
        cx="100"
        cy="100"
        fill="transparent"
        stroke="#e0e0e0"
        strokeWidth="12px"
      />
      <circle
        r={radius}
        cx="100"
        cy="100"
        fill="transparent"
        stroke="green"
        strokeWidth="12px"
        strokeLinecap="round"
        strokeDasharray={`${dashArray}px`}
        strokeDashoffset={`${dashOffset}px`}
        style={{
          transition: '1s linear all',
        }}
      />
    </svg>
  )
}

type Tscene = 'init' | 'play'

const emptyData: Tdata = { steps: [] }

const emptyDataStep: TdataStep = { name: '', duration: 0 }
