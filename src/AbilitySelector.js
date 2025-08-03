class AbilitySelector {
  constructor({ progression, pos, ability, player }) {
    this.progression = progression;
    this.player = player;
    this.pos = pos;
    this.ability = ability;

    this.size = [140, 140];
    this.hitbox = new HitBox([this.pos.x, this.pos.y], this.size);
  }

  handle_key_press() {
    if (keyCode === 80 && this.player.hitbox.is_colliding(this.hitbox)) {
      if (this.progression.selected_ability === this.ability) {
        this.progression.selected_ability = null;
      } else {
        this.progression.selected_ability = this.ability;
      }
      audio.play_sound('pickup.wav');
    }
  }

  get image() {
    return images.abilities[this.ability] || images['square'];
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);
    image(this.image, 0, 0, this.size[0], this.size[1]);

    if (this.progression.selected_ability === this.ability) {
      stroke(255, 0, 0);
      strokeWeight(5);
      noFill();
      ellipse(0, 0, this.size[0] + 10, this.size[1] + 10);
    }
    pop();

    this.hitbox.show();
  }
}
