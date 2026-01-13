const MOVE_SPEED = 215;
const JUMP_SPEED = -480;
const GRAVITY = 900;

export function applyPhysics(state, dt) {
  const { player, input } = state;

  player.velocity.x = 0;
  if (input.left) {
    player.velocity.x = -MOVE_SPEED;
  }
  if (input.right) {
    player.velocity.x = MOVE_SPEED;
  }

  player.isMoving = player.velocity.x !== 0;
  if (player.isMoving) {
    player.facing = player.velocity.x > 0 ? 1 : -1;
  }

  if (input.jump && player.isGrounded) {
    player.velocity.y = JUMP_SPEED;
    player.isGrounded = false;
  }

  player.velocity.y += GRAVITY * dt;
  player.position.x += player.velocity.x * dt;
  player.position.y += player.velocity.y * dt;
}
