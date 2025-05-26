const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

import { Tank } from "./tank";

export function handleInput(tank: Tank) {
  if (keys["w"]) {
    tank.move(0, -1);
  }
  if (keys["s"]) {
    tank.move(0, 1);
  }
  if (keys["a"]) {
    tank.move(-1, 0);
  }
  if (keys["d"]) {
    tank.move(1, 0);
  }
  if (keys[" "]) {
    tank.dash();
  }
}
