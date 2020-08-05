import {SOCKET,  CURRENT_ROOM, ROOM_DATA, NS_LIST, CURRENT_NS} from './types'
//소켓
export function inputSocket(nsSocket) {
  return {
    type : SOCKET,
    payload : nsSocket
  }
}
//NS관련
export function inputNsList(nsList) {
  return {
    type : NS_LIST,
    payload : nsList
  }
}
export function inputCurrentNs(currentNs) {
  return {
    type : CURRENT_NS,
    payload : currentNs
  }
}
//방관련
export function inputRoomData(roomData) {
  return {
    type : ROOM_DATA,
    payload : roomData
  }
}
export function inputCurrentRoom(currentRoom) {
  return {
    type : CURRENT_ROOM,
    payload : currentRoom
  }
}
