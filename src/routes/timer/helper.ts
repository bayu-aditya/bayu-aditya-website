/* eslint-disable no-constant-condition */
import { TdataStep } from './types'

export class Timer {
  private dataSteps: Array<TdataStep>
  private onNextTurn: (nextIdx: number, dataStep: TdataStep) => void
  private onTickSecond: (second: number) => void

  private turnIdx: number = 0
  private currentSecond: number = 0
  private intervalFunc: number = 0

  constructor() {
    this.dataSteps = []
    this.onNextTurn = () => {}
    this.onTickSecond = () => {}
  }

  insertData(arg: {
    data: TdataStep[]
    onNextTurn: (nextIdx: number, data: TdataStep) => void
    onTickSecond: (second: number) => void
  }) {
    this.dataSteps = arg.data
    this.onNextTurn = arg.onNextTurn
    this.onTickSecond = arg.onTickSecond

    this.currentSecond = arg.data[0]?.duration + 1 || 0
  }

  pause() {
    clearInterval(this.intervalFunc)
  }

  continue() {
    this.startTimer()
  }

  reset() {
    this.pause()

    const second = this.dataSteps[this.turnIdx].duration
    this.currentSecond = second
    this.onTickSecond(second)
  }

  async run() {
    this.startTimer()
  }

  private async startTimer() {
    clearInterval(this.intervalFunc)

    this.intervalFunc = setInterval(() => {
      let second = this.currentSecond - 1

      if (second < 0) {
        let nextTurnIdx = this.turnIdx + 1

        if (nextTurnIdx > this.dataSteps.length - 1) {
          nextTurnIdx = 0
        }

        this.turnIdx = nextTurnIdx
        this.onNextTurn(nextTurnIdx, this.dataSteps[nextTurnIdx])

        second = this.dataSteps[nextTurnIdx].duration
      }

      this.onTickSecond(second)
      this.currentSecond = second
    }, 1000)
  }
}
