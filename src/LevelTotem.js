class LevelTotem {
  constructor({
    player,
    replay_manager,
    dialogue,
    start_level,
    level = 1,
    pos
  }) {
    this.player = player;
    this.replay_manager = replay_manager;
    this.dialogue = dialogue;
    this.start_level = start_level;

    this.level = level;
    this.pos = createVector(...pos);

    this.replay = null; // this.replay_manager.get_replay(level, [100, 100], [800, 600]);
    this.replay_size = [400, 300];
    this.totem_size = [400, 100];
    this.gap = 50;

    this.hitbox = new HitBox(
      [
        this.totem_corner[0] + this.totem_size[0] / 2,
        this.totem_corner[1] + this.totem_size[1] / 2
      ],
      this.totem_size
    );
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

  show() {
    imageMode(CORNER);
    image(images['square'], ...this.replay_corner, 400, 300);
    this.replay?.show();

    image(images['square'], ...this.totem_corner, 400, 100);

    this.hitbox.show();
  }
}
