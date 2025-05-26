import { drawBullet } from "./renderer.js";

export class Bullet {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number = 8;
  angle: number = 0;

  frame: number = 0;
  frameCount: number = 4;
  frameDelay: number = 5; // byter frame var 5:e update
  frameTimer: number = 0;

  constructor(x: number, y: number, dx: number, dy: number, angle: number) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.dx = dx;
    this.dy = dy;
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    // Animation update
    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
      this.frame = (this.frame + 1) % this.frameCount;
      this.frameTimer = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawBullet(ctx, this);
  }
}
