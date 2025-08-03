class Enemy {
  static HEALTH_BAR_OFFSET = 20;

  constructor({
    image,
    pos,
    size,
    drops,
    death_sound = 'enemy-death.wav',
    on_death,
    health
  }) {
    this.image = image || images['square'];
    this.pos = createVector(pos[0], pos[1]);
    this.size = size || (image ? [image.width, image.height] : [50, 50]);
    this.hitbox = new HitBox(pos, this.size);
    this.vel = createVector(0, 0);
    this.speed = 2;

    this.health = health || 10_000;
    this.max_health = health || 10_000;

    this.slow_effect = false;

    this.death_fade = 1;
    this.death_sound = death_sound;
    this.on_death = on_death || (() => {});
    this.drops = drops || {};
    this.effects = [];
  }

  set_map(map) {
    this.map = map;
    this.path_finding = new PathFinder(map);
  }

  get deletable() {
    return this.health <= 0 && this.death_fade <= 0;
  }

  // Can be overridden if the enemy doesn't want to go exactly towards the player
  get_target_point(player, map) {
    return player.pos;
  }

  on_kill(player) {
    audio.play_sound(this.death_sound);
    this.map.spawn_resources_by_type(
      [this.pos.x, this.pos.y],
      player.collected,
      this.drops
    );
  }

  update(player, map) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.update();
      if (!effect.showing) this.effects.splice(i, 1);
    }

    if (this.health <= 0) {
      this.death_fade -= 0.01;
      this.on_death?.();
      this.on_death = null;
      return;
    }

    if (!map || !map.obstacles) {
      this.vel.setMag(0);
      return;
    }

    if (this.path_finding) {
      const target = this.get_target_point(player, map);

      if (target.dist(this.pos) > 10) {
        const direction = this.path_finding.get_direction(this.pos, target);
        this.vel = direction.setMag(this.speed * (this.slow_effect ? 0.5 : 1));
        this.pos.add(this.vel);
        this.hitbox.set_pos([this.pos.x, this.pos.y]);
      }
    } else {
      console.warn('Enemy pathfinding not set up');
    }

    // Handle collision with player's sword
    if (
      player.sword.hitbox.is_colliding(this.hitbox) &&
      player.sword.swinging
    ) {
      this.take_damage(player, map);
    }
  }

  take_damage(player, map, damage = 0) {
    damage = damage || (player ? player.sword.damage : 0);
    if (this.health <= 0) return;
    this.health -= damage;

    if (map.progression?.selected_ability === 'slow') {
      this.slow_effect = true;
      setTimeout(() => (this.slow_effect = false), 2000);
    }

    if (this.health <= 0) this.on_kill(player);
    const damage_effect = new DamageEffect(damage, this.pos.copy());
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
    if (this.slow_effect) {
      tint(160, 200, 255, 255); // Blue tint for slow effect
    }
    if (this.death_fade < 1) {
      tint(255, this.death_fade * 255);
    }
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);
    if (this.vel.x < 0) scale(-1, 1);

    image(this.image, 0, 0, this.size[0], this.size[1]);
    pop();

    this.effects.forEach(e => e.show());

    this.draw_health();
    this.hitbox.show();

    if (this.path_finding && SHOW_HITBOXES) this.path_finding.show();
  }
}
