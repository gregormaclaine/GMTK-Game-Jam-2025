class PassiveEnemy extends Enemy {
  constructor(props) {
    super(props);

    this.wander_radius = 300;
    this.speed = 0.8;
    this.current_target = null;
  }

  find_target(map) {
    setTimeout(() => {
      this.current_target = this.find_target(map);
    }, random(6_000, 10_000));
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const x = this.pos.x + Math.cos(angle) * this.wander_radius;
      const y = this.pos.y + Math.sin(angle) * this.wander_radius;
      const point = createVector(x, y);
      const cell = this.map.path_grid.worldToGrid(point);
      if (this.map.path_grid.isWalkable(cell.x, cell.y)) return point;
    }
    return this.pos.copy();
  }

  get_target_point(player, map) {
    if (!this.current_target) this.current_target = this.find_target(map);
    return this.current_target;
  }
}
