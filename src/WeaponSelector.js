class WeaponSelector {
  constructor({ progression, pos, sword, player, recipe }) {
    this.progression = progression;
    this.player = player;
    this.pos = pos;
    this.sword = sword;

    this.size = [70, 140];
    this.hitbox = new HitBox([this.pos.x, this.pos.y], this.size);

    this.needed_resources = recipe || {};
    this.recipe = recipe ? new Recipe({ pos, resources: recipe }) : null;
  }

  attempt_craft() {
    const resources = this.recipe?.resources || {};
    for (const [resource, amount] of Object.entries(resources)) {
      if (this.player.collected[resource] < amount) return false;
    }

    for (const [resource, amount] of Object.entries(resources)) {
      this.player.collected[resource] -= amount;
    }
    this.progression.unlocked_swords.push(this.sword);

    return true;
  }

  handle_key_press() {
    if (keyCode === 80 && this.player.hitbox.is_colliding(this.hitbox)) {
      if (!this.progression.unlocked_swords.includes(this.sword)) {
        if (this.attempt_craft()) {
          audio.play_sound('pickup.wav');
        } else {
          audio.play_sound('dud.wav');
        }
        return;
      }

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

    rotate(-PI / 4);

    if (!this.progression.unlocked_swords.includes(this.sword)) {
      image(images.lock, 0, 0, 100, 100);
    }

    pop();

    this.hitbox.show();
  }

  show_recipe() {
    if (this.progression.unlocked_swords.includes(this.sword)) return;
    push();
    translate(this.pos.x, this.pos.y);
    if (this.player.hitbox.is_colliding(this.hitbox)) {
      this.recipe.show();
    }
    pop();
  }
}
