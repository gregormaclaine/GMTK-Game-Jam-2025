class HubScene {
  constructor({ dialogue, replay_manager, start_level, collected }) {
    this.dialogue = dialogue;
    this.start_level = start_level;
    this.replay_manager = replay_manager;
    this.collected = collected;

    this.map = HubMap();
    this.camera = new Camera(this.map);

    this.boundary_tool = new BoundaryCreatorTool({ camera: this.camera });

    this.reset();
  }

  reset() {
    this.player = new Player({
      start_pos: this.map.start_pos,
      bounds: this.camera.bounds(),
      in_menu: true,
      collected: this.collected
    });

    const totem_props = {
      player: this.player,
      replay_manager: this.replay_manager,
      dialogue: this.dialogue,
      start_level: this.start_level
    };

    this.totems = [
      new LevelTotem({
        ...totem_props,
        level: 1,
        pos: [width * 0.5, height * 0.5]
      })
    ];
  }

  handle_click() {
    if (this.boundary_tool.active) {
      this.boundary_tool.handle_click();
      return;
    }
  }

  handle_key_press() {
    this.player.handle_key_press();

    if (keyCode === DEV_BOUNDARY_CREATE_KEY_CODE)
      return this.boundary_tool.toggle();
  }

  show() {
    push();
    this.camera.show();
    this.totems.forEach(totem => totem.show());
    this.player.show();
    this.boundary_tool.show_boundary();
    pop();

    this.boundary_tool.show_hud();
    this.player.dash_cooldown.show();
  }

  update() {
    this.player.update([]);
    this.camera.set_pos(this.player.pos);
  }
}
