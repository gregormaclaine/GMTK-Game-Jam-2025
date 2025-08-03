class Recipe {
  constructor({ pos, resources }) {
    this.pos = pos;
    this.resources = resources;
    this.width = 180;
    this.resource_height = 50;
    this.v_gap = 5;
  }

  show() {
    push();
    imageMode(CORNER);
    rectMode(CORNER);

    const kinds = Object.keys(this.resources).length;
    const height = this.resource_height * (kinds + 1);
    strokeWeight(0);
    fill(0, 150);
    rect(0, 0, this.width, height);

    const resources = Object.entries(this.resources);
    for (let i = 0; i < kinds; i++) {
      const [resource, amount] = resources[i];
      image(
        images.resources[resource],
        10,
        i * this.resource_height + this.v_gap,
        this.resource_height - this.v_gap,
        this.resource_height - this.v_gap
      );

      fill(255);
      textAlign(LEFT, CENTER);
      text(
        amount,
        this.resource_height - this.v_gap + 40,
        (i + 0.5) * this.resource_height - 3
      );
    }

    translate(0, height - 30);
    textSize(15);
    text('Press P to craft', 20, 0);

    pop();
  }
}
