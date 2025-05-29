import * as signalR from "@microsoft/signalr";
import { startGame } from "./game";
import { tank, otherPlayers, showGameOverScreen } from "./game";
export let playerId: string;
const userId = localStorage.getItem("userId");
const username = localStorage.getItem("userName");

if (!userId) {
  alert("You need to log in to play!");
  window.location.href = "/login.html";
}

// När du ansluter SignalR:

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5166";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${backendUrl}/gamehub`)
  .withAutomaticReconnect()
  .build();

export async function startConnection() {
  try {
    await connection.start();

    connection.on("ReceivePlayerId", async (id: string) => {
      playerId = id;
      console.log("Your serverID:", playerId);

      if (userId !== null) {
        await connection.invoke("RegisterPlayer", username, userId);
      } else {
        console.error("userId is null, cannot register player.");
      }
    });
  } catch (err) {
    console.error("SignalR connection failed:", err);
    setTimeout(startConnection, 2000);
  }
}
// ===== SEND =====
export function sendBullet(
  playerId: string,
  x: number,
  y: number,
  dx: number,
  dy: number,
  angle: number
) {
  if (connection.state === signalR.HubConnectionState.Connected) {
    connection
      .invoke("BulletFired", playerId, x, y, dx, dy, angle)
      .catch(console.error);
  }
}
export function sendPlayerPosition(
  playerId: string,
  x: number,
  y: number,
  angle: number,
  turretAngle: number
) {
  if (connection.state === signalR.HubConnectionState.Connected) {
    connection
      .invoke("SendPlayerPosition", playerId, x, y, angle, turretAngle)
      .catch((err) => {
        console.error("SignalR invoke error:", err);
      });
  }
}
export function sendHit(playerId: string, damage: number) {
  connection.invoke("PlayerHit", playerId, damage).catch((err) => {
    console.error("Error sending hit:", err);
  });
}

export function sendBulletFired(
  playerId: string,
  x: number,
  y: number,
  dx: number,
  dy: number,
  angle: number
) {
  connection
    .invoke("SendBulletFired", playerId, x, y, dx, dy, angle)
    .catch((err) => {
      console.error("Failed to send bullet:", err);
    });
}

// =============
connection.on("MatchStarted", (spawnX: number, spawnY: number) => {
  const waitingDiv = document.getElementById("waitingMessage");
  waitingDiv?.classList.add("hidden");

  startGame(spawnX, spawnY);
});

connection.on("PlayerHealthUpdated", (id, newHealth) => {
  if (id === playerId) {
    tank.hp = newHealth;

    console.log(`Your hp updated: ${newHealth}`);
  } else if (otherPlayers[id]) {
    otherPlayers[id].hp = newHealth;
    console.log(`User (${id}) hp updated: ${newHealth}`);
  }
});
connection.on("GameOver", (winnerId, winnerName) => {
  const isWinner = userId === winnerId;

  showGameOverScreen(isWinner, winnerName);
});
export function onPlayerDied(callback: (playerId: string) => void) {
  connection.on("PlayerDied", callback);
}

// ===== RECEIVE =====
export function onReceivePlayerPosition(
  callback: (
    playerId: string,
    x: number,
    y: number,
    angle: number,
    turretAngle: number
  ) => void
) {
  connection.on("ReceivePlayerPosition", callback);
}

export function onReceiveBullet(
  callback: (
    playerId: string,
    x: number,
    y: number,
    dx: number,
    dy: number,
    angle: number
  ) => void
) {
  connection.on("ReceiveBullet", callback);
}

export function onReceiveBulletFired(
  callback: (
    playerId: string,
    x: number,
    y: number,
    dx: number,
    dy: number,
    angle: number
  ) => void
) {
  connection.on("ReceiveBulletFired", callback);
}
