class Bullet {
  constructor({ pos, dir, speed, damage = 1, image = images['bullet'] }) {
    this.pos = pos;
    this.vel = dir.copy().setMag(speed);
    this.damage = damage;
    this.size = [10, 30];
    this.hitbox = new HitBox(this.pos, this.size);
    this.image = image;

    this.deletable = false;
  }

  update(player, map) {
    if (this.deletable) return;
    this.pos.add(this.vel);
    this.hitbox.set_pos([this.pos.x, this.pos.y]);

    if (map.progression?.selected_ability === 'slash') {
      // If the player has the slash ability, check for collision with the sword
      if (
        this.hitbox.is_colliding(player.sword.hitbox) &&
        player.sword.swinging
      ) {
        audio.play_sound('slash.wav', 0.3);
        this.destroy();
        return;
      }
    }

    // Check for collision with map obstacles
    if (this.hitbox.is_colliding(player.hitbox)) {
      player.take_damage(this.damage);
      this.destroy();
    }

    if (
      this.pos.x < -width / 2 ||
      this.pos.x > map.size[0] + width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > map.size[1] + height / 2
    ) {
      this.destroy();
    }
  }

  show() {
    if (this.deletable) return;

    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + HALF_PI);
    image(this.image, 0, 0, this.size[0], this.size[1]);
    pop();
  }

  destroy() {
    this.deletable = true;
  }
}

class RangedEnemy extends Enemy {
  constructor({ pos, size, drops, on_death }) {
    const image = Math.random() ? images['ranger_f'] : images['ranger_m'];
    super({ image, pos, size, drops, on_death });

    this.bullet_speed = 5;
    this.bullet_damage = 1;

    this.shoot_range = 500;
    this.last_shoot_time = -10000000000;

    this.bullets = [];
  }

  get deletable() {
    if (this.bullets.length > 0) return false;
    return super.deletable;
  }

  can_shoot(player) {
    const distance_to_player = p5.Vector.dist(this.pos, player.pos);
    if (distance_to_player > this.shoot_range) return false;
    return (
      this.last_shoot_time + 2000 < millis() && this.path_finding.is_direct
    );
  }

  get_target_point(player, map) {
    const playerPos = player.pos.copy();
    const enemyPos = this.pos.copy();
    const direction = p5.Vector.sub(enemyPos, playerPos).normalize();
    const radius = 300;
    const numChecks = 8;

    // Start with the point directly between enemy and player
    let bestPoint = null;
    let angleToPlayer = direction.heading();

    for (let i = 0; i <= numChecks; i++) {
      // Alternate right (+) and left (-) offsets
      for (let sign of [1, -1]) {
        const angleOffset = i === 0 ? 0 : sign * (PI / 16) * i;
        const checkAngle = angleToPlayer + angleOffset;
        const checkDir = p5.Vector.fromAngle(checkAngle);
        const checkPoint = p5.Vector.add(playerPos, checkDir.setMag(radius));
        const cell = map.path_grid.worldToGrid(checkPoint);
        if (map.path_grid.isWalkable(cell.x, cell.y)) {
          bestPoint = checkPoint;
          break;
        }
      }
      if (bestPoint) break;
    }
    return bestPoint || super.get_target_point(player, map);
  }

  update(player, map) {
    super.update(player, map);

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(player, map);
      if (bullet.deletable) this.bullets.splice(i, 1);
    }

    if (this.health <= 0) return;

    if (this.can_shoot(player)) {
      this.last_shoot_time = millis();
      this.shoot(player);
    }
  }

  show() {
    super.show();
    this.bullets.forEach(bullet => bullet.show());
  }

  shoot(player) {
    audio.play_sound('shoot.wav');
    const bullet = new Bullet({
      pos: this.pos.copy(),
      dir: p5.Vector.sub(player.pos, this.pos),
      speed: this.bullet_speed,
      damage: this.bullet_damage
    });
    this.bullets.push(bullet);
  }
}
