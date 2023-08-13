import "./css/poll.css";

export default class Poll {
  constructor(data) {
    const { id, from, subject, body, received } = data;
    this.id = id;
    this.from = from;
    this.subject = subject;
    this.body = body;
    this.received = new Date(received);
  }
  get element() {
    const { subject, from } = this.convertMessages();
    const time = this.convertTime();

    const element = document.createElement("li");
    element.classList.add("polling-item");
    element.innerHTML = `<div class="poll-item-mail">${from}</div>
    <div class="poll-item-message">${subject}</div>
    <div class="poll-item-time">${time}</div>`;
    return element;
  }

  convertMessages() {
    let subject;
    let from;
    if (this.subject.length > 15) {
      subject = `${this.subject.substring(0, 15)}...`;
    } else {
      subject = this.subject;
    }
    if (this.from.length > 15) {
      from = `${this.from.substring(0, 15)}...`;
    } else {
      from = this.from;
    }

    return { subject, from };
  }

  convertTime() {
    return `${this.received.getHours()}:${this.received.getMinutes()} ${this.received.getDate()}.${this.received.getMonth()}.${this.received.getFullYear()}`;
  }
}
