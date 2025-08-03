class GameWinScene {
  constructor(return_to_menu) {
    this.back_button = new JL.Button(
      'Return to Hub',
      [width / 2, height * 0.55, 400, 100],
      return_to_menu
    );

    this.played = false;
  }

  handle_click() {
    this.back_button.handle_click();
  }

  show() {
    if (!this.played) {
      this.played = true;
      audio.play_sound('cheer.wav');
    }

    background(0);

    textSize(90);
    fill('white');
    textAlign(CENTER, CENTER);
    text('YOU WIN!', width / 2, height * 0.4);

    fill(0);
    stroke(0);
    strokeWeight(3);
    this.back_button.show();
  }

  update() {}
}
