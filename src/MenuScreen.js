class MenuScreen {
  constructor(dialogue, start_game) {
    this.dialogue = dialogue;
    this.start_game = start_game;

    this.in_credits = false;
    this.credits = new JL.Credits(CREDITS);

    this.start_rect = [
      width * 0.5,
      height * 0.55,
      450,
      (450 / images.buttons.start.width) * images.buttons.start.height
    ];
    this.credits_rect = [
      width * 0.5,
      height * 0.8,
      450,
      (450 / images.buttons.credits.width) * images.buttons.credits.height
    ];

    this.background = images['backgrounds'].menu;
  }

  handle_click() {
    if (this.in_credits) return this.credits.handle_click();

    if (this.mouse_over_rect(this.start_rect)) this.start_game();
    else if (this.mouse_over_rect(this.credits_rect)) {
      this.in_credits = true;
      this.credits.start().then(() => (this.in_credits = false));
    }
  }

  mouse_over_rect(rect) {
    const [x, y, w, h] = rect;
    if (mouseX * SCREEN_SCALE < x - w / 2) return false;
    if (mouseX * SCREEN_SCALE > x + w / 2) return false;
    if (mouseY * SCREEN_SCALE < y - h / 2) return false;
    if (mouseY * SCREEN_SCALE > y + h / 2) return false;
    return true;
  }

  show() {
    if (this.in_credits) return this.credits.show();

    imageMode(CORNER);
    image(this.background, 0, 0, width, height);

    imageMode(CENTER);
    image(images.buttons['start'], ...this.start_rect);
    image(images.buttons['credits'], ...this.credits_rect);

    // textSize(60);
    // textAlign(CENTER, CENTER);
    // strokeWeight(0);
    // fill(255);
    // textFont(fonts['bold']);
    // text('You are spaceship cat!', width * 0.5, height * 0.3);
    // textFont(fonts['regular']);

    image(images['square'], width / 2, height * 0.3);

    // push();
    // translate(150, 150);
    // rotate(this.cat_angle);
    // image(images['cat-profile'], 0, 0, 120, 120);
    // pop();

    // push();
    // translate(width - 150, 150);
    // rotate(-this.cat_angle);
    // image(images['cat-profile'], 0, 0, 120, 120);
    // pop();

    // imageMode(CENTER);
    // push();
    // translate(150, height - 150);
    // rotate(-this.cat_angle);
    // image(images['cat-profile'], 0, 0, 120, 120);
    // pop();

    // push();
    // translate(width - 150, height - 150);
    // rotate(this.cat_angle);
    // image(images['cat-profile'], 0, 0, 120, 120);
    // pop();
  }

  update() {
    if (this.in_credits) return;

    if (
      this.mouse_over_rect(this.credits_rect) ||
      this.mouse_over_rect(this.start_rect)
    )
      cursor('pointer');
  }
}
