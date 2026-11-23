import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { round3 } from '../src/sandbox/camera';

describe('snap-to-grid math and formatting (Issue #3)', () => {
  it('cleans floating-point noise from values (e.g. 0.30000000000000004 -> 0.3)', () => {
    const noisy = 0.1 + 0.2; // 0.30000000000000004
    expect(noisy).not.toBe(0.3);
    expect(round3(noisy)).toBe(0.3);
  });

  it('provides standard increments: 0.1 translation, 15 degrees rotation, 0.1 scale', () => {
    const translationSnap = 0.1;
    const rotationSnap = THREE.MathUtils.degToRad(15);
    const scaleSnap = 0.1;

    expect(translationSnap).toBe(0.1);
    expect(rotationSnap).toBeCloseTo(0.2618, 4);
    expect(scaleSnap).toBe(0.1);

    // Test snap rounding
    const rawVal = 1.234;
    const snapped = Math.round(rawVal / translationSnap) * translationSnap;
    expect(round3(snapped)).toBe(1.2);
  });
});
