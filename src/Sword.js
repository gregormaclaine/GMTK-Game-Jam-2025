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
    this.swing_speed = 0.4;

    this.hitbox = new HitBox();
    this.update_hitbox();
  }

  async swing() {
    if (this.swinging !== 0) return; // Already swinging
    this.swinging = this.arc_pos * -1;
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
      this.arc_pos += this.swinging * this.swing_speed;
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

  get arc_angle() {
    const mouse_angle = atan2(
      mouseY * SCREEN_SCALE - height / 2,
      mouseX * SCREEN_SCALE - width / 2
    );
    return mouse_angle + this.arc_pos * (PI / 4);
  }

  show() {
    push();
    translate(this.player.pos.x, this.player.pos.y);
    rotate(this.arc_angle);
    translate(this.arc_length, 0);
    rotate((3 * PI) / 4);

    imageMode(CENTER);
    image(images['sword'], 0, 0, this.size[0], this.size[1]);
    pop();

    this.hitbox.show();
  }
}
