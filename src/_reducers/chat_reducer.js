import {SOCKET, NS_LIST, CURRENT_NS, ROOM_DATA, CURRENT_ROOM } from '../_actions/types'

export default function (state={}, action) {
  switch (action.type) {
    case SOCKET:
      return {...state, nsSocket : action.payload }

    case NS_LIST:
      return {...state, nsList : action.payload}
    case CURRENT_NS:
      return {...state, currentNs : action.payload}

    case ROOM_DATA:
      return {...state, roomData : action.payload}      
    case CURRENT_ROOM:
      return {...state, currentRoom : action.payload}

    default: 
      return state;
  }
}

// const initialState = {
//   nsSocket : "",
//   RoomName : "",
//   nsData: "",
//   nsMember : "",
//   nsIndex : ""
// }