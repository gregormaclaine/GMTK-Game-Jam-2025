function level1_map() {
  const map = new GameMap({
    background: images['backgrounds'].level1,
    color: '#31222C'
  });

  map.add_obstacle({ pos: [10, 0], size: [1500, 50] });
  map.add_obstacle({ pos: [0, 10], size: [60, 1100] });
  map.add_obstacle({ pos: [0, 1110], size: [180, 1050] });

  return map;
}

const Maps = [level1_map];
