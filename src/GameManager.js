class GameManager {
  static SKYSPEED = 1;

  constructor({ images, audio, dialogue, collected }) {
    this.images = images;
    this.audio = audio;
    this.collected = collected;
    this.dialogue = dialogue;

    this.camera = new Camera();

    this.pause_modal = new PauseModal();
    this.background = images['bullet-bg'];

    this.hard_reset();
  }

  hard_reset() {
    this.ability = null;
    this.passives = [];
    this.reset();
  }

  reset() {
    this.sky_pos = 0;
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

  async run_level(level) {
    this.reset();

    let level_ended = { val: false };
    this.level_promise = new Promise(resolve => {
      this.on_finish_level = () => {
        level_ended.val = true;
        resolve();
      };
    });

    await timeout(1000);
    switch (level) {
      case 'tutorial':
        this.audio.play_track('hell-3.mp3', true);
        await this.bullets.tutorial_level();
        break;
      case 1:
        this.audio.play_track('hell-2.mp3', true);
        await this.bullets.level1();
        break;
      case 2:
        this.audio.play_track('hell-2.mp3', true);
        await this.bullets.level2();
        break;
      case 3:
        this.audio.play_track('hell-4.mp3', true);
        await this.bullets.level3();
        break;
      case 4:
        this.audio.play_track('hell-4.mp3', true);
        await this.bullets.level4();
        break;
      case 5:
        this.audio.play_track('hell-4.mp3', true);
        await this.bullets.level5();
        break;
      case 6:
        this.audio.play_track('hell-1.mp3', true);
        await this.bullets.level6();
        break;
      case 7:
        this.audio.play_track('hell-1.mp3', true);
        await this.bullets.level7();
        break;
      case 8:
        this.audio.play_track('hell-1.mp3', true);
        await this.bullets.level8();
        break;
    }

    if (!level_ended.val && this.on_finish_level) {
      this.player.ascending = true;
      await new Promise(resolve => (this.player.on_ascended = resolve));
      this.on_finish_level();
    }
  }

  set_ability(ability) {
    this.audio.play_sound('ability.wav');
    this.ability = ability;
    switch (this.ability) {
      case 'lazer':
        this.ability_cooldown.cooldown = 2;
        break;
      case 'stealth':
        this.ability_cooldown.cooldown = 15;
        break;
      case 'time':
        this.ability_cooldown.cooldown = 9;
        break;
    }
  }

  add_passive(passive) {
    this.audio.play_sound('ability.wav');
    this.passives.push(passive);
  }

  use_ability() {
    switch (this.ability) {
      case 'lazer':
        this.bullets.shoot();
        break;
      case 'stealth':
        this.audio.play_sound('invincibility_start.wav');
        this.player.invincible = true;
        setTimeout(() => {
          this.player.invincible = false;
          this.audio.play_sound('invincibility_end.wav');
        }, 1500);
        break;
      case 'time':
        this.bullets.slow = true;
        this.audio.play_sound('time_slowdown.wav');
        setTimeout(() => {
          this.bullets.slow = false;
          this.audio.play_sound('time_speedup.wav');
        }, 3500);
        break;
      // case 'magnet':
      //   this.bullets.magnetic = true;
      //   setTimeout(() => {
      //     this.bullets.magnetic = false;
      //   }, 3000);
      //   break;
      default:
        return;
    }
  }

  ability_image() {
    switch (this.ability) {
      case 'time':
        return images['ability-clock'];
      case 'stealth':
        return images['ability-shield'];
      case 'lazer':
        return images['ability-lazer'];
      default:
        return images['rock'];
    }
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

      if (keyCode === 80 && this.ability) {
        this.ability_cooldown.activate();
      }
    }
  }

  show() {
    imageMode(CORNER);
    background('white');
    // image(this.background, 0, this.sky_pos - this.background.height);
    // image(this.background, 0, this.sky_pos);
    // this.bullets.show();
    push();
    this.camera.show();
    this.player.show();
    pop();
    // this.draw_hud();
    if (this.state === 'pause') this.pause_modal.show();
  }

  update() {
    switch (this.state) {
      case 'game':
        // this.sky_pos =
        //   (this.sky_pos + GameManager.SKYSPEED) % this.background.height;
        // this.bullets.update();
        this.player.update();
        this.camera.set_pos(this.player.pos);

      // this.bullets.bullets.forEach(b => {
      //   if (b.hitbox.is_colliding(this.player.hitbox)) {
      //     if (this.player.take_damage()) {
      //       b.collide();
      //     }
      //   }
      // });

      // this.ability_cooldown.update();

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }
}
