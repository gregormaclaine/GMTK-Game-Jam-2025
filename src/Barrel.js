class Barrel {
  constructor(pos, contents = []) {
    this.pos = pos;
    this.size = [50, 50];
    this.image = images['barrel'];
    this.hitbox = new Hitbox(this.pos, this.size);
  }

  show() {
    imageMode(CENTER);
    image(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y);
    this.hitbox.show();
  }
}
