class Sword {
  constructor(player) {
    this.player = player;
    this.size = [80, 80];
    this.cooldown = 500; // Cooldown time in milliseconds
    this.last_used = 0; // Timestamp of the last use

    this.arc_pos = -1; // -1 for left, 1 for right
    this.arc_length = 110;
    this.swinging = 0; // 0 for not swinging, 1 for swinging right, -1 for swinging left
    this.swing_callback = null;
    this.swing_speed = 10;

    this.hitbox = new HitBox();
    this.update_hitbox();

    this.indicator_size = 35;

    this.damage = 1000;

    this.last_swing_time = 0; // Timestamp of the last swing
  }

  async swing() {
    if (this.swinging !== 0) return; // Already swinging
    this.last_swing_time = millis();
    this.swinging = this.arc_pos * -1;
    audio.play_sound('boom.wav', 0.1);
    return new Promise(resolve => {
      this.swing_callback = resolve;
    });
  }

  update_hitbox() {
    const sword_pos = this.player.pos.copy();
    sword_pos.x += this.arc_length * cos(this.arc_angle);
    sword_pos.y += this.arc_length * sin(this.arc_angle);
    this.hitbox.set_pos([sword_pos.x, sword_pos.y]);
    this.hitbox.size = [95, 25];
    this.hitbox.set_angle(this.arc_angle);
  }

  update() {
    if (this.swinging) {
      this.arc_pos += (this.swinging * this.swing_speed) / frameRate();
      if (abs(this.arc_pos) >= 1) {
        this.arc_pos = this.arc_pos >= 1 ? 1 : -1; // Reset position
        this.swinging = 0; // Stop swinging when the arc is complete
        if (this.swing_callback) {
          this.swing_callback();
          this.swing_callback = null;
        }
      }
    }

    this.update_hitbox();
  }

  get mouse_angle() {
    return atan2(
      mouseY * SCREEN_SCALE - height / 2,
      mouseX * SCREEN_SCALE - width / 2
    );
  }

  get arc_angle() {
    return this.mouse_angle + this.arc_pos * (PI / 4);
  }

  show(is_paused = false) {
    push();
    const time_since_last_swing = millis() - this.last_swing_time;
    if (time_since_last_swing > 3000) {
      tint(255, Math.max(0, (4000 - time_since_last_swing) / 10));
    }

    translate(this.player.pos.x, this.player.pos.y);
    rotate(this.arc_angle);
    translate(this.arc_length, 0);
    rotate((3 * PI) / 4);

    imageMode(CENTER);
    image(images['sword'], 0, 0, this.size[0], this.size[1]);
    pop();

    push();
    translate(this.player.pos.x, this.player.pos.y);
    rotate(this.mouse_angle);
    translate(this.arc_length + this.size[0] / 2, 0);
    rotate(PI / 2);

    imageMode(CENTER);
    image(images['indicator'], 0, 0, this.indicator_size, this.indicator_size);
    pop();

    this.hitbox.show();
  }
}
