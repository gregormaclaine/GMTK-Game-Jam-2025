class Bullet {
  constructor(pos, direction, speed, damage) {
    this.pos = pos;
    this.vel = direction.copy().setMag(speed);
    this.damage = damage;
    this.size = [10, 30];
    this.hitbox = new HitBox(this.pos, this.size);

    this.deletable = false;
  }

  update(player) {
    if (this.deletable) return;
    this.pos.add(this.vel);
    this.hitbox.set_pos([this.pos.x, this.pos.y]);

    // Check for collision with map obstacles
    if (this.hitbox.is_colliding(player.hitbox)) {
      player.take_damage(this.damage);
      this.destroy();
    }
  }

  show() {
    if (this.deletable) return;

    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + HALF_PI);
    image(images['bullet'], 0, 0, this.size[0], this.size[1]);
    pop();
  }

  destroy() {
    this.deletable = true;
  }
}

class RangedEnemy extends Enemy {
  constructor(pos, size) {
    super(images['ranger'], pos, size);

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

  update(player, map) {
    super.update(player, map);

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(player);
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
    const bullet = new Bullet(
      this.pos.copy(),
      p5.Vector.sub(player.pos, this.pos),
      this.bullet_speed,
      this.bullet_damage
    );
    this.bullets.push(bullet);
  }
}
