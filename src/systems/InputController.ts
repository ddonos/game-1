export type MovementVector = {
  x: number;
  y: number;
};

const ACTION_KEYS = {
  left: new Set(["ArrowLeft", "KeyA"]),
  right: new Set(["ArrowRight", "KeyD"]),
  up: new Set(["ArrowUp", "KeyW"]),
  down: new Set(["ArrowDown", "KeyS"]),
  fire: new Set(["Space"]),
  restart: new Set(["KeyR"]),
  continue: new Set(["Enter", "NumpadEnter"])
};

export class InputController {
  private readonly pressedKeys = new Set<string>();
  private readonly abortController = new AbortController();
  private queuedPointerFire = false;
  private queuedRestart = false;
  private queuedContinue = false;

  constructor(target: Window = window) {
    target.addEventListener("keydown", this.handleKeyDown, {
      signal: this.abortController.signal
    });
    target.addEventListener("keyup", this.handleKeyUp, {
      signal: this.abortController.signal
    });
    target.addEventListener("blur", this.handleBlur, {
      signal: this.abortController.signal
    });
    target.addEventListener("pointerdown", this.handlePointerDown, {
      signal: this.abortController.signal
    });
  }

  getMovement(): MovementVector {
    const x = Number(this.hasAction("right")) - Number(this.hasAction("left"));
    const y = Number(this.hasAction("up")) - Number(this.hasAction("down"));

    if (x !== 0 && y !== 0) {
      const normalized = Math.SQRT1_2;
      return { x: x * normalized, y: y * normalized };
    }

    return { x, y };
  }

  isFirePressed(): boolean {
    return this.hasAction("fire");
  }

  consumePointerFire(): boolean {
    const shouldFire = this.queuedPointerFire;
    this.queuedPointerFire = false;
    return shouldFire;
  }

  consumeRestart(): boolean {
    const shouldRestart = this.queuedRestart;
    this.queuedRestart = false;
    return shouldRestart;
  }

  consumeContinue(): boolean {
    const shouldContinue = this.queuedContinue;
    this.queuedContinue = false;
    return shouldContinue;
  }

  dispose(): void {
    this.abortController.abort();
    this.pressedKeys.clear();
  }

  private hasAction(action: keyof typeof ACTION_KEYS): boolean {
    for (const key of ACTION_KEYS[action]) {
      if (this.pressedKeys.has(key)) {
        return true;
      }
    }

    return false;
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (isActionKey(event.code)) {
      event.preventDefault();
      this.pressedKeys.add(event.code);

      if (this.hasAction("restart")) {
        this.queuedRestart = true;
      }

      if (this.hasAction("continue")) {
        this.queuedContinue = true;
      }
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (isActionKey(event.code)) {
      event.preventDefault();
      this.pressedKeys.delete(event.code);
    }
  };

  private readonly handleBlur = (): void => {
    this.pressedKeys.clear();
    this.queuedPointerFire = false;
    this.queuedRestart = false;
    this.queuedContinue = false;
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.target instanceof Element && event.target.closest("button")) {
      return;
    }

    if (event.button === 0) {
      this.queuedPointerFire = true;
    }
  };
}

function isActionKey(code: string): boolean {
  return Object.values(ACTION_KEYS).some((keys) => keys.has(code));
}
