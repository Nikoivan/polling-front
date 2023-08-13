export default class State {
  constructor(status, timestamp) {
    this.status = status;
    this.timestamp = timestamp;
  }

  get messages() {
    return this._messages;
  }

  set messages(messages) {
    this._messages = messages;
  }
}
