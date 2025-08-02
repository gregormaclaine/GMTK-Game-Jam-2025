class BossEnemy extends Enemy {
  constructor({ image, pos, size, drops, health = 200_000, on_death }) {
    super({ image, pos, size, drops, on_death });

    this.speed = 0.4;

    this.health = health;
    this.max_health = health;

    this.last_charge = -1000000;

    this.attack_progress = 0;
    this.attack_duration = 0.5;
    this.attack_angle = PI / 5;
  }

  set_map(map) {
    super.set_map(map);
    this.path_finding.set_max_distance(800);
  }

  charge() {
    if (!this.path_finding.is_direct) return;
    if (this.last_charge + 5000 > millis()) return;

    this.last_charge = millis();
    audio.play_sound('scream.wav', 0.3);
    setTimeout(() => (this.speed = 7), 200);
    setTimeout(() => {
      this.speed = 0.25;
      // audio.play_sound('boom.wav', 0.5);
    }, 1000);
    setTimeout(() => (this.speed = 0.4), 1500);
  }

  get charging() {
    return this.speed > 2;
  }

  update(player, map) {
    super.update(player, map);

    if (this.health <= 0) return;

    this.charge();

    if (this.hitbox.is_colliding(player.hitbox)) {
      if (this.attack_progress === 0) {
        this.attack_progress += this.attack_duration / frameRate();
        player.take_damage(1);
      }
    }
  }

  show() {
    if (this.death_fade <= 0) return;

    push();
    if (this.death_fade < 1) {
      tint(255, this.death_fade * 255);
    }
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);

    if (this.vel.x < 0) scale(-1, 1);

    if (this.charging) {
      rotate(random(-0.1, 0.1));
    } else if (this.attack_progress) {
      if (this.attack_progress < 0.5) {
        rotate(this.attack_angle * this.attack_progress);
      } else if (this.attack_progress <= 1) {
        rotate(this.attack_angle * (1 - this.attack_progress));
      }
      this.attack_progress += 1 / this.attack_duration / frameRate();

      if (this.attack_progress > 3) this.attack_progress = 0;
    }

    image(this.image, 0, 0, this.size[0], this.size[1]);
    pop();

    this.effects.forEach(e => e.show());

    this.draw_health();
    this.hitbox.show();

    if (this.path_finding && this.path_finding.path && SHOW_HITBOXES) {
      this.path_finding.show();
    }
  }
}
