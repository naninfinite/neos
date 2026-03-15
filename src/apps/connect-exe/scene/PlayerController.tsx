import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  connectRuntimeStore,
  WALK_SPEED,
  SPRINT_SPEED,
  GRAVITY,
  STAMINA_SPRINT_DRAIN,
} from '../runtime/store';

const MOUSE_SENSITIVITY = 0.002;
const PITCH_LIMIT = Math.PI / 2 - 0.05;
const PLAYER_HEIGHT = 1.7;

/** Tracks currently held keys. */
const keys = new Set<string>();

function onKeyDown(e: KeyboardEvent): void {
  keys.add(e.code);
}
function onKeyUp(e: KeyboardEvent): void {
  keys.delete(e.code);
}

/**
 * First-person controller using PointerLock.
 * Manages camera rotation, WASD movement, sprint, jump, and stamina.
 * All movement state writes go through connectRuntimeStore.
 */
export function PlayerController(): null {
  const { camera, gl } = useThree();
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const posRef = useRef(new THREE.Vector3(-2, 0, 1));
  const velYRef = useRef(0);
  const isLockedRef = useRef(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isLockedRef.current) return;
    yawRef.current -= e.movementX * MOUSE_SENSITIVITY;
    pitchRef.current -= e.movementY * MOUSE_SENSITIVITY;
    pitchRef.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitchRef.current));
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const onClick = () => {
      canvas.requestPointerLock();
    };

    const onLockChange = () => {
      isLockedRef.current = document.pointerLockElement === canvas;
    };

    canvas.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Initialise position from store
    const state = connectRuntimeStore.getState();
    const pos = state.players.local.transform.position;
    posRef.current.set(pos[0], pos[1], pos[2]);

    return () => {
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [gl.domElement, onMouseMove]);

  // Handle jump on Space press
  useEffect(() => {
    const handleJump = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const state = connectRuntimeStore.getState();
      const player = state.players.local;
      if (player.isMovementFrozen || !player.isJumpEnabled) return;
      if (!player.movement.isGrounded) return;
      connectRuntimeStore.recordJump('local');
      velYRef.current = connectRuntimeStore.getState().players.local.movement.velocityY;
    };
    document.addEventListener('keydown', handleJump);
    return () => document.removeEventListener('keydown', handleJump);
  }, []);

  // Handle map toggle on M/Tab
  useEffect(() => {
    const handleMap = (e: KeyboardEvent) => {
      if (e.code === 'KeyM' || e.code === 'Tab') {
        e.preventDefault();
        const state = connectRuntimeStore.getState();
        connectRuntimeStore.setMapOpen('local', !state.players.local.isMapOpen);
      }
    };
    document.addEventListener('keydown', handleMap);
    return () => document.removeEventListener('keydown', handleMap);
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1); // clamp large deltas
    const state = connectRuntimeStore.getState();
    const player = state.players.local;

    // Don't process movement when frozen or not in run
    if (player.isMovementFrozen) return;

    // ── Camera rotation ──
    const euler = new THREE.Euler(pitchRef.current, yawRef.current, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);

    // ── WASD movement ──
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawRef.current);
    const right = new THREE.Vector3(1, 0, 0);
    right.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawRef.current);

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (keys.has('KeyW') || keys.has('ArrowUp')) moveDir.add(forward);
    if (keys.has('KeyS') || keys.has('ArrowDown')) moveDir.sub(forward);
    if (keys.has('KeyD') || keys.has('ArrowRight')) moveDir.add(right);
    if (keys.has('KeyA') || keys.has('ArrowLeft')) moveDir.sub(right);

    const isMoving = moveDir.lengthSq() > 0;
    if (isMoving) moveDir.normalize();

    // ── Sprint ──
    const wantsSprint = keys.has('ShiftLeft') || keys.has('ShiftRight');
    const canSprint = player.isSprintEnabled && player.stamina.current > 0 && !player.stamina.isExhausted;
    const isSprinting = wantsSprint && canSprint && isMoving;

    const speed = isSprinting ? SPRINT_SPEED : WALK_SPEED;

    // Sprint stamina drain
    if (isSprinting) {
      connectRuntimeStore.drainStamina('local', STAMINA_SPRINT_DRAIN * dt);
    } else if (!isSprinting && isMoving) {
      // Recover stamina while walking (not sprinting)
      connectRuntimeStore.recoverStamina('local', dt);
    } else {
      // Recover stamina while standing
      connectRuntimeStore.recoverStamina('local', dt);
    }

    // ── Apply horizontal movement ──
    posRef.current.x += moveDir.x * speed * dt;
    posRef.current.z += moveDir.z * speed * dt;

    // ── Gravity / jump ──
    velYRef.current += GRAVITY * dt;
    posRef.current.y += velYRef.current * dt;

    // Ground check (simple flat ground at y=0)
    if (posRef.current.y <= 0) {
      posRef.current.y = 0;
      velYRef.current = 0;
      if (!player.movement.isGrounded) {
        connectRuntimeStore.updateMovement('local', {
          isGrounded: true,
          isJumping: false,
          velocityY: 0,
        });
      }
    } else {
      connectRuntimeStore.updateMovement('local', {
        isGrounded: false,
        velocityY: velYRef.current,
      });
    }

    // Update sprint state
    connectRuntimeStore.updateMovement('local', { isSprinting });

    // ── Set camera position ──
    camera.position.set(
      posRef.current.x,
      posRef.current.y + PLAYER_HEIGHT,
      posRef.current.z,
    );

    // ── Write transform to store ──
    connectRuntimeStore.setPlayerTransform(
      'local',
      [posRef.current.x, posRef.current.y, posRef.current.z],
      yawRef.current,
      pitchRef.current,
    );
  });

  return null;
}
