class GameManager {
  constructor({ dialogue, collected, progression }) {
    this.dialogue = dialogue;
    this.collected = collected;
    this.progression = progression;

    this.map = null;
    this.camera = new Camera();
    this.pause_modal = new PauseModal();
    this.boundary_tool = new BoundaryCreatorTool({ camera: this.camera });

    this.reset();
  }

  reset() {
    this.state = 'game';
    this.inventory = { wood: 0, iron: 0, slime: 0, matter: 0 };
    this.level_promise = null;
    this.on_finish_level = null;
    this.player = new Player({
      start_pos: [width / 2, height / 2],
      bounds: this.camera.bounds(),
      die: () => {
        if (this.on_finish_level) this.on_finish_level();
        this.on_finish_level = null;
      },
      collected: this.inventory,
      sword: this.progression.selected_weapon,
      progression: this.progression
    });
  }

  play_map(map) {
    this.map = map;
    map.set_progression(this.progression);
    this.camera.set_map(map);
    this.player.set_bounds(this.camera.bounds());
    this.player.set_pos(map.start_pos);
    return this.map.completion_promise;
  }

  async run_level(level) {
    console.log(`Running level ${level}`);
    this.reset();

    let level_ended = { val: false };
    this.level_promise = new Promise(resolve => {
      this.on_finish_level = inventory => {
        level_ended.val = true;
        resolve(inventory);
        this.inventory = { wood: 0, iron: 0, slime: 0, matter: 0 };
      };
    });

    switch (level) {
      case 1:
        // this.audio.play_track('hell-3.mp3', true);
        break;
      case 2:
        // this.audio.play_track('hell-2.mp3', true);
        break;
    }

    await this.play_map(Maps[level - 1]());

    if (this.player.health > 0) {
      this.progression.completed_levels.push(level);

      // Player survived the level
      this.collected.wood += this.inventory.wood;
      this.collected.iron += this.inventory.iron;
      this.collected.slime += this.inventory.slime;
      this.collected.matter += this.inventory.matter;
    }

    if (!level_ended.val && this.on_finish_level) {
      this.on_finish_level(
        this.player.health > 0 ? { ...this.inventory } : null
      );
    }
  }

  handle_click() {
    if (this.state === 'pause') return this.pause_modal.handle_click();

    if (this.boundary_tool.active) {
      this.boundary_tool.handle_click();
      return;
    }

    this.player.sword.swing();
  }

  handle_key_press() {
    if (this.state === 'pause') return this.pause_modal.handle_key_press();

    if (['game'].includes(this.state)) {
      const prev_state = this.state;
      if (keyCode === PAUSE_KEY_CODE) {
        this.pause_modal.open(() => (this.state = prev_state));
        return (this.state = 'pause');
      }

      if (keyCode === DEV_BOUNDARY_CREATE_KEY_CODE)
        return this.boundary_tool.toggle();

      this.player.handle_key_press();
    }
  }

  show() {
    push();
    this.camera.show();
    this.map?.show_sprites();
    this.player.show({ is_paused: this.state === 'pause' });
    this.boundary_tool.show_boundary();

    pop();
    this.player.dash_cooldown.show();
    this.player.draw_health();
    this.boundary_tool.show_hud();

    if (this.state === 'pause') this.pause_modal.show();
  }

  update() {
    switch (this.state) {
      case 'game':
        this.player.update(this.map);
        this.camera.set_pos(this.player.pos);
        this.map?.update_sprites(this.player);

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }
}
