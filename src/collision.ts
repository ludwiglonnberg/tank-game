import { Bullet } from "./bullet";
import { tileMap } from "./map.js";
import { Tank } from "./tank.js";
import { Explosion } from "./explosion.js";

function isWall(tileId: number): boolean {
  return tileId !== 0;
}

export function isBulletCollidingWithWall(
  bullet: Bullet,
  tileSize: number
): boolean {
  const tileX = Math.floor(bullet.x / tileSize);
  const tileY = Math.floor(bullet.y / tileSize);

  // Kolla om den är utanför kartan
  if (
    tileY < 0 ||
    tileY >= tileMap.length ||
    tileX < 0 ||
    tileX >= tileMap[0].length
  ) {
    return true; // betraktas som vägg
  }

  const tileId = tileMap[tileY][tileX];
  return isWall(tileId);
}

export function checkBulletHits(
  bullets: Bullet[],
  targetTank: Tank,
  onHit: (bulletIndex: number) => void
): boolean {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    const dist = Math.hypot(bullet.x - targetTank.x, bullet.y - targetTank.y);
    if (dist < 30 && targetTank.isAlive()) {
      onHit(i);
      return true;
    }
  }
  return false;
}
// Kontrollera om spelarens kulor träffar andra tanks
export function checkBulletHitsOnEnemy(
  bullets: Bullet[],
  targets: Record<string, Tank>,
  explosions: Explosion[],
  tankExplosionImage: HTMLImageElement,
  onHit: (tankId: string, bulletIndex: number) => void
) {
  for (const id in targets) {
    const tank = targets[id];
    if (!tank.isAlive()) continue;

    if (
      checkBulletHits(bullets, tank, (i) => {
        explosions.push(
          new Explosion(bullets[i].x, bullets[i].y, tankExplosionImage)
        );
        onHit(id, i);
      })
    ) {
      break; // Sluta kolla fler tanks om kulan träffat en
    }
  }
}

// Kontrollera om fiendens kulor träffar spelaren
export function checkIfPlayerGotHit(
  player: Tank,
  enemyBullets: { [playerId: string]: Bullet[] },
  explosions: Explosion[],
  tankExplosionImage: HTMLImageElement
) {
  for (const id in enemyBullets) {
    const bullets = enemyBullets[id];

    checkBulletHits(bullets, player, (i) => {
      const hitBullet = bullets[i];

      // Explosion + ta bort kulan
      explosions.push(
        new Explosion(hitBullet.x, hitBullet.y, tankExplosionImage)
      );
      bullets.splice(i, 1);
    });
  }
}

export function isTankCollidingWithWall(
  x: number,
  y: number,
  tileSize: number,
  tankSize: number
): boolean {
  const corners = [
    { cx: x + tankSize / 2, cy: y - tankSize / 2 },
    { cx: x - tankSize / 2, cy: y - tankSize / 2 },
    { cx: x + tankSize / 2, cy: y + tankSize / 2 },
    { cx: x - tankSize / 2, cy: y + tankSize / 2 },
  ];

  for (const corner of corners) {
    const tileX = Math.floor(corner.cx / tileSize);
    const tileY = Math.floor(corner.cy / tileSize);

    if (
      tileY < 0 ||
      tileY >= tileMap.length ||
      tileX < 0 ||
      tileX >= tileMap[0].length
    ) {
      return true;
    }
    const tileId = tileMap[tileY][tileX];
    if (isWall(tileId)) return true;
  }
  return false;
}
