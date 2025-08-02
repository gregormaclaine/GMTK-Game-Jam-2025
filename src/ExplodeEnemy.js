class ExplodeEnemy extends Enemy {
  constructor(pos, map) {
    super(null, pos, map);
    this.image = images['exploder'];
    this.health = 10_000;
    this.exploding = false;
    this.explode_timer = 0;

    this.explode_effect = new ParticleEffect(images['explosion']);
  }

  update(player, map) {
    this.explode_effect.update();
    super.update(player, map);

    if (this.health <= 0) return;

    if (this.hitbox.is_colliding(player.hitbox)) {
      this.explode();
      player.take_damage(1);
    }
  }

  show() {
    if (this.exploding) this.explode_effect.show(false, false, 'grow');
    super.show();
  }

  async explode() {
    this.health = 0;
    this.death_fade = 0.4;
    this.exploding = true;
    audio.play_sound('boom.wav');
    await this.explode_effect.trigger([this.pos.x, this.pos.y]);
    this.exploding = false;
  }

  get deletable() {
    if (this.exploding) return false;
    return super.deletable;
  }
}
