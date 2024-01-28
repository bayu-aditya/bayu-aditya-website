export const keyDeviceID = 'mbs_device_id'
export const keyRoomID = 'mbs_room_id'
export const keyState = 'mbs_state'

export type TstateStorage = {
  playerID: string
  roomID: string
  roomPass: string
}

export type Tplayer = {
  id: string
  name: string
  balance: number
}

export type TnewPlayer = Pick<Tplayer, 'id' | 'name'>

export type Tlog = {
  datetime: Date
  message: string
}

// --------------------------

export type Tscene = 'init' | 'create' | 'join' | 'play'

export interface Root<T> {
  meta: Meta
  data: T
}

export interface Meta {}

export interface RespCreateRoom {
  room_id: string
  room_pass: string
}

export interface RespGetState {
  player: Tplayer
  players: Tplayer[]
  logs: Tlog[]
}
