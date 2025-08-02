function level1_map() {
  const map = new GameMap({
    background: images['backgrounds'].level1,
    color: '#31222C',
    start_pos: [800, 1400]
  });

  map.add_obstacle({ pos: [10, 0], size: [1500, 50] });
  map.add_obstacle({ pos: [0, 10], size: [60, 1100] });
  map.add_obstacle({ pos: [0, 1110], size: [180, 1050] });
  map.add_obstacle({ pos: [390, 1110], size: [160, 690] });
  map.add_obstacle({ pos: [550, 1110], size: [2390, 130] });
  map.add_obstacle({ pos: [1430, 10], size: [140, 1100] });

  map.add_enemy(new ExplodeEnemy([1300, 1400], [50, 100]));
  map.add_enemy(new ExplodeEnemy([200, 200], [40, 40]));
  map.add_enemy(new ExplodeEnemy([800, 800], [40, 40]));
  map.add_enemy(new ExplodeEnemy([1500, 300], [40, 40]));
  map.add_enemy(new ExplodeEnemy([300, 1500], [40, 40]));

  return map;
}

const Maps = [level1_map];
