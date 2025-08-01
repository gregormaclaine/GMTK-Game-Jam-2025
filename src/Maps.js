function level1_map() {
  const map = new GameMap({
    background: images['backgrounds'].level1,
    color: '#31222C',
    start_pos: [2000, 2000]
  });

  map.add_obstacle({ pos: [10, 0], size: [1500, 50] });
  map.add_obstacle({ pos: [0, 10], size: [60, 1100] });
  map.add_obstacle({ pos: [0, 1110], size: [180, 1050] });
  map.add_obstacle({ pos: [390, 1110], size: [160, 690] });
  map.add_obstacle({ pos: [550, 1110], size: [2390, 130] });
  map.add_obstacle({ pos: [1430, 10], size: [140, 1100] });

  return map;
}

const Maps = [level1_map];
