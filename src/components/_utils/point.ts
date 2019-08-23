export interface IPoint {
  lng: number;
  lat: number;
}
export interface IOffset {
  left?: number;
  top?: number;
}
export interface ISize {
  width?: number;
  height?: number;
}
export interface EventParamsBase {
  type: string;
  target: any;
  point: BMap.Point;
  pixel: BMap.Pixel;
  overlay: BMap.Overlay;
  zoom: number;
  size: BMap.Size;
  isOpen:boolean;
}
