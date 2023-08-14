import "./css/polling.css";
import Poll from "./Poll";
import State from "./State";
import { ajax } from "rxjs/ajax";
import { Observable, interval, map, catchError, of, from } from "rxjs";
import { switchMap, take } from "rxjs/operators";

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

    //this.getUnreadMessages();
    this.getMessages();
  }

  async getMessages() {
    const stream$ = interval(1000).pipe(
      switchMap(() =>
        ajax({
          url: "http://localhost:7070/messages/unread",
          method: "GET",
          crossDomain: true,
          createXHR: () => {
            return new XMLHttpRequest();
          },
        })
      )
    );

    stream$.subscribe(
      async (response) => {
        //this.getUnreadMessages(response.response);
        console.log(response);
      },
      (err) => console.log("err")
    );
  }

  async getUnreadMessages(json) {
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
