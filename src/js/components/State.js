export default class State {
  constructor(status, timestamp) {
    this.status = status;
    this.timestamp = timestamp;
    this.messages = [];
    this.messagesId = [];
  }

  get mesIds() {
    return this.messagesId;
  }

  add(data) {
    this.messages.push(data);
    this.messagesId.push(data.type.id);
  }
}
