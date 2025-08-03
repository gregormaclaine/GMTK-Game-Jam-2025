class BossEnemy extends Enemy {
  constructor({
    image,
    pos,
    size,
    drops,
    health = 200_000,
    on_death,
    can_shoot = false
  }) {
    super({ image, pos, size, drops, on_death, health });

    this.speed = 0.4;

    this.cooldown = new AbilityCooldown({
      cooldown: 5,
      start_cooldown: 5,
      run: props => {
        const should_shoot = this.can_shoot && random() > 0.5;
        should_shoot ? this.shoot(props) : this.charge(props);
      }
    });

    this.can_shoot = can_shoot;
    this.shoot_range = 500;

    this.attack_progress = 0;
    this.attack_duration = 0.5;
    this.attack_angle = PI / 5;

    this.bullets = [];
    this.bullet_speed = 10;
  }

  get deletable() {
    if (this.bullets.length > 0) return false;
    return super.deletable;
  }

  set_map(map) {
    super.set_map(map);
    this.path_finding.set_max_distance(800);
  }

  shoot(player) {
    audio.play_sound('shoot.wav');
    for (let i = -1; i < 2; i++) {
      const angle_offset = (PI / 5) * i;
      const dir = p5.Vector.sub(player.pos, this.pos);
      dir.rotate(angle_offset);
      const bullet = new Bullet({
        pos: this.pos.copy(),
        dir,
        speed: this.bullet_speed
      });
      this.bullets.push(bullet);
    }
  }

  charge() {
    audio.play_sound('scream.wav', 0.3);
    this.speed = 8;
    setTimeout(() => (this.speed = 0.25), 1000);
    setTimeout(() => (this.speed = 0.4), 1500);
  }

  get charging() {
    return this.speed > 2;
  }

  update(player, map) {
    super.update(player, map);

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(player, map);
      if (bullet.deletable) this.bullets.splice(i, 1);
    }

    if (this.health <= 0) return;

    this.cooldown.activate(player);
    this.cooldown.update();

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

    this.bullets.forEach(bullet => bullet.show());

    this.effects.forEach(e => e.show());

    this.draw_health();
    this.hitbox.show();

    if (this.path_finding && this.path_finding.path && SHOW_HITBOXES) {
      this.path_finding.show();
    }
  }
}
