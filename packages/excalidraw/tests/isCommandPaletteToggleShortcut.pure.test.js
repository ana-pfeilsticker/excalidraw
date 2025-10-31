const KEYS = { CTRL_OR_CMD: "ctrlKey", P: "p", SLASH: "/" };

function isCommandPaletteToggleShortcut(event) {
  return (
    !event.altKey &&
    event[KEYS.CTRL_OR_CMD] &&
    ((event.shiftKey && event.key.toLowerCase() === KEYS.P) ||
      event.key === KEYS.SLASH)
  );
}

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

  it("CT1: Base: Ctrl/Cmd + Shift + p", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(true);
  });

  it("CT2: A falso (Alt cancela)", () => {
    const event = makeEvent({
      altKey: true,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("CT3: B falso (sem Ctrl/Cmd)", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: false,
      shiftKey: true,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("CT4: Caminho alternativo: Ctrl/Cmd + '/'", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "/",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(true);
  });

  it("CT5: Nenhum atalho válido", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "x",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("CT6: C falso com D verdadeiro (sem Shift)", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("CT7: D falso com C verdadeiro (tecla ≠ 'p')", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "x",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("CT8: Ctrl/Cmd + Shift + 'P' (case-insensitive)", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: true,
      key: "P",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(true);
  });

  it("CT9: Alt cancela até o caminho '/'", () => {
    const event = makeEvent({
      altKey: true,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "/",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });

  it("CT10: Ctrl/Cmd + 'p' sem Shift (incompleto)", () => {
    const event = makeEvent({
      altKey: false,
      ctrlOrCmd: true,
      shiftKey: false,
      key: "p",
    });
    expect(isCommandPaletteToggleShortcut(event)).toBe(false);
  });
});
