export class MouseTracker {
  mousePos: {
    x: number;
    y: number;
    relativeX: number;
    relativeY: number;
  };
  windowSize: {
    width: number;
    height: number;
  };
  constructor() {
    this.windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.mousePos = {
      x: 0,
      y: 0,
      relativeX: 0,
      relativeY: 0,
    };
    window.addEventListener("mousemove", (event: MouseEvent) => {
      this.mousePos = {
        x: event.clientX,
        y: event.clientY,
        relativeX: this.calculateRelativePos(
          event.clientX,
          this.windowSize.width
        ),
        relativeY: this.calculateRelativePos(
          event.clientY,
          this.windowSize.height
        ),
      };
    });

    window.addEventListener("resize", (_: UIEvent) => {
      this.windowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    });
  }

  calculateRelativePos(pos: number, max: number) {
    const center = max / 2;
    return (pos - center) / center;
  }
}
