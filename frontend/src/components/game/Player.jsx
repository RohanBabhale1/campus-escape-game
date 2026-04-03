/**
 * Player.jsx — First-person physics player controller
 *
 * Fixes:
 *  1. File previously exported RoomDoor (wrong component entirely)
 *  2. Pointer lock is released when a puzzle opens so the HTML puzzle UI
 *     is clickable (was causing the "E gets stuck" bug)
 *  3. Player spawns at [0, 2.5, 8] — away from the centre pillar at [0,5,0]
 *     (was the "laser from player's head" bug)
 */

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { Vector3 } from "three";
import useGameStore from "../../store/useGameStore";
import { useKeyboard } from "../../hooks/useKeyboard";

// Spawn away from the magenta CentrePillar which sits at [0, 5, 0]
const SPAWN = [0, 2.5, 8];
const WALK_SPEED = 8;
const SPRINT_SPEED = 14;
const JUMP_VEL = 9;
const EYE_HEIGHT = 1.6; // camera offset above rigid-body centre

export default function Player() {
  const rigidBodyRef = useRef(null);
  const { camera, gl } = useThree();
  const keys = useKeyboard();

  const setPlayerPosition = useGameStore((s) => s.setPlayerPosition);
  const isPaused = useGameStore((s) => s.isPaused);
  const setPaused = useGameStore((s) => s.setPaused);
  const activePuzzle = useGameStore((s) => s.activePuzzle);

  const yaw = useRef(0); // horizontal look (radians)
  const pitch = useRef(-0.15); // vertical look (radians, clamped)

  // ── Pointer-lock setup ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseMove = (e) => {
      if (document.pointerLockElement !== canvas) return;
      yaw.current -= e.movementX * 0.002;
      pitch.current = Math.max(
        -1.5,
        Math.min(1.5, pitch.current - e.movementY * 0.002),
      );
    };

    // Click the canvas to acquire pointer lock (only when not paused/puzzle open)
    const onCanvasClick = () => {
      if (document.pointerLockElement || isPaused || activePuzzle) return;
      canvas.requestPointerLock();
    };

    // ESC → exit lock and show pause menu
    const onKeyDown = (e) => {
      if (e.code === "Escape") {
        if (document.pointerLockElement === canvas) document.exitPointerLock();
        setPaused(true);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onCanvasClick);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onCanvasClick);
      window.removeEventListener("keydown", onKeyDown);
      // Always release lock on unmount
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };
    // Re-register if pause/puzzle state changes so the handler sees fresh values
  }, [gl, isPaused, activePuzzle, setPaused]);

  // ── KEY FIX: Release pointer lock when puzzle opens or game pauses ────────
  // Without this, the mouse stays locked and the puzzle UI (HTML buttons/inputs)
  // can't be clicked → the "E gets stuck, nothing happens" bug.
  useEffect(() => {
    if ((activePuzzle || isPaused) && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [activePuzzle, isPaused]);

  // ── KEY FIX: Stop falling through floor when scene swaps ────────
  const activeScene = useGameStore((s) => s.activeScene);
  useEffect(() => {
    if (rigidBodyRef.current) {
      // Instantly teleport to safe spawn and zero out velocity when 
      // tearing down old rooms and rendering new ones
      rigidBodyRef.current.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [activeScene]);

  // ── Per-frame: camera + movement ─────────────────────────────────────────
  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const pos = rigidBodyRef.current.translation();
    const curVel = rigidBodyRef.current.linvel();

    // Camera follows player eyes
    camera.position.set(pos.x, pos.y + EYE_HEIGHT, pos.z);
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    // Push world position into the store so doors/puzzles can check proximity
    setPlayerPosition({ x: pos.x, y: pos.y, z: pos.z });

    // Don't move while paused or puzzle is open
    if (isPaused || activePuzzle) return;

    // ── WASD movement ──────────────────────────────────────────────────────
    const speed = keys.current.sprint ? SPRINT_SPEED : WALK_SPEED;
    const sinYaw = Math.sin(yaw.current);
    const cosYaw = Math.cos(yaw.current);

    let vx = 0,
      vz = 0;
    if (keys.current.forward) {
      vx -= sinYaw * speed;
      vz -= cosYaw * speed;
    }
    if (keys.current.backward) {
      vx += sinYaw * speed;
      vz += cosYaw * speed;
    }
    if (keys.current.right) {
      vx += cosYaw * speed;
      vz -= sinYaw * speed;
    }
    if (keys.current.left) {
      vx -= cosYaw * speed;
      vz += sinYaw * speed;
    }

    // ── Jump (only when roughly on the ground) ─────────────────────────────
    const onGround = curVel.y > -2 && pos.y < 2.5;
    let vy = curVel.y;
    if (keys.current.jump && onGround) {
      vy = JUMP_VEL;
      keys.current.jump = false; // consume so holding space doesn't bunny-hop
    }

    rigidBodyRef.current.setLinvel({ x: vx, y: vy, z: vz }, true);

    // Safety respawn if player falls through the floor
    if (pos.y < -30) {
      rigidBodyRef.current.setTranslation(
        { x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] },
        true,
      );
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={SPAWN}
      enabledRotations={[false, false, false]}
      mass={70}
      friction={0}
      restitution={0}
      linearDamping={15} // high damping → snappy stop when keys released
      colliders={false} // we provide our own collider below
    >
      {/* Capsule collider: halfHeight=0.5, radius=0.4 → total height ≈ 1.8 */}
      <CapsuleCollider args={[0.5, 0.4]} />
    </RigidBody>
  );
}
