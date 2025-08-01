class Camera {
  constructor(game_manager) {
    this.game_manager = game_manager;
    this.pos = createVector(0, 0);
  }

  set_pos(pos) {
    this.pos = pos.copy();
  }

  get map() {
    return this.game_manager.map;
  }

  bounds() {
    return [0, 0, this.map?.size[0] || 0, this.map?.size[1] || 0];
  }

  get_map_mouse_pos() {
    return [
      mouseX * SCREEN_SCALE + this.pos.x - width / 2,
      mouseY * SCREEN_SCALE + this.pos.y - height / 2
    ];
  }

  show() {
    if (this.map) {
      background(this.map.color);
      imageMode(CORNER);
      image(
        this.map.background,
        -this.pos.x + width / 2,
        -this.pos.y + height / 2,
        this.map.size[0],
        this.map.size[1]
      );
    }

    translate(-this.pos.x + width / 2, -this.pos.y + height / 2);

    this.map?.obstacles.forEach(obstacle => {
      imageMode(CORNER);
      if (obstacle.image)
        image(
          obstacle.image,
          obstacle.pos.x,
          obstacle.pos.y,
          obstacle.size[0],
          obstacle.size[1]
        );
      obstacle.hitbox.show();
    });
  }
}
