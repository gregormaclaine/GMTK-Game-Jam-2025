class SceneManager {
  static FADE_TIME = 0.8;
  static DEV_SKIP_MENU = true; // Set to false to enable menu

  constructor() {
    this.state = SceneManager.DEV_SKIP_MENU ? 'game' : 'menu';
    // this.state = 'hub';

    this.progression = {
      completed_levels: [],
      post_win: false,
      selected_ability: null // 'slow' | 'slash' | 'trail' | null
    };
    this.collected = { wood: 0, iron: 0, slime: 0, matter: 0 };

    this.dialogue = new DialogueManager();

    this.game_scene = new GameManager({
      dialogue: this.dialogue,
      collected: this.collected,
      progression: this.progression
    });
    this.replay_manager = new ReplayManager();

    this.menu_scene = new MenuScreen(this.dialogue, () => this.start_level(1));
    this.hub_scene = new HubScene({
      dialogue: this.dialogue,
      replay_manager: this.replay_manager,
      start_level: this.start_level.bind(this),
      collected: this.collected,
      progression: this.progression
    });

    this.gamewin_scene = new GameWinScene(async () => {
      await this.fade('out');
      this.progression.post_win = true;
      this.state = 'hub';
      await this.fade('in');
    });

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};

    if (SceneManager.DEV_SKIP_MENU && this.state === 'game') {
      this.game_scene.run_level(1);
    }
  }

  async start_level(level) {
    await this.fade('out');
    this.state = 'game';
    this.game_scene.run_level(level);
    await this.fade('in');

    switch (level) {
      case 1:
        await this.dialogue.send(DIALOGUE.TEST);
        break;
      case 2:
        // await this.dialogue.send(DIALOGUE.LEVEL_2);
        break;
      case 3:
        // await this.dialogue.send(DIALOGUE.LEVEL_3);
        break;
    }

    this.replay_manager.start(level);
    const success = await this.game_scene.level_promise;
    await this.fade('out');
    this.replay_manager.finish(success);
    this.hub_scene.reset();

    if (level === 3) {
      this.state = 'gamewin';
    } else {
      this.state = 'hub';
    }

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
      case 'gamewin':
        return this.gamewin_scene.handle_click();
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
        this.show_hud();
        break;

      case 'menu':
        this.menu_scene.show();
        break;

      case 'hub':
        this.hub_scene.show();
        this.show_hud();
        break;

      case 'gamewin':
        this.gamewin_scene.show();
        break;
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

  show_hud() {
    const inventory = this.game_scene.inventory || {};

    imageMode(CORNER);
    image(images.hud, 0, 0, width, height);

    textAlign(LEFT, CENTER);
    textSize(40);
    fill(255);
    stroke(255);
    const start_y = 65;
    const spacing = 95;
    text(this.collected.wood + (inventory.wood || 0), 200, start_y);
    text(this.collected.iron + (inventory.iron || 0), 200, start_y + spacing);
    text(
      this.collected.matter + (inventory.matter || 0),
      200,
      start_y + spacing * 2
    );
    text(
      this.collected.slime + (inventory.slime || 0),
      200,
      start_y + spacing * 3
    );
  }

  update() {
    if (this.fade_mode) {
      this.fade_progress += 1 / SceneManager.FADE_TIME / frameRate();
      if (this.fade_progress >= 1) this.fade_completed();
    }

    if (this.dialogue.active) return this.dialogue.update();

    switch (this.state) {
      case 'game':
        if (!this.fade_mode) this.game_scene.update();
        break;

      case 'hub':
        this.hub_scene.update();
        break;

      case 'menu':
        this.menu_scene.update();
        break;

      case 'gamewin':
        this.gamewin_scene.update();
        break;
    }
  }
}
