import Axios from 'axios'
import Cookie from 'js-cookie'
import LocalForage from 'localforage'

import { generateRandomString } from '../../tools/random'
import {
  keyDeviceID,
  keyState,
  RespCreateRoom,
  RespGetState,
  Root,
  TstateStorage,
} from './types'

const URL = 'https://apis.bayuaditya.dev'

export class MonopolyEngine {
  static async getState() {
    return await LocalForage.getItem<TstateStorage>(keyState)
  }

  static async createRoom(req: { initBalance: number; playerName: string }) {
    const reqBody = {
      initial_balance: req.initBalance,
      player: {
        id: this.getDeviceID(),
        name: req.playerName,
      },
    }
    const resp = await Axios.post<Root<RespCreateRoom>>(
      `${URL}/mbs/room`,
      reqBody,
    )

    // setting state storage
    const state: TstateStorage = {
      playerID: this.getDeviceID(),
      roomID: resp.data.data.room_id,
      roomPass: resp.data.data.room_pass,
    }
    await LocalForage.setItem(keyState, state)

    return
  }

  static async joinRoom(req: {
    playerName: string
    roomID: string
    roomPass: string
  }) {
    const reqBody = {
      player_id: this.getDeviceID(),
      player_name: req.playerName,
      room_id: req.roomID,
      room_pass: req.roomPass,
    }
    await Axios.post<Root<unknown>>(`${URL}/mbs/room-join`, reqBody)

    // setting state storage
    const state: TstateStorage = {
      playerID: this.getDeviceID(),
      roomID: req.roomID,
      roomPass: req.roomPass,
    }
    await LocalForage.setItem(keyState, state)

    return
  }

  static async leaveRoom() {
    const state = await this.getState()
    const roomID = state?.roomID || ''
    const roomPass = state?.roomPass || ''
    const playerID = state?.playerID || ''

    await Axios.post(`${URL}/mbs/room/${roomID}/leave`, {
      room_pass: roomPass,
      player_id: playerID,
    })
  }

  static async SSE() {
    const state = await this.getState()
    const roomID = state?.roomID || ''

    return new EventSource(`${URL}/mbs/room/${roomID}/sse`)
  }

  static async getRoomState() {
    const state = await this.getState()
    const roomID = state?.roomID || ''
    const playerID = state?.playerID || ''

    const resp = await Axios.get<Root<RespGetState>>(
      `${URL}/mbs/room/${roomID}/state?player_id=${playerID}`,
    )
    return resp.data.data
  }

  static async createTransaction(opt: {
    targetPlayerID: string
    type: 'pay' | 'ask'
    amount: number
  }) {
    const state = await this.getState()
    const roomID = state?.roomID || ''
    const playerID = state?.playerID || ''

    await Axios.post(`${URL}/mbs/room/${roomID}/transaction`, {
      player_id: playerID,
      target_player_id: opt.targetPlayerID,
      type: opt.type,
      amount: opt.amount,
    })
  }

  static getDeviceID(): string {
    let deviceID = Cookie.get(keyDeviceID)

    // if not found, then set it
    if (!deviceID) {
      deviceID = generateRandomString(10)
      Cookie.set(keyDeviceID, deviceID)
    }

    return deviceID
  }
}
