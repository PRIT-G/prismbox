import { describe, expect, it } from 'vitest';

function handleShortcut(
  e: { key: string; mod: boolean; shift: boolean },
  state: { selectedId: string | null; isTyping: boolean },
  actions: {
    onGizmo: (m: 'translate' | 'rotate' | 'scale') => void;
    onFocus: () => void;
    onUndo: () => void;
    onRedo: () => void;
  },
) {
  if (state.isTyping) return;
  const k = e.key.toLowerCase();
  if (e.mod && k === 'z') {
    if (e.shift) actions.onRedo();
    else actions.onUndo();
    return;
  }
  if (e.mod && k === 'y') {
    actions.onRedo();
    return;
  }
  if (!e.mod && state.selectedId) {
    if (k === 'g' || k === 'w') actions.onGizmo('translate');
    else if (k === 'r' || k === 'e') actions.onGizmo('rotate');
    else if (k === 's') actions.onGizmo('scale');
    else if (k === 'f') actions.onFocus();
  }
}

describe('keyboard shortcuts handling (Issue #2 & #4)', () => {
  it('switches to translate on G, rotate on R, scale on S when a node is selected', () => {
    let mode: string | null = null;
    const actions = {
      onGizmo: (m: 'translate' | 'rotate' | 'scale') => { mode = m; },
      onFocus: () => {},
      onUndo: () => {},
      onRedo: () => {},
    };

    handleShortcut({ key: 'g', mod: false, shift: false }, { selectedId: 'mesh-1', isTyping: false }, actions);
    expect(mode).toBe('translate');

    handleShortcut({ key: 'r', mod: false, shift: false }, { selectedId: 'mesh-1', isTyping: false }, actions);
    expect(mode).toBe('rotate');

    handleShortcut({ key: 's', mod: false, shift: false }, { selectedId: 'mesh-1', isTyping: false }, actions);
    expect(mode).toBe('scale');
  });

  it('triggers focus on F when a node is selected', () => {
    let focused = false;
    const actions = {
      onGizmo: () => {},
      onFocus: () => { focused = true; },
      onUndo: () => {},
      onRedo: () => {},
    };

    handleShortcut({ key: 'f', mod: false, shift: false }, { selectedId: 'mesh-1', isTyping: false }, actions);
    expect(focused).toBe(true);
  });

  it('does nothing when no node is selected', () => {
    let called = false;
    const actions = {
      onGizmo: () => { called = true; },
      onFocus: () => { called = true; },
      onUndo: () => {},
      onRedo: () => {},
    };

    handleShortcut({ key: 'g', mod: false, shift: false }, { selectedId: null, isTyping: false }, actions);
    handleShortcut({ key: 's', mod: false, shift: false }, { selectedId: null, isTyping: false }, actions);
    handleShortcut({ key: 'f', mod: false, shift: false }, { selectedId: null, isTyping: false }, actions);
    expect(called).toBe(false);
  });

  it('does not trigger gizmo switch when typing in an input or textarea', () => {
    let mode: string | null = null;
    const actions = {
      onGizmo: (m: 'translate' | 'rotate' | 'scale') => { mode = m; },
      onFocus: () => {},
      onUndo: () => {},
      onRedo: () => {},
    };

    handleShortcut({ key: 'g', mod: false, shift: false }, { selectedId: 'mesh-1', isTyping: true }, actions);
    expect(mode).toBeNull();

    handleShortcut({ key: 's', mod: false, shift: false }, { selectedId: 'mesh-1', isTyping: true }, actions);
    expect(mode).toBeNull();
  });

  it('does not trigger scale when Cmd/Ctrl+S is pressed', () => {
    let mode: string | null = null;
    const actions = {
      onGizmo: (m: 'translate' | 'rotate' | 'scale') => { mode = m; },
      onFocus: () => {},
      onUndo: () => {},
      onRedo: () => {},
    };

    handleShortcut({ key: 's', mod: true, shift: false }, { selectedId: 'mesh-1', isTyping: false }, actions);
    expect(mode).toBeNull();
  });
});
