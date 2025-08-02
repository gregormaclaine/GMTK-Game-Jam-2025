class GameMap {
  constructor({ background, size, color, start_pos }) {
    this.background = background;
    this.size =
      size ||
      (background ? [background.width, background.height] : [3000, 3000]);
    this.color = color || '#000000';
    this.start_pos =
      start_pos || createVector(this.size[0] / 2, this.size[1] / 2);

    this.obstacles = [];
    this.enemies = [];
    this.barrels = [];

    this.path_grid = new PathfindingGrid(this.size);

    this.on_complete = () => {};
    this.completion_promise = new Promise(resolve => {
      this.on_complete = resolve;
    });
  }

  add_obstacle({ image, pos, size }) {
    const hitbox = new HitBox(
      [pos[0] + size[0] / 2, pos[1] + size[1] / 2],
      size
    );
    const obstacle = {
      image: image || null,
      pos: createVector(pos[0], pos[1]),
      size: size || [50, 50],
      hitbox
    };
    this.obstacles.push(obstacle);
    this.path_grid.markObstacle(obstacle);
  }

  add_enemy(enemy) {
    this.enemies.push(enemy);
    enemy.set_map(this);
  }

  update_enemies(player) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(player, this);
      if (enemy.deletable) this.enemies.splice(i, 1);
    }
  }
}
