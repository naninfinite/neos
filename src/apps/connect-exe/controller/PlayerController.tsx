import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { connectRuntimeStore, useConnectRuntimeState } from '../runtime/store';

const WALK_SPEED = 4.0;
const SPRINT_SPEED = 7.5;
const JUMP_FORCE = 6.0;
const GRAVITY = -15.0;

const STAMINA_DRAIN_SPRINT = 15.0;
const STAMINA_RECOVERY = 10.0;
const BASE_JUMP_COST = 15.0;
const BUNNY_HOP_MULTIPLIER = 0.5;

export function PlayerController() {
  const { camera } = useThree();
  const state = useConnectRuntimeState();
  const player = state.players.local;

  const [keys, setKeys] = useState({
    w: false, a: false, s: false, d: false,
    shift: false, space: false,
  });

  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const position = useRef(new Vector3(...player.transform.position));
  
  // Stamina and jump tracking
  const consecutiveJumps = useRef(0);
  const timeSinceLastJump = useRef(0);
  const isGrounded = useRef(true);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) setKeys((k) => ({ ...k, [key]: true }));
      if (e.key === 'Shift') setKeys((k) => ({ ...k, shift: true }));
      if (e.key === ' ') setKeys((k) => ({ ...k, space: true }));
      if (key === 'm') {
        const isCurrentlyOpen = connectRuntimeStore.getState().players.local.isMapOpen;
        connectRuntimeStore.setMapOpen('local', !isCurrentlyOpen);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) setKeys((k) => ({ ...k, [key]: false }));
      if (e.key === 'Shift') setKeys((k) => ({ ...k, shift: false }));
      if (e.key === ' ') setKeys((k) => ({ ...k, space: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    // Map freeze logic
    if (player.isMovementFrozen) {
      velocity.current.set(0, 0, 0);
      return;
    }

    let currentStamina = player.stamina;
    let sprinting = keys.shift && player.isSprintEnabled && currentStamina > 0;
    
    // Decay consecutive jump count over time
    if (isGrounded.current) {
      timeSinceLastJump.current += delta;
      if (timeSinceLastJump.current > 0.5) {
        consecutiveJumps.current = 0;
      }
    }

    // Stamina Recovery vs Drain
    const isMoving = keys.w || keys.a || keys.s || keys.d;
    if (sprinting && isMoving && isGrounded.current) {
      currentStamina -= STAMINA_DRAIN_SPRINT * delta;
    } else if (!sprinting && isGrounded.current) {
      currentStamina += STAMINA_RECOVERY * delta;
    }
    
    // Jump logic
    if (keys.space && isGrounded.current && player.isJumpEnabled) {
      const jumpCost = BASE_JUMP_COST * (1 + consecutiveJumps.current * BUNNY_HOP_MULTIPLIER);
      // Can jump even at 0 stamina, but it sets stamina to 0 and we still track it
      currentStamina -= jumpCost;
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
      consecutiveJumps.current += 1;
      timeSinceLastJump.current = 0;
      // Release key to prevent repeated jumps without lifting
      setKeys((k) => ({ ...k, space: false }));
    }

    currentStamina = Math.max(0, Math.min(100, currentStamina));
    if (Math.abs(currentStamina - player.stamina) > 0.1) {
      connectRuntimeStore.setPlayerStamina('local', currentStamina);
    }

    // Kinematic Movement
    const speed = sprinting ? SPRINT_SPEED : WALK_SPEED;
    
    direction.current.set(
      (keys.d ? 1 : 0) - (keys.a ? 1 : 0),
      0,
      (keys.s ? 1 : 0) - (keys.w ? 1 : 0)
    ).normalize().multiplyScalar(speed);

    // Apply camera rotation to movement
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    velocity.current.x = direction.current.x * right.x + direction.current.z * forward.x;
    velocity.current.z = direction.current.x * right.z + direction.current.z * forward.z;

    // Apply gravity
    if (!isGrounded.current) {
      velocity.current.y += GRAVITY * delta;
    }

    // Update position
    position.current.x += velocity.current.x * delta;
    position.current.y += velocity.current.y * delta;
    position.current.z += velocity.current.z * delta;

    // Simple floor collision (y = 0 is foot level, camera is higher)
    const CAMERA_HEIGHT = 1.7;
    if (position.current.y <= 0) {
      position.current.y = 0;
      velocity.current.y = 0;
      isGrounded.current = true;
    } else {
      isGrounded.current = false;
    }

    // Update camera and store
    camera.position.set(position.current.x, position.current.y + CAMERA_HEIGHT, position.current.z);
    
    // Heading for compass
    const euler = camera.rotation;
    
    connectRuntimeStore.setPlayerTransform('local', [position.current.x, position.current.y, position.current.z], euler.y);
  });

  return null;
}
