import "./css/polling.css";
import Poll from "./Poll";
import State from "./State";
import { ajax } from "rxjs/ajax";
import { interval } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

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
        }).pipe(
          catchError((err) => {
            console.log(err);
            return stream$;
          }),
        ),
      ),
    );

    stream$.subscribe(
      async (response) => {
        this.getUnreadMessages(response.response);
      },
      (err) => console.log(err),
    );
  }

  async getUnreadMessages(json) {
    if (json.error) {
      console.log(json);
      return;
    }

    const { status, timestamp, messages } = json;

    if (!this.pollState) {
      this.pollState = new State(status, timestamp);
    }

    this.renderMessages(messages);
  }

  renderMessages(messages) {
    const ids = this.pollState.mesIds;
    messages.forEach((el) => {
      if (ids.includes(el.id)) {
        return;
      }
      const message = new this.ItemType(el);
      const messageEl = message.element;
      this.pollList.prepend(messageEl);
      this.pollState.add({
        type: message,
        element: messageEl,
      });
    });

    console.log(this.pollState.messages);
  }
}
