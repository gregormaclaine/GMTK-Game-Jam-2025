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
  }

  async swing() {
    if (this.swinging !== 0) return; // Already swinging
    console.log('Swinging sword');
    this.swinging = this.arc_pos * -1;
    return new Promise(resolve => {
      this.swing_callback = resolve;
    });
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
  }

  show() {
    push();
    translate(this.player.pos.x, this.player.pos.y);
    rotate(this.player.vel.heading() + this.arc_pos * (PI / 4));
    translate(this.arc_length, 0);
    rotate((3 * PI) / 4);

    // rotate(this.angle);

    imageMode(CENTER);
    image(images['sword'], 0, 0, this.size[0], this.size[1]);
    pop();
  }
}
