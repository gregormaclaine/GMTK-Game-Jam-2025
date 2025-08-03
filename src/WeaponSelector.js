class WeaponSelector {
  constructor({ progression, pos, sword, player }) {
    this.progression = progression;
    this.player = player;
    this.pos = pos;
    this.sword = sword;

    this.size = [70, 140];
    this.hitbox = new HitBox([this.pos.x, this.pos.y], this.size);
  }

  handle_key_press() {
    if (keyCode === 80 && this.player.hitbox.is_colliding(this.hitbox)) {
      this.progression.selected_weapon = this.sword;
      this.player.sword.change_sword(this.sword);
      audio.play_sound('pickup.wav');
    }
  }

  get image() {
    return images.swords[this.sword] || images['square'];
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(PI / 4);
    imageMode(CENTER);
    image(this.image, 0, 0, this.size[0], this.size[1]);

    if (this.progression.selected_weapon === this.sword) {
      stroke(255, 0, 0);
      strokeWeight(5);
      noFill();
      ellipse(0, 0, this.size[0] + 30, this.size[1] + 30);
    }
    pop();

    this.hitbox.show();
  }
}
