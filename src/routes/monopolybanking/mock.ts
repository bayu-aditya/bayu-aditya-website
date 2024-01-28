import { Tlog, Tplayer } from './types'

export const mockData: {
  player: Tplayer
  players: Tplayer[]
  logs: Tlog[]
} = {
  player: { id: '123', name: 'Hupla', balance: 500 },
  players: [
    { id: 'abc', name: 'ABC', balance: 10000 },
    { id: 'def', name: 'DEF', balance: 20000 },
    { id: 'ghi', name: 'GHI', balance: 30000 },
    { id: 'jkl', name: 'JKL', balance: 40000 },
    { id: 'mno', name: 'MNO', balance: 50000 },
    { id: 'pqr', name: 'PQR', balance: 60000 },
    { id: 'stu', name: 'STU', balance: 70000 },
    { id: 'vwx', name: 'VWX', balance: 80000 },
  ],
  logs: [
    {
      datetime: new Date('2023-12-14T08:02:00Z'),
      message: 'Player 3 pays Player 1: 100',
    },
    {
      datetime: new Date('2023-12-14T08:01:34Z'),
      message: 'Player 2 pays Player 1: 400',
    },
    {
      datetime: new Date('2023-12-14T08:00:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:59:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:58:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:57:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:56:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:55:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:54:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:53:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:52:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:51:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
    {
      datetime: new Date('2023-12-14T07:50:00Z'),
      message: 'Player 1 pays Player 2: 350',
    },
  ],
}
