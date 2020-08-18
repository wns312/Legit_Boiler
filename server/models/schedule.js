const mongoose = require('mongoose');

// //start랑 end number일수도 있음
const scheduleSchema = mongoose.Schema({
  owner:   { //유저, 방, ns id가 들어가
    type: mongoose.Schema.Types.ObjectId,
    required: true 
  },
  event:  [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'calender' 
  }],
});
            //아틀라스나 db 들거가는 모델이름 아틀라스 들어가면 
            //복수형이라서 calendars라는 스키마가 새로 생김
const Schedule = mongoose.model('schedule', scheduleSchema)

module.exports = { Schedule }



// const mongoose = require('mongoose');

// // //start랑 end number일수도 있음
// const eventSchema = mongoose.Schema({
//   title: { 
//     type: String, 
//     required: true,
//     // unique: true
//   },
//   start: { 
//     type: {Date}, 
//     required: true 
//   },
//   end:   { 
//     type: {Date}, 
//     required: true 
//   },
//   desc:  { 
//     type: String
//   },
//   index: {
//     type: Number
//   }
// });
//             //아틀라스나 db 들거가는 모델이름 아틀라스 들어가면 
//             //복수형이라서 calendars라는 스키마가 새로 생김
// const Event = mongoose.model('calendar', eventSchema)

// module.exports = { Event }
