import { Tank } from "./tank";
import { handleInput } from "./input.js";
import { drawScene, drawBackgound, generateGrassMap } from "./renderer";
import { Bullet } from "./bullet";
import {
  isBulletCollidingWithWall,
  checkBulletHitsOnTanks,
  checkIfPlayerGotHit,
} from "./collision";
import { Explosion } from "./explosion";
import {
  sendPlayerPosition,
  onReceivePlayerPosition,
  onReceiveBullet,
  playerId,
  sendHit,
} from "./websocket";

export let tank: Tank;
let mouseX = 0;
let mouseY = 0;

export const bullets: Bullet[] = [];
export const otherPlayers: { [id: string]: Tank } = {};
const otherPlayersBullets: { [playerId: string]: Bullet[] } = {};
const explosions: Explosion[] = [];
const explosionImage = new Image();
const tankExplosionImage = new Image();
tankExplosionImage.src = "assets/explosion1.png";
explosionImage.src = "assets/smoke1.png"; // anpassa sökvägen efter ditt projekt

export async function showGameOverScreen(
  won: boolean,
  winnerName: string,
  winnerId: string
) {
  const modal = document.getElementById("gameOverModal")!;
  const message = document.getElementById("gameOverMessage")!;
  const winnerInfo = document.getElementById("winnerInfo")!;
  const button = document.getElementById("returnToMenuBtn")!;
  const userId = localStorage.getItem("userId");

  if (userId) {
    try {
      await fetch("http://localhost:5166/api/user/updateStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          won: won,
        }),
      });
    } catch (error) {
      console.error("Misslyckades uppdatera statistik:", error);
    }
  } else {
    console.error("userId saknas, kan inte uppdatera statistik");
  }

  message.textContent = won
    ? "Congratulations, you won!"
    : "You lost, better luck next time!";
  winnerInfo.textContent = `Winner: ${winnerName}`;
  modal.classList.remove("hidden");

  button.onclick = () => {
    window.location.href = "/home.html";
  };
}

export function startGame(spawnX: number, spawnY: number) {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  generateGrassMap();
  drawBackgound(ctx!);
  tank = new Tank(spawnX, spawnY, playerId); // Startposition

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener("click", () => {
    tank.shoot(mouseX, mouseY, playerId);
  });

  onReceivePlayerPosition((id, x, y, angle, turretAngle) => {
    if (id === playerId) return;
    if (!otherPlayers[id]) {
      otherPlayers[id] = new Tank(x, y, id);
    } else {
      otherPlayers[id].x = x;
      otherPlayers[id].y = y;
    }
    otherPlayers[id].angle = angle;
    otherPlayers[id].turretAngle = turretAngle;
  });

  onReceiveBullet((id, x, y, dx, dy, angle) => {
    if (id === playerId) return;
    const bullet = new Bullet(x, y, dx, dy, angle);
    if (!otherPlayersBullets[id]) {
      otherPlayersBullets[id] = [];
    }
    otherPlayersBullets[id].push(bullet);
  });

  function gameLoop() {
    handleInput(tank);

    bullets.forEach((b) => b.update());
    for (const id in otherPlayersBullets) {
      otherPlayersBullets[id].forEach((b) => b.update());
    }

    drawScene(ctx!, tank, mouseY, mouseX, otherPlayers);

    bullets.forEach((b) => b.draw(ctx!));
    for (const id in otherPlayersBullets) {
      otherPlayersBullets[id].forEach((b) => b.draw(ctx!));
    }

    explosions.forEach((exp, i) => {
      exp.update();
      exp.draw(ctx!); // du kan spara explosionImage tidigare om du vill
      if (exp.done) explosions.splice(i, 1);
    });

    // Kulor som träffar väggar
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (isBulletCollidingWithWall(bullet, 64)) {
        explosions.push(new Explosion(bullet.x, bullet.y, explosionImage));
        bullets.splice(i, 1);
      }
    }

    // 🔥 Spelarens kulor träffar andra
    checkBulletHitsOnTanks(
      bullets,
      otherPlayers,
      explosions,
      tankExplosionImage,
      (enemyId, i) => {
        bullets.splice(i, 1);
        sendHit(enemyId, 25);
      }
    );
    // 🔥 Andras kulor träffar spelaren
    checkIfPlayerGotHit(
      tank,
      otherPlayersBullets,
      explosions,
      tankExplosionImage,
      () => {} // tom, explosion sköts ändå inuti
    );

    sendPlayerPosition(playerId, tank.x, tank.y, tank.angle, tank.turretAngle);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
