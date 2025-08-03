class DamageTrail {
  constructor(pos) {
    this.pos = pos;
    this.size = [100, 100];
    this.damage = 400; // Per second

    this.hitbox = new HitBox([this.pos.x, this.pos.y], this.size);
    this.progress = 0;
    this.duration = 1;
  }

  update(player, map) {
    if (this.progress >= 1) return;
    this.progress += 1 / frameRate() / this.duration;
    const dmg = round(this.damage * (frameRate() / 1000));
    map.enemies.forEach(enemy => {
      if (this.hitbox.is_colliding(enemy.hitbox))
        enemy.take_damage(player, map, dmg);
    });
  }

  deletable() {
    return this.progress >= 1;
  }

  show() {
    if (this.progress >= 1) return;
    push();
    tint(255, lerp(255, 50, this.progress));
    imageMode(CENTER);
    image(
      images['damage-trail'] || images['square'],
      this.pos.x,
      this.pos.y,
      ...this.size
    );
    pop();
  }
}
