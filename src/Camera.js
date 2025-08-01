class Camera {
  constructor() {
    this.pos = createVector(0, 0);
    this.background = images['background'];
    this.background_size = [width * 4, height * 4];
    this.start_pos = createVector(width, height);
    this.surrounding_color = color(0, 0, 0, 200);
  }

  set_pos(pos) {
    this.pos = pos.copy();
    // this.pos.x = constrain(pos.x, 0, this.background_size[0]);
    // this.pos.y = constrain(pos.y, 0, this.background_size[1]);
  }

  bounds() {
    return [0, 0, this.background_size[0], this.background_size[1]];
  }

  show() {
    background(this.surrounding_color);
    imageMode(CORNER);
    image(
      this.background,
      -this.pos.x + width / 2,
      -this.pos.y + height / 2,
      this.background_size[0],
      this.background_size[1]
    );

    translate(-this.pos.x + width / 2, -this.pos.y + height / 2);
  }
}
