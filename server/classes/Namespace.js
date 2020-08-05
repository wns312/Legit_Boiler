class Namespace {
  constructor(nsTitle, img, endpoint) {
    
    this.nsTitle = nsTitle;
    this.img = img;
    this.endpoint = endpoint;
    this.rooms = [];
    this.nsMember = [];
  }
  addRoom(roomObj) {
    this.rooms.push(roomObj);
  }
  addNsMember(userId) {
    this.nsMember.push(userId);
  }
}

module.exports = Namespace;
