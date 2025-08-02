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
  map.add_obstacle({ pos: [180, 2125], size: [375, 200] });
  map.add_obstacle({ pos: [180, 2330], size: [510, 110] });
  map.add_obstacle({ pos: [155, 2435], size: [90, 600] });
  map.add_obstacle({ pos: [245, 2970], size: [3500, 50] });
  map.add_obstacle({ pos: [3705, 2340], size: [50, 600] });
  map.add_obstacle({ pos: [3705, 2340], size: [300, 50] });
  map.add_obstacle({ pos: [3980, 1200], size: [20, 1200] });
  map.add_obstacle({ pos: [3340, 1025], size: [650, 220] });
  map.add_obstacle({ pos: [3923, 290], size: [86, 742] });
  map.add_obstacle({ pos: [2153, 240], size: [1856, 52] });
  map.add_obstacle({ pos: [1990, 237], size: [160, 366] });
  map.add_obstacle({ pos: [1568, 281], size: [586, 134] });
  map.add_obstacle({ pos: [1573, 966], size: [404, 140] });
  map.add_obstacle({ pos: [1977, 858], size: [174, 252] });
  map.add_obstacle({ pos: [2152, 1018], size: [784, 108] });
  map.add_obstacle({ pos: [2418, 781], size: [242, 184] }); // Rock
  map.add_obstacle({ pos: [3262, 532], size: [240, 222] }); // Rock
  map.add_obstacle({ pos: [3413, 1573], size: [208, 194] }); // Rock
  map.add_obstacle({ pos: [2647, 1833], size: [334, 268] }); // Rock
  map.add_obstacle({ pos: [3066, 2922], size: [114, 56] });
  map.add_obstacle({ pos: [3048, 2330], size: [132, 334] });
  map.add_obstacle({ pos: [2504, 2336], size: [676, 48] });
  map.add_obstacle({ pos: [2750, 2342], size: [30, 638] });
  map.add_obstacle({ pos: [2502, 2333], size: [274, 214] });
  map.add_obstacle({ pos: [1948, 2442], size: [48, 528] });
  map.add_obstacle({ pos: [1962, 2330], size: [334, 212] });
  map.add_obstacle({ pos: [1912, 1242], size: [204, 418] });
  map.add_obstacle({ pos: [1906, 2022], size: [210, 316] });
  map.add_obstacle({ pos: [1073, 1672], size: [294, 224] }); // Rock
  map.add_obstacle({ pos: [1625, 2090], size: [156, 154] }); // Rock
  map.add_obstacle({ pos: [1123, 2323], size: [826, 130] });

  map.add_enemy(new ExplodeEnemy([1300, 1400], [150, 190]));
  map.add_enemy(new ExplodeEnemy([200, 200], [60, 76]));
  map.add_enemy(new ExplodeEnemy([800, 800], [60, 76]));
  map.add_enemy(new ExplodeEnemy([1500, 300], [60, 76]));
  map.add_enemy(new RangedEnemy([300, 1500], [50, 100]));

  map.barrels.push(new Barrel([1000, 1600], { type: 'health', amount: 1 }));

  return map;
}

const Maps = [level1_map];
