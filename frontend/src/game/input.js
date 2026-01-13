export function createInputState() {
  const state = {
    left: false,
    right: false,
    jump: false,
    action: false,
  };

  function updateKey(event, isDown) {
    switch (event.code) {
      case "ArrowLeft":
        event.preventDefault();
        state.left = isDown;
        break;
      case "ArrowRight":
        event.preventDefault();
        state.right = isDown;
        break;
      case "ArrowUp":
        event.preventDefault();
        state.jump = isDown;
        break;
      case "ShiftRight":
        event.preventDefault();
        state.action = isDown;
        break;
      case "Space":
        event.preventDefault();
        state.action = isDown;
        break;
      default:
        break;
    }
  }

  window.addEventListener("keydown", (event) => updateKey(event, true));
  window.addEventListener("keyup", (event) => updateKey(event, false));

  return state;
}
