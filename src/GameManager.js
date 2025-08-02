class GameManager {
  constructor({ dialogue }) {
    this.dialogue = dialogue;

    this.map = null;
    this.camera = new Camera(this);
    this.pause_modal = new PauseModal();

    this.reset();
  }

  reset() {
    this.state = 'game';
    this.level_promise = null;
    this.on_finish_level = null;
    this.player = new Player({
      start_pos: [width / 2, height / 2],
      camera: this.camera,
      die: () => {
        if (this.on_finish_level) this.on_finish_level();
        this.on_finish_level = null;
      }
    });

    // DEV: Boundary creation state
    this.dev_boundary_mode = false;
    this.dev_boundary_first_point = null;
  }

  set_map(map) {
    this.map = map;
    this.camera.set_pos(createVector(...map.start_pos));
    this.player.pos.set(map.start_pos);
    this.player.update_hitbox();
  }

  async run_level(level) {
    console.log(`Running level ${level}`);
    this.reset();

    let level_ended = { val: false };
    this.level_promise = new Promise(resolve => {
      this.on_finish_level = () => {
        level_ended.val = true;
        resolve();
      };
    });

    switch (level) {
      case 1:
        // this.audio.play_track('hell-3.mp3', true);
        this.set_map(Maps[0]());
        await this.map.completion_promise;
        break;
    }

    if (!level_ended.val && this.on_finish_level) this.on_finish_level();
  }

  handle_click() {
    if (this.state === 'pause') return this.pause_modal.handle_click();

    // DEV: Handle boundary creation mode clicks
    if (this.dev_boundary_mode) {
      this.handle_boundary_click();
      return;
    }

    this.player.sword.swing();
  }

  handle_key_press() {
    if (this.state === 'pause') return this.pause_modal.handle_key_press();

    if (['game'].includes(this.state)) {
      const prev_state = this.state;
      if (keyCode === PAUSE_KEY_CODE) {
        this.pause_modal.open(() => (this.state = prev_state));
        return (this.state = 'pause');
      }

      // DEV: Toggle boundary creation mode with 'K' key
      if (keyCode === DEV_BOUNDARY_CREATE_KEY_CODE) {
        this.toggle_boundary_mode();
        return;
      }

      this.player.handle_key_press();
    }
  }

  show() {
    push();
    this.camera.show();
    this.map?.show_sprites();
    this.player.show(this.state === 'pause');
    
    // DEV: Visual feedback for boundary creation mode
    if (this.dev_boundary_mode) {
      this.show_boundary_mode_ui();
    }
    
    pop();
    this.player.dash_cooldown.show();
    this.player.draw_health();
    
    // DEV: Show boundary creation mode text overlay
    if (this.dev_boundary_mode) {
      this.show_boundary_mode_text();
    }
    
    if (this.state === 'pause') this.pause_modal.show();
  }

  update() {
    switch (this.state) {
      case 'game':
        this.player.update(this.map?.obstacles || []);
        this.camera.set_pos(this.player.pos);
        this.map?.update_sprites(this.player);

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }

  // DEV: Development methods for boundary creation
  toggle_boundary_mode() {
    this.dev_boundary_mode = !this.dev_boundary_mode;
    this.dev_boundary_first_point = null; // Reset on toggle
    
    if (this.dev_boundary_mode) {
      console.log('🔨 BOUNDARY CREATION MODE ACTIVATED');
      console.log('Click to set the top-left corner, then click again for bottom-right corner');
    } else {
      console.log('🔨 BOUNDARY CREATION MODE DEACTIVATED');
    }
  }

  handle_boundary_click() {
    const [worldX, worldY] = this.camera.get_map_mouse_pos();

    if (!this.dev_boundary_first_point) {
      // First click - set top-left corner
      this.dev_boundary_first_point = [worldX, worldY];
      console.log(`📍 First point set at: x: ${worldX.toFixed(2)}, y: ${worldY.toFixed(2)}`);
      console.log('Click again to set the bottom-right corner');
    } else {
      // Second click - calculate boundary and generate code
      this.create_boundary_code(this.dev_boundary_first_point, [worldX, worldY]);
      this.dev_boundary_first_point = null; // Reset for next boundary
    }
  }

  create_boundary_code(topLeft, bottomRight) {
    // Calculate position (top-left corner) and size
    const pos = [Math.round(topLeft[0]), Math.round(topLeft[1])];
    const width = Math.round(bottomRight[0] - topLeft[0]);
    const height = Math.round(bottomRight[1] - topLeft[1]);
    const size = [Math.abs(width), Math.abs(height)];

    // Adjust position if user clicked bottom-right to top-left
    if (width < 0) pos[0] = Math.round(bottomRight[0]);
    if (height < 0) pos[1] = Math.round(bottomRight[1]);

    const codeString = `map.add_obstacle({ pos: [${pos[0]}, ${pos[1]}], size: [${size[0]}, ${size[1]}] });`;
    
    console.log('🎯 BOUNDARY CREATED:');
    console.log(`📋 Copy this line to your Maps.js file:`);
    console.log(`%c${codeString}`, 'background: #222; color: #bada55; padding: 2px 5px; border-radius: 3px;');
    console.log(`📐 Dimensions: ${size[0]}x${size[1]} pixels`);
    console.log('---');
  }

  show_boundary_mode_ui() {
    // Show first point marker if set
    if (this.dev_boundary_first_point) {
      stroke(255, 0, 0);
      strokeWeight(3);
      fill(255, 0, 0, 100);
      circle(this.dev_boundary_first_point[0], this.dev_boundary_first_point[1], 10);
      
      // Show preview rectangle from first point to current mouse position
      const [mouseX, mouseY] = this.camera.get_map_mouse_pos();
      stroke(255, 255, 0, 150);
      strokeWeight(2);
      fill(255, 255, 0, 50);
      rectMode(CORNERS);
      rect(this.dev_boundary_first_point[0], this.dev_boundary_first_point[1], mouseX, mouseY);
    }

    // Show current mouse position marker
    const [currentMouseX, currentMouseY] = this.camera.get_map_mouse_pos();
    stroke(0, 255, 0);
    strokeWeight(2);
    fill(0, 255, 0, 100);
    circle(currentMouseX, currentMouseY, 8);
  }

  show_boundary_mode_text() {
    // Text overlay with instructions
    push();
    fill(0, 0, 0, 180);
    stroke(255, 255, 0);
    strokeWeight(2);
    rectMode(CORNER);
    rect(10, 10, 400, this.dev_boundary_first_point ? 80 : 60);
    
    fill(255, 255, 0);
    strokeWeight(0);
    textAlign(LEFT, TOP);
    textSize(16);
    text('🔨 BOUNDARY CREATION MODE', 20, 25);
    
    textSize(12);
    if (this.dev_boundary_first_point) {
      text('Step 2: Click to set bottom-right corner', 20, 45);
      text('Press K to cancel', 20, 60);
    } else {
      text('Step 1: Click to set top-left corner', 20, 45);
    }
    pop();
  }
}
