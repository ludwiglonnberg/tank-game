import { startConnection } from "./websocket";
import "./styles.css";
const waitingDiv = document.getElementById("waitingMessage");
waitingDiv?.classList.remove("hidden");
// Koppla knappen till startGame
window.onload = () => {
  console.log("game starting...");
  startConnection();
};
