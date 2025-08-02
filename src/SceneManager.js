class SceneManager {
  static FADE_TIME = 0.8;
  static DEV_SKIP_MENU = false; // Set to false to enable menu

  constructor() {
    this.state = SceneManager.DEV_SKIP_MENU ? 'game' : 'menu';
    // this.state = 'hub';

    this.dialogue = new DialogueManager();

    this.game_scene = new GameManager({ dialogue: this.dialogue });
    this.replay_manager = new ReplayManager();

    this.menu_scene = new MenuScreen(this.dialogue, () => this.start_level(1));
    this.hub_scene = new HubScene({
      dialogue: this.dialogue,
      replay_manager: this.replay_manager,
      start_level: this.start_level.bind(this)
    });

    // this.gameover_scene = new GameOverScene(async () => {
    //   await this.fade('out');
    //   this.state = 'planet';
    //   await this.fade('in');
    // });

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};

    if (SceneManager.DEV_SKIP_MENU && this.state === 'game') {
      this.game_scene.run_level(1);
    }

    this.test = null;
  }

  async start_level(level) {
    await this.fade('out');
    this.state = 'game';
    this.game_scene.run_level(level);
    this.replay_manager.start(level);
    await this.fade('in');
    await this.game_scene.level_promise;
    await this.fade('out');
    this.replay_manager.finish();
    this.test = this.replay_manager.get_replay(level, [100, 100], [800, 600]);
    this.state = 'menu';
    await this.fade('in');
  }

  async fade(mode) {
    this.fade_mode = mode;
    this.fade_progress = 0;
    await new Promise(resolve => (this.fade_completed = resolve));
    this.fade_mode = null;
  }

  handle_click() {
    if (this.fade_mode) return;

    if (this.dialogue.active) return this.dialogue.handle_click();

    switch (this.state) {
      case 'game':
        return this.game_scene.handle_click();
      case 'menu':
        return this.menu_scene.handle_click();
      case 'hub':
        return this.hub_scene.handle_click();
      // case 'gameover':
      //   return this.gameover_scene.handle_click();
      // case 'end':
      //   return this.end_scene.handle_click();
    }
  }

  handle_key_press() {
    if (this.fade_mode) return;
    if (this.dialogue.active) return this.dialogue.handle_key_press();

    if (this.state === 'game') this.game_scene.handle_key_press();
    if (this.state === 'hub') this.hub_scene.handle_key_press();
  }

  show() {
    switch (this.state) {
      case 'game':
        this.game_scene.show();
        break;

      case 'menu':
        this.menu_scene.show();
        this.test?.show();
        break;

      case 'hub':
        this.hub_scene.show();
        break;

      // case 'gameover':
      //   this.gameover_scene.show();
      //   break;

      // case 'end':
      //   this.end_scene.show();
      //   break;
    }

    if (this.dialogue.active) this.dialogue.show();

    if (this.fade_mode) {
      const opacities = this.fade_mode === 'in' ? [255, 0] : [0, 255];
      fill(0, lerp(...opacities, this.fade_progress));
      strokeWeight(0);
      rectMode(CORNERS);
      rect(0, 0, width, height);
    }
  }

  update() {
    if (this.fade_mode) {
      this.fade_progress += 1 / SceneManager.FADE_TIME / frameRate();
      if (this.fade_progress >= 1) this.fade_completed();
    }

    if (this.dialogue.active) return this.dialogue.update();

    switch (this.state) {
      case 'game':
        this.game_scene.update();
        break;

      case 'hub':
        this.hub_scene.update();
        break;

      case 'menu':
        this.menu_scene.update();
        break;

      // case 'gameover':
      //   this.gameover_scene.update();
      //   break;

      // case 'end':
      //   this.end_scene.update();
      //   break;
    }
  }
}
