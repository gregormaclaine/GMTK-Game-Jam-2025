class Player {
  constructor({ start_pos, die = () => {}, bounds, in_menu = false }) {
    this.pos = createVector(...start_pos);
    this.die = die;
    this.bounds = bounds;
    this.vel = createVector(0, 0);

    this.size = [140, 140];

    this.hitbox = new HitBox();
    this.update_hitbox();

    this.sword = in_menu ? null : new Sword(this);

    this.max_speed = 9;

    this.dash_amount = 0;
    this.dash_cooldown = new AbilityCooldown(5, color(255, 0, 0), () => {
      this.dash_amount = 6;
      audio.play_sound('dash.wav');
    });

    this.max_health = 3;
    this.health = this.max_health;
  }

  set_bounds(bounds) {
    this.bounds = bounds;
  }

  set_pos(pos = [0, 0]) {
    this.pos.set(pos);
    this.update_hitbox();
  }

  get image() {
    return images['player'];
  }

  take_damage(amount) {
    audio.play_sound('damage.wav');
    this.health -= amount;
    if (this.health <= 0) this.die();
  }

  update_hitbox() {
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
    this.hitbox.size = [this.size[0] - 50, this.size[1] - 10];
  }

  force_on_screen() {
    if (this.pos.x + this.size[0] / 2 > this.bounds[2]) {
      this.pos.x = this.bounds[2] - this.size[0] / 2;
    }

    if (this.pos.x - this.size[0] / 2 < this.bounds[0]) {
      this.pos.x = this.bounds[0] + this.size[0] / 2;
    }

    if (this.pos.y + this.size[1] / 2 > this.bounds[3]) {
      this.pos.y = this.bounds[3] - this.size[1] / 2;
    }

    if (this.pos.y - this.size[1] / 2 < this.bounds[1]) {
      this.pos.y = this.bounds[1] + this.size[1] / 2;
    }
  }

  handle_key_press() {
    if (keyCode === 32) this.dash_cooldown.activate();
  }

  update(obstacles) {
    const dir_vel = createVector(
      keyIsDown(68) - keyIsDown(65),
      keyIsDown(83) - keyIsDown(87)
    ).setMag(this.dash_amount ? this.max_speed * 4 : this.max_speed);
    if (this.dash_amount > 0) this.dash_amount--;

    this.dash_cooldown.update();

    if (dir_vel.mag() > 0) {
      this.vel = dir_vel;
    } else {
      this.vel.setMag(0.00001);
    }

    const delta_adjusted_vel = this.vel.copy();
    delta_adjusted_vel.mult(60 / (frameRate() || 1));

    this.pos.add(delta_adjusted_vel);

    obstacles.forEach(obstacle => {
      const offset = obstacle.hitbox.repel(this.hitbox);
      this.pos.add(offset);
    });

    this.force_on_screen();
    this.update_hitbox();

    this.sword?.update();
  }

  show(is_paused = false) {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.vel.x < 0 ? -1 : 1, 1);

    imageMode(CENTER);
    image(this.image, 0, 0, this.size[0], this.size[1]);

    // Draw the ranger radius
    // noFill();
    // stroke(0, 255, 0);
    // strokeWeight(2);
    // circle(0, 0, 600);

    pop();

    // if (this.invincible) {
    //   tint(255, 200);
    //   imageMode(CENTER);
    //   image(
    //     images['force-field'],
    //     this.pos.x,
    //     this.pos.y,
    //     this.size[0] * growth,
    //     this.size[1] * growth
    //   );
    //   tint(255, 255);
    // }

    this.sword?.show(is_paused);
    this.hitbox.show();
  }

  draw_health() {
    const heartSize = 80;
    const gap = 20;
    const totalWidth =
      this.max_health * heartSize + (this.max_health - 1) * gap;
    const startX = width / 2 - totalWidth / 2;
    const y = height - heartSize - 20;

    imageMode(CORNER);
    for (let i = 0; i < this.health; i++) {
      image(
        images['heart'],
        startX + i * (heartSize + gap),
        y,
        heartSize,
        heartSize
      );
    }
  }
}
