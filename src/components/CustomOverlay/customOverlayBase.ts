
interface IOptions {
  point: BMap.Point;
  wrapper: HTMLElement;
}
// @ts-ignore
class CustomOverlayBase extends BMap.Overlay {
  private point: BMap.Point;
  private wrapper: HTMLElement;
  constructor({ point, wrapper }: IOptions) {
    super();
    this.point = point;
    this.wrapper = wrapper;
  }
  initialize(map: BMap.Map): HTMLElement {
    // this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'absolute';
    this.wrapper.style.whiteSpace = 'nowrap';
    // @ts-ignore
    this.wrapper.style.zIndex = BMap.Overlay.getZIndex(this.point.lat);
    const labelPane = map.getPanes().labelPane;

    if (labelPane) {
      labelPane.appendChild(this.wrapper);
      // render(this.child, this.wrapper);
    }

    return this.wrapper;
  }
  draw() {
    
  }
}

export default CustomOverlayBase;
