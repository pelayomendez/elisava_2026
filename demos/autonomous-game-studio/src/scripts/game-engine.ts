export interface Choice {
  label: string;
  next: string;
}

export interface Room {
  text: string;
  choices: Choice[];
}

export interface Story {
  title: string;
  start: string;
  rooms: Record<string, Room>;
}

export class GameEngine {
  private story: Story;
  private currentRoom: string;
  private bodyEl: HTMLElement;
  private titleEl: HTMLElement | null;

  constructor(story: Story, bodyEl: HTMLElement, titleEl: HTMLElement | null) {
    this.story = story;
    this.currentRoom = story.start;
    this.bodyEl = bodyEl;
    this.titleEl = titleEl;
  }

  render() {
    if (this.titleEl) {
      this.titleEl.textContent = this.story.title ?? "adventure.exe";
    }

    const room = this.story.rooms[this.currentRoom];

    if (!room) {
      this.renderEnd();
      return;
    }

    this.bodyEl.innerHTML = `
      <p class="engine-scene">${room.text}</p>
      <div class="engine-choices">
        ${room.choices.map((_, i) => `
          <button class="engine-choice" data-idx="${i}">&gt; ${room.choices[i].label}</button>
        `).join("")}
      </div>`;

    this.bodyEl.querySelectorAll<HTMLButtonElement>(".engine-choice").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentRoom = room.choices[Number(btn.dataset.idx)].next;
        this.render();
      });
    });
  }

  restart() {
    this.currentRoom = this.story.start;
    this.render();
  }

  loadStory(story: Story) {
    this.story = story;
    this.currentRoom = story.start;
    this.render();
  }

  private renderEnd() {
    this.bodyEl.innerHTML = `
      <p class="engine-end">— The End —</p>
      <button class="engine-restart">Play again</button>`;

    this.bodyEl.querySelector(".engine-restart")!.addEventListener("click", () => {
      this.restart();
    });
  }
}
