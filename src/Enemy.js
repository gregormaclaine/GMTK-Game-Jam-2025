class Enemy {
  constructor(image, pos, size) {
    this.image = image || null; // Placeholder for enemy image
    this.pos = createVector(pos[0], pos[1]);
    this.size = size || (image ? [image.width, image.height] : [50, 50]);
    this.hitbox = new HitBox(pos, this.size);
    this.vel = createVector(0, 0);
    this.speed = 2;
  }

  update(player, map) {
    this.vel = this.get_path_find_direction(player.pos, map.obstacles).setMag(
      this.speed
    );
    this.pos.add(this.vel);
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
  }

  get_path_find_direction(target_pos, obstacles = []) {
    // Placeholder for pathfinding logic
    // This should return a vector direction towards the target_pos avoiding obstacles
    return p5.Vector.sub(target_pos, this.pos).normalize();
  }

  show() {
    push();
    fill('blue');
    stroke('black');
    translate(this.pos.x, this.pos.y);
    rectMode(CENTER);
    rect(0, 0, this.size[0], this.size[1]);
    pop();

    this.hitbox.show();
  }
}
