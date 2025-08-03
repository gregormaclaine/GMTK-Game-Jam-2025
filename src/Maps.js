function level1_map() {
  const map = new GameMap({
    background: images['backgrounds'].level1,
    color: '#31222C',
    start_pos: [800, 1400],
    level: 1
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

  map.barrels.push(new Barrel([1000, 1600], { wood: 2, health: 1 }));

  return map;
}

function level2_map() {
  const map = new GameMap({
    background: images['backgrounds'].level2,
    color: '#2A1F24',
    start_pos: [2000, 2000],
    level: 2
  });

  map.add_obstacle({ pos: [2, 1], size: [3997, 98] });
  map.add_obstacle({ pos: [3, 81], size: [178, 1215] });
  map.add_obstacle({ pos: [143, 786], size: [350, 502] });
  map.add_obstacle({ pos: [458, 788], size: [634, 182] });
  map.add_obstacle({ pos: [1070, 786], size: [308, 532] });
  map.add_obstacle({ pos: [430, 226], size: [218, 196] });
  map.add_obstacle({ pos: [1910, 89], size: [134, 310] });
  map.add_obstacle({ pos: [2292, 87], size: [87, 1076] });
  map.add_obstacle({ pos: [2045, 1115], size: [320, 56] });
  map.add_obstacle({ pos: [1907, 631], size: [142, 552] });
  map.add_obstacle({ pos: [1910, 1163], size: [224, 448] });
  map.add_obstacle({ pos: [1077, 1548], size: [834, 68] });
  map.add_obstacle({ pos: [1075, 1603], size: [90, 458] });
  map.add_obstacle({ pos: [907, 1917], size: [176, 142] });
  map.add_obstacle({ pos: [1161, 1969], size: [316, 88] });
  map.add_obstacle({ pos: [1741, 1973], size: [282, 84] });
  map.add_obstacle({ pos: [3, 1576], size: [496, 486] });
  map.add_obstacle({ pos: [497, 1920], size: [176, 140] });
  map.add_obstacle({ pos: [2, 2056], size: [67, 941] });
  map.add_obstacle({ pos: [68, 2931], size: [3931, 70] });
  map.add_obstacle({ pos: [3426, 2695], size: [148, 146] });
  map.add_obstacle({ pos: [2439, 2162], size: [432, 340] });
  map.add_obstacle({ pos: [1258, 2118], size: [154, 142] });
  map.add_obstacle({ pos: [256, 2562], size: [302, 242] });
  map.add_obstacle({ pos: [2023, 1933], size: [1290, 124] });
  map.add_obstacle({ pos: [2773, 1877], size: [540, 56] });
  map.add_obstacle({ pos: [2771, 1707], size: [144, 172] });
  map.add_obstacle({ pos: [2209, 1676], size: [242, 180] });
  map.add_obstacle({ pos: [2022, 1614], size: [112, 362] });
  map.add_obstacle({ pos: [1273, 482], size: [308, 238] });
  map.add_obstacle({ pos: [3797, 1879], size: [198, 1047] });
  map.add_obstacle({ pos: [3577, 1883], size: [230, 178] });
  map.add_obstacle({ pos: [3627, 1620], size: [160, 140] });
  map.add_obstacle({ pos: [3923, 983], size: [75, 893] });
  map.add_obstacle({ pos: [3784, 983], size: [154, 140] });
  map.add_obstacle({ pos: [3939, 5], size: [56, 975] });
  map.add_obstacle({ pos: [3431, 975], size: [168, 152] });
  map.add_obstacle({ pos: [3419, 1121], size: [60, 228] });
  map.add_obstacle({ pos: [2779, 1305], size: [640, 44] });
  map.add_obstacle({ pos: [2783, 1345], size: [134, 136] });
  map.add_obstacle({ pos: [2770, 1093], size: [74, 210] });
  map.add_obstacle({ pos: [2347, 1089], size: [426, 78] });
  map.add_obstacle({ pos: [2419, 775], size: [230, 204] });

  // setTimeout(() => {
  //   map.complete();
  // }, 1000);

  // let enemies_left = 1;

  // on_death = () => {
  //   enemies_left--;
  //   if (enemies_left <= 0) spawn_boss();
  // };

  // map.add_enemy(
  //   new RangedEnemy({ pos: [600, 1400], size: [85, 100], on_death })
  // );

  // function spawn_boss() {}

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
