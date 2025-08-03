class HitBox {
  static ZONE_WIDTH = 200;
  static ZONE_HEIGHT = 200;

  constructor(mid_pos, size) {
    this.angle = 0;
    this.size = size || [0, 0];
    this.set_pos(mid_pos);
  }

  set_pos(mid_pos = [0, 0]) {
    this.mid_pos = mid_pos;

    this.zone = [
      Math.floor(mid_pos[0] / HitBox.ZONE_WIDTH),
      Math.floor(mid_pos[1] / HitBox.ZONE_HEIGHT)
    ];
    this.points = this.get_points();
  }

  set_angle(angle) {
    this.angle = angle;
    this.points = this.get_points();
  }

  // Copied from: https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
  static is_point_in_triangle(s, a, b, c) {
    const as_x = s.x - a.x;
    const as_y = s.y - a.y;

    const s_ab = (b.x - a.x) * as_y - (b.y - a.y) * as_x > 0;

    if ((c.x - a.x) * as_y - (c.y - a.y) * as_x > 0 == s_ab) return false;
    if ((c.x - b.x) * (s.y - b.y) - (c.y - b.y) * (s.x - b.x) > 0 != s_ab)
      return false;
    return true;
  }

  mouse_zone() {
    const [mx, my] = scenes.game_scene.camera.get_map_mouse_pos();
    circle(mx, my, 5);
    return [
      Math.floor(mx / HitBox.ZONE_WIDTH),
      Math.floor(my / HitBox.ZONE_HEIGHT)
    ];
  }

  // Copied from: https://gamedev.stackexchange.com/questions/86755/how-to-calculate-corner-positions-marks-of-a-rotated-tilted-rectangle
  get_points() {
    const c = cos(this.angle);
    const s = sin(this.angle);
    const r1x = -(this.size[0] / 2) * c - (this.size[1] / 2) * s;
    const r1y = -(this.size[0] / 2) * s + (this.size[1] / 2) * c;
    const r2x = (this.size[0] / 2) * c - (this.size[1] / 2) * s;
    const r2y = (this.size[0] / 2) * s + (this.size[1] / 2) * c;

    // Returns four points in clockwise order starting from the top left.
    return [
      createVector(this.mid_pos[0] + r1x, this.mid_pos[1] + r1y),
      createVector(this.mid_pos[0] + r2x, this.mid_pos[1] + r2y),
      createVector(this.mid_pos[0] - r1x, this.mid_pos[1] - r1y),
      createVector(this.mid_pos[0] - r2x, this.mid_pos[1] - r2y)
    ];
  }

  static triangles_from_points(points) {
    return [
      [points[0], points[1], points[2]],
      [points[0], points[3], points[2]]
    ];
  }

  contains_point(point) {
    const triangles = HitBox.triangles_from_points(this.points);
    return (
      HitBox.is_point_in_triangle(point, ...triangles[0]) ||
      HitBox.is_point_in_triangle(point, ...triangles[1])
    );
  }

  do_zones_touch(other) {
    if (abs(this.zone[0] - other.zone[0]) > 1) return false;
    if (abs(this.zone[1] - other.zone[1]) > 1) return false;
    return true;
  }

  is_colliding(other, zoned = true) {
    if (zoned && !this.do_zones_touch(other)) return false;

    const triangles = HitBox.triangles_from_points(this.points);
    const otriangles = HitBox.triangles_from_points(other.points);

    if (
      other.points.some(point => {
        return (
          HitBox.is_point_in_triangle(point, ...triangles[0]) ||
          HitBox.is_point_in_triangle(point, ...triangles[1])
        );
      })
    )
      return true;

    if (
      this.points.some(point => {
        return (
          HitBox.is_point_in_triangle(point, ...otriangles[0]) ||
          HitBox.is_point_in_triangle(point, ...otriangles[1])
        );
      })
    )
      return true;

    return false;
  }

  contains(other) {
    // Check if hitbox contains both top left and bottom right points of the other hitbox
    return (
      this.contains_point(other.points[0]) &&
      this.contains_point(other.points[2])
    );
  }

  repel(other) {
    if (!this.is_colliding(other, false)) return;

    const axes = [];
    // Get the 4 edge normals (axes) from both rectangles
    for (let i = 0; i < 4; i++) {
      const p1 = this.points[i];
      const p2 = this.points[(i + 1) % 4];
      const edge = p5.Vector.sub(p2, p1);
      const normal = createVector(-edge.y, edge.x).normalize();
      axes.push(normal);
    }
    for (let i = 0; i < 4; i++) {
      const p1 = other.points[i];
      const p2 = other.points[(i + 1) % 4];
      const edge = p5.Vector.sub(p2, p1);
      const normal = createVector(-edge.y, edge.x).normalize();
      axes.push(normal);
    }

    let minOverlap = Infinity;
    let minAxis = null;

    for (const axis of axes) {
      // Project both rectangles onto the axis
      let [minA, maxA] = [Infinity, -Infinity];
      let [minB, maxB] = [Infinity, -Infinity];
      for (const p of this.points) {
        const proj = p5.Vector.dot(p, axis);
        minA = Math.min(minA, proj);
        maxA = Math.max(maxA, proj);
      }
      for (const p of other.points) {
        const proj = p5.Vector.dot(p, axis);
        minB = Math.min(minB, proj);
        maxB = Math.max(maxB, proj);
      }
      // Find overlap
      const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
      if (overlap < minOverlap) {
        minOverlap = overlap;
        minAxis = axis.copy();
        // Determine direction: push other away from this
        const centerA = createVector(this.mid_pos[0], this.mid_pos[1]);
        const centerB = createVector(other.mid_pos[0], other.mid_pos[1]);
        if (p5.Vector.dot(p5.Vector.sub(centerB, centerA), minAxis) < 0) {
          minAxis.mult(-1);
        }
      }
      if (overlap <= 0) {
        // No overlap, shouldn't happen here
        return createVector(0, 0);
      }
    }

    // Move other by minOverlap along minAxis
    return minAxis.mult(minOverlap + 0.1); // +0.1 to ensure separation
  }

  show(color = 'red', draw_mouse_zone = false) {
    if (!SHOW_HITBOXES) return;

    stroke(color);
    strokeWeight(1);
    HitBox.triangles_from_points(this.points).forEach(triangle => {
      for (let i = 0; i < 3; i++) {
        line(
          triangle[i].x,
          triangle[i].y,
          triangle[(i + 1) % 3].x,
          triangle[(i + 1) % 3].y
        );
      }
    });

    if (draw_mouse_zone) {
      const zone = this.mouse_zone();
      for (let xoff = -1; xoff <= 1; xoff++) {
        for (let yoff = -1; yoff <= 1; yoff++) {
          stroke('yellow');
          strokeWeight(0.5);
          noFill();
          rectMode(CORNER);
          const [x, y] = [zone[0] + xoff, zone[1] + yoff];
          rect(
            x * HitBox.ZONE_WIDTH,
            y * HitBox.ZONE_HEIGHT,
            HitBox.ZONE_WIDTH,
            HitBox.ZONE_HEIGHT
          );
        }
      }
    }
  }
}
