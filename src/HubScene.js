class HubScene {
  constructor({
    dialogue,
    replay_manager,
    start_level,
    collected,
    progression
  }) {
    this.dialogue = dialogue;
    this.start_level = start_level;
    this.replay_manager = replay_manager;
    this.collected = collected;
    this.progression = progression;

    this.map = HubMap().set_progression(this.progression);
    this.camera = new Camera(this.map);

    this.boundary_tool = new BoundaryCreatorTool({ camera: this.camera });

    this.totems = [];
    this.abilities = [];

    this.reset();
  }

  reset() {
    this.player = new Player({
      start_pos: this.map.start_pos,
      bounds: this.camera.bounds(),
      collected: this.collected,
      progression: this.progression
    });

    const totem_props = {
      player: this.player,
      replay_manager: this.replay_manager,
      dialogue: this.dialogue,
      start_level: this.start_level,
      progression: this.progression,
      collected: this.collected
    };

    this.totems = [
      new LevelTotem({
        ...totem_props,
        level: 1,
        pos: [1930 - 600, 450]
      }),
      new LevelTotem({
        ...totem_props,
        level: 2,
        pos: [1930, 450]
      }),
      new LevelTotem({
        ...totem_props,
        level: 3,
        pos: [1930 + 600, 450]
      })
    ];

    const selector_props = {
      progression: this.progression,
      player: this.player
    };

    let mid_x = 3150;
    let x_spacing = 300;
    this.abilities = [
      new AbilitySelector({
        ...selector_props,
        ability: 'slow',
        pos: createVector(mid_x - x_spacing, 1650)
      }),
      new AbilitySelector({
        ...selector_props,
        ability: 'slash',
        pos: createVector(mid_x, 1650)
      }),
      new AbilitySelector({
        ...selector_props,
        ability: 'trail',
        pos: createVector(mid_x + x_spacing, 1650)
      })
    ];

    mid_x = 800;
    x_spacing = 200;
    this.weapons = [
      new WeaponSelector({
        ...selector_props,
        pos: createVector(mid_x - x_spacing * 2, 1650),
        sword: 0
      }),
      new WeaponSelector({
        ...selector_props,
        pos: createVector(mid_x - x_spacing, 1650),
        sword: 1
      }),
      new WeaponSelector({
        ...selector_props,
        pos: createVector(mid_x, 1650),
        sword: 2
      }),
      new WeaponSelector({
        ...selector_props,
        pos: createVector(mid_x + x_spacing, 1650),
        sword: 3
      }),
      new WeaponSelector({
        ...selector_props,
        pos: createVector(mid_x + x_spacing * 2, 1650),
        sword: 4
      })
    ];
  }

  handle_click() {
    if (this.boundary_tool.active) {
      this.boundary_tool.handle_click();
      return;
    }
    this.player.sword.swing();
  }

  handle_key_press() {
    if (keyCode === DEV_BOUNDARY_CREATE_KEY_CODE)
      return this.boundary_tool.toggle();

    this.totems.forEach(totem => totem.handle_key_press());
    this.abilities.forEach(ability => ability.handle_key_press());
    this.weapons.forEach(weapon => weapon.handle_key_press());
    this.player.handle_key_press();
  }

  totem_shrinking() {
    const shrinker = this.totems.find(totem => totem.shrink_progress);
    return Math.min(1, shrinker?.shrink_progress || 0);
  }

  show() {
    push();
    this.camera.show();
    this.totems.forEach(totem => totem.show());
    this.abilities.forEach(ability => ability.show());
    this.show_ability_description();
    this.weapons.forEach(weapon => weapon.show());
    this.player.show({ scaler: 1 - this.totem_shrinking() });
    this.boundary_tool.show_boundary();
    pop();

    this.boundary_tool.show_hud();
    this.player.dash_cooldown.show();
  }

  show_ability_description() {
    if (!this.progression.selected_ability) return;

    const description = {
      slow: 'Slows down enemies when you hit them.',
      slash:
        'A powerful sword slash that can break projectiles before they hit you.',
      trail: 'Leaves a trail that burns enemies.'
    }[this.progression.selected_ability];

    push();
    strokeWeight(0);
    fill(255);
    textSize(24);
    textAlign(CENTER);
    text(description, 3150, 1850);
    pop();
  }

  update() {
    if (!this.totem_shrinking()) {
      this.player.update(this.map);
      this.camera.set_pos(this.player.pos);
    }
    this.totems.forEach(totem => totem.update());
  }
}
