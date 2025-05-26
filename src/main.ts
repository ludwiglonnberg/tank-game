import { startConnection } from "./websocket";
const waitingDiv = document.getElementById("waitingMessage");
waitingDiv?.classList.remove("hidden");
// Koppla knappen till startGame
window.onload = () => {
  console.log("game starting...");
  startConnection();
};
