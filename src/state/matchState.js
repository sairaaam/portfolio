// Frame-loop side-channel between scene components and UI. Plain mutable
// object — written/read inside useFrame and small polling intervals, so no
// React re-renders are involved.
export const matchState = {
  // Penalty shot state machine:
  //   'idle'      — waiting at the spot, prompt visible
  //   'requested' — user pressed SPACE; player is turning toward the goal
  //   'shooting'  — kick animation running / ball in flight
  //   'scored'    — ball in the net
  shot: 'idle',
  // normalized kick-clip progress (0–1) published by Player each frame
  kickProgress: 0,
  // clock.elapsedTime when the ball left the boot; -1 = not launched
  launchedAt: -1,
  // clock.elapsedTime when the ball hit the net; -1 = no impact yet
  netImpactAt: -1,
}

export function resetShot() {
  matchState.shot = 'idle'
  matchState.kickProgress = 0
  matchState.launchedAt = -1
  matchState.netImpactAt = -1
}
