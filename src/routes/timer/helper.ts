/* eslint-disable no-constant-condition */
import { TdataStep } from './types'

export class Timer {
  private dataSteps: Array<TdataStep>
  private onNextTurn: (nextIdx: number, dataStep: TdataStep) => void
  private onTickSecond: (second: number) => void

  private turnIdx: number = 0
  private isPause: boolean = false

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
  }

  pause() {
    this.isPause = true
  }

  continue() {
    this.isPause = false
  }

  async run() {
    let i = 0

    while (true) {
      await this.timer()

      i++
      if (i >= this.dataSteps.length) {
        i = 0
      }
      this.turnIdx = i

      // intermediate timer

      this.onNextTurn(i, this.dataSteps[i])
    }
  }

  private async timer() {
    const currentStep = this.dataSteps[this.turnIdx]

    for (let i = currentStep.duration; i >= 0; i--) {
      // for pause case, then will try to check every second is continued or not
      if (this.isPause) {
        while (true) {
          await this.timeout(1)
          if (!this.isPause) {
            break
          }
        }
      }

      this.onTickSecond(i)
      await this.timeout(1)
    }
  }

  private async timeout(second: number) {
    return new Promise(resolve => setTimeout(resolve, second * 1000))
  }
}
