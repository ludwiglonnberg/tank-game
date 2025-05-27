import { Tank } from "./tank";
import { Bullet } from "./bullet";
import { tileMap } from "./map.js";
const TILE_SIZE: number = 32;
const RENDER_TILE_SIZE: number = 64;

const grassVariants: number = 64;
const grassMap: number[][] = [];

export function generateGrassMap() {
  for (let y = 0; y < 12; y++) {
    const row: number[] = [];
    for (let x = 0; x < 16; x++) {
      row.push(Math.floor(Math.random() * grassVariants));
    }
    grassMap.push(row);
  }
}

const backgroundImage = new Image();
backgroundImage.src = "assets/TX Tileset Grass.png";

export function drawBackgound(ctx: CanvasRenderingContext2D) {
  for (let y = 0; y < grassMap.length; y++) {
    for (let x = 0; x < grassMap[0].length; x++) {
      const tileId = grassMap[y][x];
      const sx = (tileId % 8) * TILE_SIZE;
      const sy = Math.floor(tileId / 8) * TILE_SIZE;

      ctx.drawImage(
        backgroundImage,
        sx,
        sy,
        TILE_SIZE,
        TILE_SIZE,
        x * RENDER_TILE_SIZE,
        y * RENDER_TILE_SIZE,
        RENDER_TILE_SIZE,
        RENDER_TILE_SIZE
      );
    }
  }
}

const bulletImage = new Image();
bulletImage.src = "assets/booleets.png";
const BULLET_SIZE = 16;

export function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet) {
  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  ctx.rotate(bullet.angle);

  ctx.drawImage(
    bulletImage,
    bullet.frame * BULLET_SIZE,
    0,
    BULLET_SIZE,
    BULLET_SIZE,
    -BULLET_SIZE,
    -BULLET_SIZE,
    BULLET_SIZE * 2,
    BULLET_SIZE * 2
  );

  ctx.restore();
}

const tilesetImage = new Image();
tilesetImage.src = "assets/TX Tileset Wall.png";

function drawMap(ctx: CanvasRenderingContext2D) {
  drawBackgound(ctx!);
  const tilesX = ctx.canvas.width / TILE_SIZE;
  const tilesY = ctx.canvas.height / TILE_SIZE;

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      const mapTileY = y % tileMap.length;
      const mapTileX = x % tileMap[0].length;
      const tileId = tileMap[mapTileY][mapTileX];
      const sx = (tileId % 16) * TILE_SIZE;
      const sy = Math.floor(tileId / 16) * TILE_SIZE;

      ctx.drawImage(
        tilesetImage,
        sx,
        sy,
        TILE_SIZE,
        TILE_SIZE,
        x * RENDER_TILE_SIZE,
        y * RENDER_TILE_SIZE,
        RENDER_TILE_SIZE,
        RENDER_TILE_SIZE
      );
    }
  }
}

const tankImage = new Image();
tankImage.src = "assets/tanksprite.png";
const enemyTankImage = new Image();
enemyTankImage.src = "assets/enemy-tanksprite.png";
const SPRITE_SIZE = 32;
const TANK_WIDTH = 64; // 2 x 32
const TANK_HEIGHT = 64; // 2 x 32

export function drawTank(
  ctx: CanvasRenderingContext2D,
  tank: Tank,
  tankImage: HTMLImageElement,
  mouseY?: number,
  mouseX?: number
) {
  ctx.save();

  // === RITA BASEN ===
  ctx.translate(tank.x, tank.y);
  ctx.rotate(tank.angle - Math.PI / 2); // ev. rotera basen om den styrs
  ctx.drawImage(
    tankImage,
    0,
    0, // basens sprite position
    TANK_WIDTH,
    TANK_HEIGHT,
    -SPRITE_SIZE,
    -SPRITE_SIZE,
    TANK_WIDTH,
    TANK_HEIGHT
  );
  ctx.restore();

  // === RITA TORN ===
  ctx.save();
  ctx.translate(tank.x, tank.y);
  let turretAngle = tank.turretAngle ?? tank.angle;
  if (mouseX !== undefined && mouseY !== undefined) {
    turretAngle = Math.atan2(mouseY - tank.y, mouseX - tank.x);
    tank.turretAngle = turretAngle;
  }
  ctx.rotate(turretAngle - Math.PI / 2);

  ctx.drawImage(
    tankImage,
    64,
    0, // tornets sprite-position i tilesheet
    64,
    64,
    -33,
    -26,
    64,
    64
  );
  ctx.restore();
}

export function drawWallHit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  const wallHitImage = new Image();
  const frame: number = 0;
  wallHitImage.src = "assets/smoke.png";
  const WALLHIT_SIZE = 32;

  ctx.drawImage(
    wallHitImage,
    frame * WALLHIT_SIZE,
    0,
    WALLHIT_SIZE,
    WALLHIT_SIZE,
    x - WALLHIT_SIZE / 2,
    y - WALLHIT_SIZE / 2,
    WALLHIT_SIZE,
    WALLHIT_SIZE
  );
}
function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  health: number
) {
  ctx.fillStyle = "red";
  ctx.fillRect(x - 25, y - 40, 50, 5);
  ctx.fillStyle = "green";
  ctx.fillRect(x - 25, y - 40, 50 * (health / 100), 5);
}
export function drawScene(
  ctx: CanvasRenderingContext2D,
  tank: Tank,
  mouseY: number,
  mouseX: number,
  otherPlayers: { [id: string]: Tank }
) {
  ctx.imageSmoothingEnabled = false;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Rensa canvasen
  drawMap(ctx);
  ctx.save(); // Spara nuvarande tillstånd

  drawTank(ctx, tank, tankImage, mouseY, mouseX);
  for (const id in otherPlayers) {
    drawTank(ctx, otherPlayers[id], enemyTankImage);
  }
  drawHealthBar(ctx, tank.x, tank.y, tank.hp);

  for (const id in otherPlayers) {
    const enemy = otherPlayers[id];
    drawHealthBar(ctx, enemy.x, enemy.y, enemy.hp);
  }

  ctx.restore(); // Återställ canvas-rotation
}
