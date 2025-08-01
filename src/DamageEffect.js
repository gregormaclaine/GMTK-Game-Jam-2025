class DamageEffect {
  static POS_OFFSET = 30;

  constructor(damage, pos) {
    this.damage = damage;
    this.pos = pos;
    this.pos.add(
      createVector(
        random(-DamageEffect.POS_OFFSET, DamageEffect.POS_OFFSET),
        random(-DamageEffect.POS_OFFSET, DamageEffect.POS_OFFSET)
      )
    );
    this.size = 20;
    // this.dir = createVector(random(-0.1, 0.1), random(0, -0.1)).normalize();
    this.duration = 2;

    this.showing = false;
    this.progress = 0;
    this.end_effect = () => {};

    this.color = color(random(200, 255), random(0, 100), random(0, 100));
  }

  async trigger() {
    this.showing = true;
    this.progress = 0;
    await new Promise(resolve => (this.end_effect = resolve));
    this.showing = false;
  }

  show(fade = true) {
    // const y_offset = lerp(0, this.distance, this.progress);
    const y_offset = -30;
    push();
    if (fade) tint(255, lerp(255, 0, this.progress));
    // if (spin) rotate(lerp(0, 2 * PI, this.progress));

    textSize(lerp(40, 1, this.progress));
    fill(this.color);
    strokeWeight(0);
    textAlign(CENTER, CENTER);
    text(this.damage + '', this.pos.x, this.pos.y);
    pop();
  }

  update() {
    this.progress += 1 / frameRate() / this.duration;
    // const vel = this.dir.copy();
    // vel.mult(60 / (frameRate() || 1));
    // this.pos.add(vel);

    this.pos.add();
    if (this.progress >= 1) {
      this.end_effect();
    }
  }
}
