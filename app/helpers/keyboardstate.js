class KeyboardState {

  constructor() {
    this.keyCodes	= {};
    this.modifiers	= {};

    this.MODSBIG	= [ 'shift', 'ctrl', 'alt', 'meta' ];
    this.ALIAS	= {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      space: 32,
      pageup: 33,
      pagedown: 34,
      tab: 9
    };

    this._onKeyDown	= (event) => { this._onKeyChange(event, true); };
    this._onKeyUp	= (event) => { this._onKeyChange(event, false); };

    // bind keyEvents
    document.addEventListener('keydown', this._onKeyDown, false);
    document.addEventListener('keyup', this._onKeyUp, false);
  }

  destroy = () => {
    // unbind keyEvents
    document.removeEventListener('keydown', this._onKeyDown, false);
    document.removeEventListener('keyup', this._onKeyUp, false);
  }

  _onKeyChange = (event, pressed) => {
    // update this.keyCodes
    const keyCode	= event.keyCode;
    this.keyCodes[keyCode]	= pressed;

    // update this.modifiers
    this.modifiers.shift = event.shiftKey;
    this.modifiers.ctrl = event.ctrlKey;
    this.modifiers.alt = event.altKey;
    this.modifiers.meta = event.metaKey;
  }

  pressed = (keyDesc) => {
    const keys	= keyDesc.split('+');
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let pressed;
      if (this.MODSBIG.indexOf(key) !== -1) {
        pressed	= this.modifiers[key];
      } else if (Object.keys(this.ALIAS).indexOf(key) !== -1) {
        pressed	= this.keyCodes[this.ALIAS[key]];
      } else {
        pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)];
      }
      if (!pressed)	return false;
    }
    return true;
  }
}

export default KeyboardState;
