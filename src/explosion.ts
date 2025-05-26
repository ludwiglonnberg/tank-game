export class Explosion {
  x: number;
  y: number;
  image: HTMLImageElement;

  frame: number = 0;
  frameCount: number = 7; // t.ex. 8 frames i spritesheet
  frameDelay: number = 6; // byt frame var 4:e update
  frameTimer: number = 0;
  done: boolean = false;

  constructor(x: number, y: number, image: HTMLImageElement) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
      this.frame++;
      this.frameTimer = 0;
      if (this.frame >= this.frameCount) {
        this.done = true;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.frame * 16,
      0,
      16,
      16,
      this.x - 16,
      this.y - 16,
      16 * 3,
      16 * 3
    );
  }
}
