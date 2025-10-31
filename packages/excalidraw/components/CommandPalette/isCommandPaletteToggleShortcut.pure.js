const KEYS = { CTRL_OR_CMD: "ctrlKey", P: "p", SLASH: "/" };

function isCommandPaletteToggleShortcut(event) {
  return (
    !event.altKey &&
    event[KEYS.CTRL_OR_CMD] &&
    ((event.shiftKey && event.key.toLowerCase() === KEYS.P) ||
      event.key === KEYS.SLASH)
  );
}

module.exports = { isCommandPaletteToggleShortcut };
