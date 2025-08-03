class LevelTotem {
  constructor({
    player,
    replay_manager,
    dialogue,
    start_level,
    level = 1,
    pos,
    progression
  }) {
    this.player = player;
    this.replay_manager = replay_manager;
    this.dialogue = dialogue;
    this.start_level = start_level;
    this.progression = progression;

    this.level = level;
    this.pos = createVector(...pos);

    this.replay_size = [400, 300];
    this.totem_size = [400, 100];
    this.gap = 50;

    this.replay = this.progression.completed_levels.includes(1)
      ? this.replay_manager.get_replay(
          level,
          this.replay_corner,
          this.replay_size
        )
      : null;

    this.hitbox = new HitBox(
      [
        this.replay_corner[0] + this.replay_size[0] / 2,
        this.replay_corner[1] + this.replay_size[1] / 2
      ],
      this.replay_size
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

  get totem_corner() {
    const total_size = this.total_size();
    return [
      this.pos.x - total_size[0] / 2,
      this.pos.y - total_size[1] / 2 + this.replay_size[1] + this.gap
    ];
  }

  handle_key_press() {
    if (keyCode === 80 && this.hitbox.contains(this.player.hitbox)) {
      this.shrink_progress = 1 / frameRate() / this.shrink_duration;
    }
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
    imageMode(CORNER);
    image(
      images.backgrounds['level' + this.level],
      ...this.replay_corner,
      400,
      300
    );
    this.replay?.show();

    image(images['square'], ...this.totem_corner, 400, 100);

    this.hitbox.show();
  }
}
