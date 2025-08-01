class GameManager {
  constructor({ dialogue }) {
    this.dialogue = dialogue;

    this.map = null;
    this.camera = new Camera(this);
    this.pause_modal = new PauseModal();

    this.enemies = [];

    this.reset();
  }

  reset() {
    this.state = 'game';
    this.level_promise = null;
    this.on_finish_level = null;
    this.player = new Player({
      start_pos: [width / 2, height / 2],
      camera: this.camera,
      die: () => {
        if (this.on_finish_level) this.on_finish_level();
        this.on_finish_level = null;
      }
    });
  }

  set_map(map) {
    this.map = map;
    this.camera.set_pos(createVector(...map.start_pos));
    this.player.pos.set(map.start_pos);
    this.player.update_hitbox();
  }

  async run_level(level) {
    if (this.level_promise)
      return console.warn('Level already running, cannot start a new one.');

    console.log(`Running level ${level}`);
    this.reset();

    let level_ended = { val: false };
    this.level_promise = new Promise(resolve => {
      this.on_finish_level = () => {
        level_ended.val = true;
        resolve();
      };
    });

    switch (level) {
      case 1:
        // this.audio.play_track('hell-3.mp3', true);
        this.set_map(Maps[0]());
        this.enemies.push(new Enemy(null, [1300, 1400], [50, 100]));

        await timeout(4000);
        break;
    }

    if (!level_ended.val && this.on_finish_level) this.on_finish_level();
  }

  handle_click() {
    if (this.state === 'pause') return this.pause_modal.handle_click();

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
    }

    if (keyCode === 32) {
      this.run_level(1);
    }
  }

  show() {
    imageMode(CORNER);
    background('white');
    push();
    this.camera.show();
    this.enemies.forEach(enemy => enemy.show());
    this.player.show(this.state === 'pause');
    pop();
    if (this.state === 'pause') this.pause_modal.show();
  }

  update() {
    switch (this.state) {
      case 'game':
        this.player.update(this.map?.obstacles || []);
        this.camera.set_pos(this.player.pos);

        this.enemies.forEach(enemy => enemy.update(this.player, this.map));

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }
}
