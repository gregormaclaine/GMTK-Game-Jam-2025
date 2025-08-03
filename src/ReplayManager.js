class GameReplay {
  static RESOLUTION_SCALE = 0.25; // Scale for saving frames
  static FRAME_RATE = 3; // Frames per second

  constructor() {
    this.frames = [];
    this.interval = null;
    this.start_time = 0;
    this.duration = 0;
  }

  save_frame() {
    if (!this.interval) return;
    const w = int(width * GameReplay.RESOLUTION_SCALE);
    const h = int(height * GameReplay.RESOLUTION_SCALE);
    const gfx = createGraphics(w, h);
    gfx.image(get(), 0, 0, w, h);
    this.frames.push(gfx.get());
  }

  start_recording() {
    if (this.interval) throw new Error('Recording is already in progress.');
    this.interval = setInterval(
      this.save_frame.bind(this),
      floor(1000 / GameReplay.FRAME_RATE)
    );
    this.start_time = millis();
  }

  stop_recording() {
    if (!this.interval) throw new Error('No recording in progress to stop.');
    clearInterval(this.interval);
    this.interval = null;
    this.duration = millis() - this.start_time;
  }

  delete() {
    this.frames = null;
  }
}

class FrameReplayer {
  constructor(replay, pos, size, collected = {}) {
    this.replay = replay;
    this.pos = pos;
    this.size = size;
    this.collected = collected;

    this.start_time = null;
    this.on_complete = null;
    this.promise = new Promise(resolve => {
      this.on_complete = resolve;
    });

    this.time_scale = 0.8; // Speed of replay
  }

  get elapsed() {
    if (!this.start_time) return 0;
    return (millis() - this.start_time) * this.time_scale;
  }

  get_frame() {
    const frameIndex = round(
      lerp(
        0,
        this.replay.frames.length - 1,
        this.elapsed / this.replay.duration
      )
    );

    return this.replay.frames[frameIndex];
  }

  show() {
    if (!this.start_time) {
      this.start_time = millis();
    }

    if (this.elapsed >= this.replay.duration) {
      this.on_complete?.();
      this.on_complete = null;
      return;
    }

    imageMode(CORNER);
    image(this.get_frame(), ...this.pos, ...this.size);
  }
}

class ReplayManager {
  constructor() {
    this.replays = {};
    this.inventories = {};
    this.current = null;
    this.current_id = null;
  }

  start(id) {
    this.current_id = id;
    this.current = new GameReplay();
    this.current.start_recording();
  }

  finish(collected = null) {
    if (!this.current) throw new Error('No replay in progress to finish.');
    this.current.stop_recording();

    if (collected) {
      if (this.replays[this.current_id]) {
        this.replays[this.current_id].delete();
        delete this.replays[this.current_id];
      }
      this.replays[this.current_id] = this.current;
      this.inventories[this.current_id] = collected;
    } else {
      this.current.delete();
    }

    this.current = null;
    this.current_id = null;
  }

  get_replay(id, pos, size) {
    if (!this.replays[id]) throw new Error(`No replay found for ID: ${id}`);
    return new FrameReplayer(this.replays[id], pos, size, this.inventories[id]);
  }
}
