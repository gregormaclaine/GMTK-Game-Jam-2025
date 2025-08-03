const images = {};
const audio = new JL.Audio(
  ['sao.mp3'],
  [
    'boom.wav',
    'barrel-break.wav',
    'shoot.wav',
    'damage.wav',
    'dash.wav',
    'scream.wav',
    'pickup.wav',
    'enemy-death.wav',
    'dud.wav',
    'sword.wav',
    'slash.wav',
    'corn.wav'
  ]
);
let fonts = {};
let scenes;

function preload() {
  // Load fonts
  fonts['light'] = loadFont('assets/font/Oxygen-Light.ttf');
  fonts['regular'] = loadFont('assets/font/RobotoMono-Regular.ttf');
  fonts['bold'] = loadFont('assets/font/Oxygen-Bold.ttf');

  images['square'] = loadImage('assets/img/square.png');
  images['player'] = loadImage('assets/img/mc/right.png');
  images['lock'] = loadImage('assets/img/lock.png');
  images['hud'] = loadImage('assets/img/hud.png');

  images['dialogue-profile'] = images['square'];
  images['dialogue-box'] = images['square'];
  images['skip-button'] = loadImage('assets/img/skip-button.png');

  images.swords = [
    loadImage('assets/img/swords/sword.png'),
    loadImage('assets/img/swords/sword1.png'),
    loadImage('assets/img/swords/sword2.png'),
    loadImage('assets/img/swords/sword3.png'),
    loadImage('assets/img/swords/sword4.png')
  ];

  images['indicator'] = loadImage('assets/img/indicator.png');
  images['damage-trail'] = null;

  images['backgrounds'] = {
    level1: loadImage('assets/img/levels/level1.png'),
    level2: loadImage('assets/img/levels/level2.png'),
    level3: loadImage('assets/img/levels/level3.png'),
    menu: loadImage('assets/img/backgrounds/menu.png'),
    hub: loadImage('assets/img/backgrounds/hub.png')
  };

  images['buttons'] = {
    start: loadImage('assets/img/buttons/start.png'),
    credits: loadImage('assets/img/buttons/credits.png'),
    loop: loadImage('assets/img/buttons/loop.png')
  };

  images['barrels'] = [
    loadImage('assets/img/barrel.png'),
    loadImage('assets/img/broken-barrel.png')
  ];
  images['heart'] = loadImage('assets/img/heart.png');
  images['explosion'] = loadImage('assets/img/explosion.png');
  images['exploder'] = loadImage('assets/img/enemies/exploder.png');
  images['ranger_f'] = loadImage('assets/img/enemies/ranger_f.png');
  images['ranger_m'] = loadImage('assets/img/enemies/ranger_m.png');
  images['slime'] = loadImage('assets/img/enemies/slime.png');
  images['bullet'] = loadImage('assets/img/bullet.png');

  images['bosses'] = [
    loadImage('assets/img/enemies/boss1.png'),
    loadImage('assets/img/enemies/boss2.png')
  ];

  images.resources = {
    wood: loadImage('assets/img/resources/wood.png'),
    iron: loadImage('assets/img/resources/iron.png'),
    slime: loadImage('assets/img/resources/slime.png'),
    matter: loadImage('assets/img/resources/matter.png')
  };

  images.abilities = {
    slow: loadImage('assets/img/abilities/slow.png'),
    slash: loadImage('assets/img/abilities/slash.png'),
    trail: loadImage('assets/img/abilities/trail.png')
  };

  audio.preload();
}

function setup() {
  const cnv = createCanvas(1600, 1200);
  textFont(fonts['regular']);
  Gif.set_canvas(cnv);
  scenes = new SceneManager();
}

function mouseClicked() {
  if (scenes) scenes.handle_click();
}

function keyPressed() {
  // console.log(keyCode);
  if (scenes) scenes.handle_key_press();
}

function draw() {
  cursor();
  if (scenes) {
    scenes.show();
    scenes.update();
  }
}
