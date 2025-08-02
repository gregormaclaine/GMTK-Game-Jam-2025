class BoundaryCreatorTool {
  constructor({ camera }) {
    this.camera = camera;

    this.active = false;
    this.first_point = null;
  }

  toggle() {
    this.active = !this.active;
    this.first_point = null;

    if (this.active) {
      console.log('🔨 BOUNDARY CREATION MODE ACTIVATED');
      console.log(
        'Click to set the top-left corner, then click again for bottom-right corner'
      );
    } else {
      console.log('🔨 BOUNDARY CREATION MODE DEACTIVATED');
    }
  }

  handle_click() {
    const [worldX, worldY] = this.camera.get_map_mouse_pos();

    if (!this.first_point) {
      this.first_point = [worldX, worldY];
      console.log(
        `📍 First point set at: x: ${round(worldX)}, y: ${round(worldY)}`
      );
      console.log('Click again to set the bottom-right corner');
    } else {
      this.create_code(this.first_point, [worldX, worldY]);
      this.first_point = null;
    }
  }

  create_code(topLeft, bottomRight) {
    // Calculate position (top-left corner) and size
    const pos = [round(topLeft[0]), round(topLeft[1])];
    const width = round(bottomRight[0] - topLeft[0]);
    const height = round(bottomRight[1] - topLeft[1]);
    const size = [abs(width), abs(height)];

    // Adjust position if user clicked bottom-right to top-left
    if (width < 0) pos[0] = round(bottomRight[0]);
    if (height < 0) pos[1] = round(bottomRight[1]);

    const codeString = `map.add_obstacle({ pos: [${pos[0]}, ${pos[1]}], size: [${size[0]}, ${size[1]}] });`;

    console.log('🎯 BOUNDARY CREATED:');
    console.log(`📋 Copy this line to your Maps.js file:`);
    console.log(
      `%c${codeString}`,
      'background: #222; color: #bada55; padding: 2px 5px; border-radius: 3px;'
    );
    console.log(`📐 Dimensions: ${size[0]}x${size[1]} pixels`);
    console.log('---');
  }

  show_boundary() {
    if (!this.active) return;

    // Show first point marker if set
    if (this.first_point) {
      stroke(255, 0, 0);
      strokeWeight(3);
      fill(255, 0, 0, 100);
      circle(this.first_point[0], this.first_point[1], 10);

      // Show preview rectangle from first point to current mouse position
      const [mouseX, mouseY] = this.camera.get_map_mouse_pos();
      stroke(255, 255, 0, 150);
      strokeWeight(2);
      fill(255, 255, 0, 50);
      rectMode(CORNERS);
      rect(this.first_point[0], this.first_point[1], mouseX, mouseY);
    }

    // Show current mouse position marker
    const [currentMouseX, currentMouseY] = this.camera.get_map_mouse_pos();
    stroke(0, 255, 0);
    strokeWeight(2);
    fill(0, 255, 0, 100);
    circle(currentMouseX, currentMouseY, 8);
  }

  show_hud() {
    if (!this.active) return;

    push();
    fill(0, 0, 0, 180);
    stroke(255, 255, 0);
    strokeWeight(2);
    rectMode(CORNER);
    rect(10, 10, 400, this.first_point ? 80 : 60);

    fill(255, 255, 0);
    strokeWeight(0);
    textAlign(LEFT, TOP);
    textSize(16);
    text('🔨 BOUNDARY CREATION MODE', 20, 25);

    textSize(12);
    if (this.first_point) {
      text('Step 2: Click to set bottom-right corner', 20, 45);
      text('Press K to cancel', 20, 60);
    } else {
      text('Step 1: Click to set top-left corner', 20, 45);
    }
    pop();
  }
}
