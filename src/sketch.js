const images = {};
const audio = new JL.Audio(
  [],
  [
    'boom.wav',
    'barrel-break.wav',
    'shoot.wav',
    'damage.wav',
    'dash.wav',
    'scream.wav',
    'pickup.wav',
    'enemy-death.wav'
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

  images['dialogue-profile'] = images['square'];
  images['dialogue-box'] = images['square'];
  images['skip-button'] = loadImage('assets/img/skip-button.png');

  images['sword'] = loadImage('assets/img/sword.png');
  images['indicator'] = loadImage('assets/img/indicator.png');

  images['backgrounds'] = {
    level1: loadImage('assets/img/levels/level1.png'),
    menu: loadImage('assets/img/backgrounds/menu.png'),
    hub: loadImage('assets/img/backgrounds/hub.png')
  };

  images['buttons'] = {
    start: loadImage('assets/img/buttons/start.png'),
    credits: loadImage('assets/img/buttons/credits.png')
  };

  images['barrels'] = [
    loadImage('assets/img/barrel.png'),
    loadImage('assets/img/broken-barrel.png')
  ];
  images['heart'] = loadImage('assets/img/heart.png');
  images['explosion'] = loadImage('assets/img/explosion.png');
  images['exploder'] = loadImage('assets/img/exploder.png');
  images['ranger_f'] = loadImage('assets/img/ranger_f.png');
  images['ranger_m'] = loadImage('assets/img/ranger_m.png');
  images['bullet'] = loadImage('assets/img/bullet.png');

  images['bosses'] = [
    loadImage('assets/img/boss1.png'),
    loadImage('assets/img/boss2.png')
  ];

  images.resources = {
    wood: loadImage('assets/img/resources/wood.png'),
    iron: loadImage('assets/img/resources/iron.png')
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
