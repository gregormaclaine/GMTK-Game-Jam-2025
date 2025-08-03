const persisting_replays = {};

class LevelTotem {
  constructor({
    player,
    replay_manager,
    dialogue,
    start_level,
    level = 1,
    pos,
    progression,
    collected
  }) {
    this.player = player;
    this.replay_manager = replay_manager;
    this.dialogue = dialogue;
    this.start_level = start_level;
    this.progression = progression;
    this.collected = player.collected;

    this.level = level;
    this.pos = createVector(...pos);

    this.replay_size = [400, 300];
    this.totem_size = [400, 200];
    this.gap = 50;

    this.replay = persisting_replays[level] || null;

    this.hitbox = new HitBox(
      [
        this.replay_corner[0] + this.replay_size[0] / 2,
        this.replay_corner[1] + this.replay_size[1] / 2
      ],
      this.replay_size
    );

    this.button_hitbox = new HitBox(
      [
        this.totem_corner[0] + this.totem_size[0] / 2,
        this.totem_corner[1] + this.totem_size[1] / 2
      ],
      this.totem_size
    );

    this.shrink_progress = null;
    this.shrink_duration = 1;
    this.starting_level = false;
  }

  total_size() {
    return [
      this.replay_size[0],
      this.replay_size[1] + this.totem_size[1] + this.gap
    ];
  }

  get replay_corner() {
    const total_size = this.total_size();
    return [this.pos.x - total_size[0] / 2, this.pos.y - total_size[1] / 2];
  }

  get replay_center() {
    return [
      this.replay_corner[0] + this.replay_size[0] / 2,
      this.replay_corner[1] + this.replay_size[1] / 2
    ];
  }

  get totem_corner() {
    const total_size = this.total_size();
    return [
      this.pos.x - total_size[0] / 2,
      this.pos.y - total_size[1] / 2 + this.replay_size[1] + this.gap
    ];
  }

  handle_key_press() {
    if (
      keyCode === 80 &&
      this.hitbox.contains(this.player.hitbox) &&
      !this.is_locked() &&
      !this.shrink_progress
    ) {
      this.shrink_progress = 1 / frameRate() / this.shrink_duration;
      return;
    }

    if (
      keyCode === 80 &&
      this.button_hitbox.contains(this.player.hitbox) &&
      this.progression.completed_levels.includes(this.level) &&
      !this.replay
    ) {
      this.begin_replay();
    }
  }

  is_locked() {
    for (let i = this.level - 1; i > 0; i--) {
      if (!this.progression.completed_levels.includes(i)) return true;
    }
    return false;
  }

  async begin_replay() {
    if (this.collected.slime < 10) {
      audio.play_sound('dud.wav');
      return;
    }
    this.collected.slime -= 10;

    this.replay = this.replay_manager.get_replay(
      this.level,
      this.replay_corner,
      this.replay_size
    );
    persisting_replays[this.level] = this.replay;
    await this.replay.promise;

    // Add resources from replay
    let play_count = 0;
    for (const resource in this.replay.collected) {
      if (resource === 'slime') continue; // Slime is not collected from replays
      this.collected[resource] += this.replay.collected[resource];
      if (play_count++ < 3) audio.play_sound('pickup.wav');
    }

    this.replay = null;
    persisting_replays[this.level] = null;
  }

  update() {
    if (this.shrink_progress) {
      this.shrink_progress += 1 / frameRate() / this.shrink_duration;
      if (this.shrink_progress >= 1 && !this.starting_level) {
        this.starting_level = true;
        this.start_level(this.level);
      }
    }
  }

  show() {
    const locked = this.is_locked();
    push();
    imageMode(CORNER);
    tint(255, locked ? 100 : 255);
    image(
      images.backgrounds['level' + this.level],
      ...this.replay_corner,
      400,
      300
    );
    noTint();

    if (this.is_locked()) {
      if (this.replay) tint(255, 100);
      imageMode(CENTER);
      image(images['lock'], ...this.replay_center, 200, 200);
      noTint();
    }
    pop();
    this.replay?.show();

    if (this.progression.completed_levels.includes(this.level)) {
      imageMode(CORNER);
      image(images.buttons.loop, ...this.totem_corner, 400, 200);
      this.button_hitbox.show();
    }

    this.hitbox.show();
  }
}
