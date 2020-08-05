class Room {
  constructor(roomTitle, namespace, nsEndpoint, isprivate = false) {
    this.roomTitle = roomTitle;
    this.isPrivate = isprivate;
    this.namespace = namespace;
    this.nsEndpoint = nsEndpoint;
    this.history = [];
    this.member = []; 
  }

  addMessage(message) { this.history.push(message); }
  addMember(member) { this.member.push(member); }
  
  clearHistory() { this.history = []; }
}

module.exports = Room;
