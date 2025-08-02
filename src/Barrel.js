class Barrel {
  constructor(pos, contents) {
    this.pos = pos;
    this.size = [100, 100];
    this.contents = contents;
    this.hitbox = new HitBox(this.pos, this.size);
    this.state = 'intact'; // 'intact' | 'broken' | 'hidden'

    this.opacity = 255;
    this.fade_speed = 2; // Speed at which the barrel fades out
  }

  break(player, map) {
    this.state = 'broken';
    audio.play_sound('barrel-break.wav');
    map.spawn_resource(Resource.get_wood(this.pos, player));
  }

  update(player, map) {
    if (
      this.state === 'intact' &&
      this.hitbox.is_colliding(player.sword.hitbox) &&
      player.sword.swinging
    ) {
      this.break(player, map);
    } else if (this.state === 'broken') {
      this.opacity -= this.fade_speed;
      if (this.opacity <= 0) {
        this.state = 'hidden';
        this.opacity = 0;
      }
    }
  }

  show() {
    if (this.state === 'hidden') return;
    push();
    imageMode(CENTER);
    tint(255, this.opacity);
    image(
      images['barrels'][this.state === 'intact' ? 0 : 1],
      this.pos[0],
      this.pos[1],
      this.size[0],
      this.size[1]
    );
    pop();
    if (this.state === 'intact') this.hitbox.show();
  }
}
