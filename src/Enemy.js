class Enemy {
  static HEALTH_BAR_OFFSET = 20;

  constructor(image, pos, size) {
    this.image = image || null; // Placeholder for enemy image
    this.pos = createVector(pos[0], pos[1]);
    this.size = size || (image ? [image.width, image.height] : [50, 50]);
    this.hitbox = new HitBox(pos, this.size);
    this.vel = createVector(0, 0);
    this.speed = 2;

    this.health = 10000;
    this.max_health = 10000;

    this.death_fade = 1;

    this.effects = [];
  }

  get deletable() {
    return this.health <= 0 && this.death_fade <= 0;
  }

  update(player, map) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.update();
      if (!effect.showing) this.effects.splice(i, 1);
    }

    if (this.health <= 0) {
      this.death_fade -= 0.01;
      return;
    }

    this.vel = this.get_path_find_direction(player.pos, map.obstacles).setMag(
      this.speed
    );
    this.pos.add(this.vel);
    this.hitbox.set_pos([this.pos.x, this.pos.y]);

    if (
      player.sword.hitbox.is_colliding(this.hitbox) &&
      player.sword.swinging
    ) {
      this.take_damage(player.sword.damage);
    }
  }

  get_path_find_direction(target_pos, obstacles = []) {
    // Placeholder for pathfinding logic
    // This should return a vector direction towards the target_pos avoiding obstacles
    return p5.Vector.sub(target_pos, this.pos).normalize();
  }

  take_damage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      // Handle enemy death
    }
    const damage_effect = new DamageEffect(amount, this.pos.copy());
    this.effects.push(damage_effect);
    damage_effect.trigger();
  }

  draw_health() {
    if (this.health === this.max_health) return;
    push();
    fill('red');
    noStroke();
    rectMode(CORNER);
    rect(
      this.pos.x - this.size[0] / 2,
      this.pos.y - this.size[1] / 2 - Enemy.HEALTH_BAR_OFFSET,
      this.size[0],
      5
    );
    if (this.health >= 0) {
      fill('green');
      rect(
        this.pos.x - this.size[0] / 2,
        this.pos.y - this.size[1] / 2 - Enemy.HEALTH_BAR_OFFSET,
        (this.health / this.max_health) * this.size[0],
        5
      );
    }
    pop();
  }

  show() {
    if (this.death_fade <= 0) return;

    push();
    if (this.death_fade < 1) {
      tint(255, this.death_fade * 255);
    }
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);
    image(images['square'], 0, 0, this.size[0], this.size[1]);
    pop();

    this.effects.forEach(e => e.show());

    this.draw_health();
    this.hitbox.show();
  }
}
