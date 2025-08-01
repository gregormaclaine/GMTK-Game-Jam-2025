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
    this.max_speed = 5;
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
    this.hitbox.set_angle(this.vel.heading() + PI / 2);
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

  update() {
    this.sword.update();

    const goal_heading = createVector(
      keyIsDown(68) - keyIsDown(65),
      keyIsDown(83) - keyIsDown(87)
    );

    if (goal_heading.mag() > 0) {
      let angleDiff = goal_heading.heading() - this.vel.heading();
      angleDiff =
        abs(angleDiff) > PI
          ? angleDiff - TWO_PI * Math.sign(angleDiff)
          : angleDiff;
      const newHeading =
        this.vel.heading() +
        (abs(angleDiff) < 0.01 ? angleDiff : angleDiff * 0.15);
      this.vel = createVector(5, 0);
      this.vel.setHeading(newHeading);
    } else {
      this.vel.setMag(0.00001);
    }

    const delta_adjusted_vel = this.vel.copy();
    delta_adjusted_vel.mult(60 / (frameRate() || 1));

    this.pos.add(delta_adjusted_vel);
    this.force_on_screen();
    this.update_hitbox();
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);

    rotate(this.vel.mag() === 0 ? PI / 2 : this.vel.heading() + PI / 2);

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

    this.sword.show();
    this.hitbox.show();
  }
}
