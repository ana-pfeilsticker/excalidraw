const {
  isCommandPaletteToggleShortcut,
} = require("../components/CommandPalette/isCommandPaletteToggleShortcut.pure");
describe("isCommandPaletteToggleShortcut (pure)", () => {
  function makeEvent(params) {
    const { altKey, ctrlOrCmd, shiftKey, key } = params;
    return {
      altKey,
      shiftKey,
      key,
      ctrlKey: ctrlOrCmd,
      metaKey: ctrlOrCmd,
    };
  }

  it("should return true for Ctrl/Cmd + Shift + p", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(true);
  });

  it("should return false when Alt is pressed", () => {
    const event = makeEvent({
      altKey: true,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("should return false when Ctrl/Cmd is not pressed", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: false,
      shiftKey: true,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("should return true for Ctrl/Cmd + '/'", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "/",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(true);
  });

  it("should return false for invalid shortcut", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "x",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("should return false for Ctrl/Cmd + p without Shift", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("should return false for Ctrl/Cmd + Shift + non-p key", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "x",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("should return true for Ctrl/Cmd + Shift + 'P' (uppercase)", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "P",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(true);
  });

  it("should return false when Alt is pressed with '/' shortcut", () => {
    const event = makeEvent({
      altKey: true,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "/",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("should return false for Ctrl/Cmd + p without Shift (incomplete)", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });
});
