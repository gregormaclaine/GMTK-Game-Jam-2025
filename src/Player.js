class Player {
  constructor({ start_pos, die = () => {}, camera }) {
    this.pos = createVector(...start_pos);
    this.die = die;
    this.camera = camera;
    this.vel = createVector(0, 0);

    this.size = [140, 140];

    this.hitbox = new HitBox();
    this.update_hitbox();

    this.sword = new Sword(this);

    this.max_speed = 9;

    this.dash_amount = 0;
    this.dash_cooldown = new AbilityCooldown(5, color(255, 0, 0), () => {
      this.dash_amount = 1;
      audio.play_sound('boom.wav');
    });

    this.max_health = 3;
    this.health = this.max_health;
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
    this.hitbox.size = [this.size[0] - 10, this.size[1] - 10];
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

  handle_key_press() {
    if (keyCode === 32) this.dash_cooldown.activate();
    
    // DEV: Log collision box corners when 'L' key is pressed
    if (keyCode === DEV_LOG_HITBOX_KEY_CODE) {
      this.log_collision_box_corners();
    }
  }

  // DEV: Development helper to log collision box corner coordinates
  log_collision_box_corners() {
    const corners = this.hitbox.points;
    console.log('=== Player Collision Box Debug Info ===');
    console.log(`Player Center: x: ${this.pos.x.toFixed(2)}, y: ${this.pos.y.toFixed(2)}`);
    console.log(`Box Size: width: ${this.hitbox.size[0]}, height: ${this.hitbox.size[1]}`);
    console.log(`Box Angle: ${this.hitbox.angle.toFixed(2)} radians`);
    console.log('Corner Coordinates (clockwise from top-left):');
    console.log(`  Bottom Left:     x: ${corners[0].x.toFixed(2)}, y: ${corners[0].y.toFixed(2)}`);
    console.log(`  Bottom Right:    x: ${corners[1].x.toFixed(2)}, y: ${corners[1].y.toFixed(2)}`);
    console.log(`  Top Right: x: ${corners[2].x.toFixed(2)}, y: ${corners[2].y.toFixed(2)}`);
    console.log(`  Top Left:  x: ${corners[3].x.toFixed(2)}, y: ${corners[3].y.toFixed(2)}`);
    console.log('========================================');
  }

  update(obstacles) {
    const dir_vel = createVector(
      keyIsDown(68) - keyIsDown(65),
      keyIsDown(83) - keyIsDown(87)
    ).setMag(this.dash_amount ? this.max_speed * 20 : this.max_speed);
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
