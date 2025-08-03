class DamageTrail {
  constructor(pos = [0, 0]) {
    this.pos = pos;
    this.size = [80, 80];
    this.damage = 1000; // Per second

    this.hitbox = new HitBox(this.pos, this.size);
  }

  update(player, map) {
    const dmg = this.damage * (frameRate() / 1000);
    map.enemies.forEach(enemy => {
      if (this.hitbox.collides(enemy.hitbox))
        enemy.take_damage(player, map, dmg);
    });
  }

  show() {
    imageMode(CENTER);
    image(images['damage-trail'], ...this.pos, ...this.size);
  }
}
