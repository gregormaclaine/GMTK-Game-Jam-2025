class GameMap {
  constructor({ background, size, color, start_pos, level }) {
    this.level = level || 1;
    this.background = background;
    this.progression = null;
    this.size =
      size ||
      (background ? [background.width, background.height] : [3000, 3000]);
    this.color = color || '#000000';
    this.start_pos =
      start_pos || createVector(this.size[0] / 2, this.size[1] / 2);

    this.obstacles = [];
    this.enemies = [];
    this.barrels = [];
    this.resources = [];
    this.triggers = [];

    this.path_grid = new PathfindingGrid(this.size);

    this.complete = () => {};
    this.completion_promise = new Promise(resolve => {
      this.complete = resolve;
    });
  }

  set_progression(progression) {
    this.progression = progression;
    return this;
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
      hitbox,
      deleted: false,
      delete() {
        this.deleted = true;
      }
    };
    this.obstacles.push(obstacle);
    this.path_grid.markObstacle(obstacle);
    return obstacle;
  }

  add_enemy(enemy) {
    this.enemies.push(enemy);
    enemy.set_map(this);
    return enemy;
  }

  spawn_resources_by_type(pos = [0, 0], collected, resources) {
    for (const resource in resources) {
      const count = resources[resource];
      for (let i = 0; i < count; i++) {
        this.spawn_resource(Resource.get(resource, pos, collected));
      }
    }
  }

  spawn_resource(resource) {
    this.resources.push(resource);
  }

  add_trigger({ pos, size, on_enter }) {
    const hitbox = new HitBox(
      [pos[0] + size[0] / 2, pos[1] + size[1] / 2],
      size
    );
    const trigger = { hitbox, on_enter };
    this.triggers.push(trigger);
    return trigger;
  }

  show_sprites() {
    this.barrels.forEach(barrel => barrel.show());
    this.enemies.forEach(enemy => enemy.show());
    this.resources.forEach(resource => resource.show());
    this.triggers.forEach(trigger => trigger.hitbox.show('yellow'));
  }

  update_sprites(player) {
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      if (obstacle.deleted) {
        this.obstacles.splice(i, 1);
        this.path_grid.markObstacle(obstacle, true);
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(player, this);
      if (enemy.deletable) this.enemies.splice(i, 1);
    }

    for (let i = this.barrels.length - 1; i >= 0; i--) {
      const barrel = this.barrels[i];
      barrel.update(player, this);
      if (barrel.state === 'hidden') this.barrels.splice(i, 1);
    }

    for (let i = this.resources.length - 1; i >= 0; i--) {
      const resource = this.resources[i];
      resource.update(player);
      if (resource.gone) this.resources.splice(i, 1);
    }

    for (let i = this.triggers.length - 1; i >= 0; i--) {
      const trigger = this.triggers[i];
      if (trigger.hitbox.contains_point(player.pos)) {
        trigger.on_enter();
        this.triggers.splice(i, 1);
      }
    }
  }
}
