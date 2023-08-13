import "./css/polling.css";
import Poll from "./Poll";
import State from "./State";
import { ajax } from "rxjs/ajax";
import { interval, map, catchError, of } from "rxjs";

export default class Polling {
  constructor(container) {
    this.url = "http://localhost:7070";
    this.container = container;
    this.ItemType = Poll;
  }

  init() {
    const element = document.createElement("div");
    element.classList.add("polling-widget");
    element.innerHTML = `<div class="polling-header">
    <h3 class="polling-title">INCOMING</h3>
</div>
<div class="polling-main">
    <ul class="polling-list">        
    </ul>
</div>`;

    this.container.append(element);
    this.element = element;
    this.pollList = this.element.querySelector(".polling-list");

    // this.getUnreadMessages();
    this.getMessages();
  }

  getMessages() {
    const obs$ = ajax.getJSON("http://localhost:7070/messages/unread").pipe(
      map((userResponse) => console.log("users: ", userResponse)),
      catchError((error) => {
        console.log("error: ", error);
        return of(error);
      })
    );

    obs$.subscribe({
      next: (value) => console.log(value),
      error: (err) => console.log(err),
    });
    /*const stream$ = ajax("http://localhost:7070/messages/unread").pipe(
      map((val) => console.log(val))
    );
    stream$.subscribe((val) => console.log(val));*/
  }

  async getUnreadMessages() {
    const response = await fetch("http://localhost:7070/messages/unread");
    const json = await response.json();
    const { status, timestamp, messages } = json;

    this.pollState = new State(status, timestamp);
    this.renderMessages(messages);
  }

  renderMessages(messages) {
    const stateMessages = [];
    messages.forEach((el) => {
      const message = new this.ItemType(el);
      const messageEl = message.element;
      this.pollList.append(messageEl);
      stateMessages.push({
        type: message,
        element: messageEl,
      });
    });
    this.pollState.messages = stateMessages;
  }
}
