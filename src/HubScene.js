class HubScene {
  constructor({ dialogue, replay_manager, start_level }) {
    this.dialogue = dialogue;
    this.start_level = start_level;
    this.replay_manager = replay_manager;

    this.reset();
  }

  reset() {
    this.player = new Player({
      start_pos: [width / 2, height * 0.8],
      bounds: [0, 0, width, height],
      in_menu: true
    });
  }

  handle_click() {}

  handle_key_press() {
    this.player.handle_key_press();
  }

  show() {
    imageMode(CORNER);
    image(images.backgrounds.hub, 0, 0, width, height);
    this.player.show();
    this.player.dash_cooldown.show();
  }

  update() {
    this.player.update([]);
  }
}
