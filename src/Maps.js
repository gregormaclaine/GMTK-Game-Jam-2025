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

  // map.add_enemy(new ExplodeEnemy({ pos: [1300, 1400], size: [100, 140] }));
  // map.add_enemy(
  //   new ExplodeEnemy({ pos: [200, 200], size: [60, 76], drops: { wood: 4 } })
  // );
  // map.add_enemy(new ExplodeEnemy({ pos: [800, 800], size: [60, 76] }));
  // map.add_enemy(new ExplodeEnemy({ pos: [1500, 300], size: [60, 76] }));
  map.add_enemy(new RangedEnemy({ pos: [600, 1400], size: [85, 100] }));
  // map.add_enemy(new RangedEnemy({ pos: [300, 1500], size: [85, 100] }));

  map.add_enemy(
    new PassiveEnemy({
      image: images['slime'],
      pos: [1300, 1400],
      size: [100, 100],
      drops: { slime: 2, matter: 2 }
    })
  );

  map.add_trigger({
    pos: [140, 984],
    size: [296, 84],
    on_enter: () => {
      const boss_door = map.add_obstacle({
        image: images['square'],
        pos: [144, 1132],
        size: [276, 90]
      });
      map.add_enemy(
        new BossEnemy({
          image: images.bosses[0],
          pos: [739, 518],
          size: [150, 200],
          drops: { wood: 2, iron: 2 },
          on_death: () => {
            boss_door.delete();
          },
          can_shoot: true
        })
      );
    }
  });

  map.barrels.push(new Barrel([1000, 1600], { wood: 2 }));

  return map;
}

function level2_map() {
  const map = new GameMap({
    background: images['backgrounds'].level2,
    color: '#2A1F24',
    start_pos: [2000, 2000]
  });
  setTimeout(() => {
    map.complete();
  }, 1000);
  return map;
}

function HubMap() {
  const map = new GameMap({
    background: images.backgrounds.hub,
    color: '#ecaf83',
    start_pos: [1950, 1975]
  });

  map.add_obstacle({ pos: [2091, 2288], size: [174, 714] });
  map.add_obstacle({ pos: [2266, 2134], size: [236, 878] });
  map.add_obstacle({ pos: [1636, 2284], size: [178, 732] });
  map.add_obstacle({ pos: [1369, 2130], size: [266, 916] });
  map.add_obstacle({ pos: [2063, 996], size: [200, 670] });
  map.add_obstacle({ pos: [1637, 1002], size: [172, 664] });
  map.add_obstacle({ pos: [2267, 999], size: [238, 872] });
  map.add_obstacle({ pos: [1371, 1001], size: [262, 874] });
  map.add_obstacle({ pos: [2508, 998], size: [1332, 250] });
  map.add_obstacle({ pos: [3380, 114], size: [276, 892] });
  map.add_obstacle({ pos: [490, -16], size: [3167, 142] });
  map.add_obstacle({ pos: [321, 117], size: [170, 896] });
  map.add_obstacle({ pos: [491, 1003], size: [886, 248] });
  map.add_obstacle({ pos: [163, 1001], size: [1208, 248] });
  map.add_obstacle({ pos: [109, 1251], size: [128, 1540] });
  map.add_obstacle({ pos: [237, 2763], size: [1155, 190] });
  map.add_obstacle({ pos: [3760, 1250], size: [140, 1608] });
  map.add_obstacle({ pos: [2494, 2757], size: [1270, 110] });

  return map;
}

const Maps = [level1_map, level2_map];
