import { Bullet } from "./bullet.js";
import { bullets } from "./game.js";
import { isTankCollidingWithWall } from "./collision.js";
import { sendBullet } from "./websocket";

export class Tank {
  id: string;
  x: number;
  y: number;
  hitbox: number = 32;
  speed: number = 3;
  angle: number = 0;
  dashDistance: number = 10;
  shootCooldown: number = 0;
  hp: number = 100;
  turretAngle: number = 0;

  constructor(x: number, y: number, id: string) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  isAlive() {
    return this.hp > 0;
  }
  move(dx: number, dy: number) {
    const newX = this.x + dx * this.speed;
    const newY = this.y + dy * this.speed;
    const tankSize = 50;

    if (dx !== 0 || dy !== 0) {
      this.angle = Math.atan2(dy, dx);
    }

    if (!isTankCollidingWithWall(newX, newY, 64, tankSize)) {
      this.x = newX;
      this.y = newY;
    }
  }
  dash() {
    // Calculate dash vector based on current angle
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);

    // Move the tank by dashDistance in the facing direction
    this.x += dx * this.dashDistance;
    this.y += dy * this.dashDistance;
  }

  shoot(mouseX: number, mouseY: number, playerId: string) {
    const timer = Date.now();

    if (timer >= this.shootCooldown) {
      // Calculate direction from tank to mouse
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const dirX = dx / length;
      const dirY = dy / length;
      const angle = Math.atan2(dy, dx);
      bullets.push(new Bullet(this.x, this.y, dirX, dirY, angle));
      sendBullet(playerId, this.x, this.y, dirX, dirY, angle);
      this.shootCooldown = timer + 200;
    }
  }
}
