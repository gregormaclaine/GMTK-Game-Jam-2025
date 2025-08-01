class Player {
  constructor({ start_pos, die = () => {}, camera }) {
    this.pos = createVector(...start_pos);
    this.die = die;
    this.camera = camera;
    this.vel = createVector(0, 0);

    this.size = [90, 120];

    this.hitbox = new HitBox();
    this.update_hitbox();

    this.sword = new Sword(this);

    this.health = 4;
    this.max_speed = 9;
  }

  get image() {
    return images['player'];
  }

  take_damage() {
    if (this.immune || this.invincible) return false;
    this.immune = true;

    this.health--;
    if (this.health > 0)
      audio.play_sound(
        ['meteor_hit_3.wav', 'meteor_hit_2.wav', 'meteor_hit_1.wav'][
          this.health - 1
        ]
      );

    if (this.health === 0) {
      audio.play_sound('ship_explosion.wav');
      this.die();
    }

    setTimeout(() => (this.immune = false), 1000);
    return true;
  }

  gain_health() {
    if (this.health >= 4) return;
    if (this.health <= 0) return;
    this.health++;
    audio.play_sound(
      ['pickup_health_3.wav', 'pickup_health_2.wav', 'pickup_health_1.wav'][
        this.health - 2
      ]
    );
  }

  update_hitbox() {
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
    this.hitbox.size = this.size;
  }

  force_on_screen() {
    const bounds = this.camera.bounds();

    if (this.pos.x + this.size[0] / 2 > bounds[2]) {
      this.pos.x = bounds[2] - this.size[0] / 2;
    }

    if (this.pos.x - this.size[0] / 2 < bounds[0]) {
      this.pos.x = bounds[0] + this.size[0] / 2;
    }

    if (this.pos.y + this.size[1] / 2 > bounds[3]) {
      this.pos.y = bounds[3] - this.size[1] / 2;
    }

    if (this.pos.y - this.size[1] / 2 < bounds[1]) {
      this.pos.y = bounds[1] + this.size[1] / 2;
    }
  }

  update(obstacles) {
    const dir_vel = createVector(
      keyIsDown(68) - keyIsDown(65),
      keyIsDown(83) - keyIsDown(87)
    ).setMag(this.max_speed);

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

    this.sword.update();
  }

  show(is_paused = false) {
    push();
    translate(this.pos.x, this.pos.y);
    scale(this.vel.x < 0 ? -1 : 1, 1);

    imageMode(CENTER);
    image(this.image, 0, 0, this.size[0], this.size[1]);
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

    this.sword.show(is_paused);
    this.hitbox.show();
  }
}
