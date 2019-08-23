declare namespace BMapLib {
    interface Overlay {
      initialize?(map: BMap.Map): HTMLElement;
      isVisible?(): boolean;
      draw?(): void;
      show?(): void;
      hide?(): void;
    }
    interface IEventListenerProps {
      addEventListener(event: string, handler: (...args: any[]) => void): void;
      removeEventListener(event: string, handler: (...args: any[]) => void): void;
    }
    interface RichMarker extends Overlay, IEventListenerProps {
      enableDragging(): void;
      disableDragging(): void;
      setPosition(position: BMap.Point): void;
      getPosition(): BMap.Point;
      setAnchor(anchor: BMap.Size): void;
      getAnchor(): BMap.Size;
      addEventListener(event: string, handler: () => void): void;
      removeEventListener(event: string, handler: () => void): void;
      onclick: (event: { type: string; target: any }) => void;
    }
    class RichMarker {
      constructor(content: HTMLElement, position: BMap.Point, opts?: RichMarkerOptions);
    }
    interface RichMarkerOptions {
      enableDragging?: boolean;
      anchor?: BMap.Size;
    }
    interface DrawingManager extends IEventListenerProps {
      close(): void;
      open(): void;
      disableCalculate(): void;
      enableCalculate(): void;
      getDrawingMode(): string;
      setDrawingMode(drawingMode: string): boolean;
      circlecomplete(event: any, overlay: BMap.Circle): void;
      markercomplete(event: any, overlay: BMap.Marker): void;
      polygoncomplete(event: any, overlay: BMap.Polygon): void;
      polylinecomplete(event: any, overlay: BMap.Polyline): void;
      rectanglecomplete(event: any, overlay: BMap.Polygon): void;
      overlaycomplete(event: {
        type: string;
        target: any;
        drawingMode: string;
        overlay: BMap.Circle | BMap.Polyline | BMap.Polygon | BMap.Marker;
        calculate: number;
        label: BMap.Label;
      }): void;
    }
    class DrawingManager {
      constructor(map: BMap.Map, opts?: DrawingManagerOptions);
    }
    interface DrawingManagerOptions {
      isOpen?: boolean;
      enableDrawingTool?: boolean;
      drawingMode?: string;
      drawingToolOptions?: DrawingToolOptions;
      enableCalculate?: boolean;
      markerOptions?: BMap.MarkerOptions;
      circleOptions?: BMap.CircleOptions;
      polylineOptions?: BMap.PolylineOptions;
      polygonOptions?: BMap.PolygonOptions;
      rectangleOptions?: BMap.PolygonOptions;
    }
    interface DrawingToolOptions {
      anchor?: BMap.ControlAnchor;
      offset?: BMap.Size;
      scale?: number;
      drawingModes?: string[];
    }
    interface DistanceTool extends IEventListenerProps {
      open(): boolean;
      close(): void;
      onaddpoint(event: {
        point: BMap.Point;
        pixel: BMap.Pixel;
        index: number;
        distance: number;
      }): void;
      ondrawend(event: { point: BMap.Point; overlays: BMap.Overlay[]; distance: number }): void;
    }
    class DistanceTool {
      constructor(map: BMap.Map, opts?: DistanceToolOptions);
    }
    interface DistanceToolOptions {
      followText?: string;
      unit?: string;
      lineColor?: string;
      lineStroke?: number;
      opacity?: number;
      lineStyle?: string;
      secIcon?: BMap.Icon;
      closeIcon?: BMap.Icon;
      cursor?: string;
    }
    interface MarkerClusterer extends IEventListenerProps {
      addMarker(marker: BMap.Marker): void;
      addMarkers(markers: BMap.Marker[]): void;
      clearMarkers(): void;
      getClustersCount(): number;
      getGridSize(): number;
      getMap(): BMap.Map;
      getMarkers(): BMap.Marker[];
      getMaxZoom(): number;
      getMinClusterSize(): number;
      getStyles(): IconStyle[];
      isAverageCenter(): boolean;
      removeMarker(marker: BMap.Marker): boolean;
      removeMarkers(markers: BMap.Marker[]): boolean;
      setGridSize(size: number): void;
      setMaxZoom(maxZoom: number): void;
      setMinClusterSize(size: number): void;
      setStyles(styles: IconStyle[]): void;
    }
    class MarkerClusterer {
      constructor(map: BMap.Map, opts?: MarkerClustererOptions);
    }
    interface MarkerClustererOptions {
      markers?: BMap.Marker[];
      gridSize?: number;
      maxZoom?: number;
      minClusterSize?: number;
      isAverangeCenter?: boolean;
      styles?: IconStyle[];
    }
  
    interface TextIconOverlay extends IEventListenerProps {
      draw(): void;
      getPosition(): BMap.Point;
      getStyleByText(text: string, styles: IconStyle[]): number;
      getText(): string;
      initialize(map: BMap.Map): HTMLElement;
      setPosition(position: BMap.Point): void;
      setText(text: string): void;
      click(event: { type: string; target: any }): void;
      mouseout(event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }): void;
      mouseover(event: { type: string; target: any; point: BMap.Point; pixel: BMap.Pixel }): void;
    }
    class TextIconOverlay {
      constructor(position: BMap.Point, text: string, opts?: TextIconOverlayOptions);
    }
    interface TextIconOverlayOptions {
      styles?: IconStyle[];
    }
  
    interface IconStyle {
      url: string;
      size: BMap.Size;
      anchor?: BMap.Size;
      offset?: BMap.Size;
      textSize?: number;
      textColor?: string;
    }
    interface HeatmapOverlay extends Overlay, IEventListenerProps {
      addDataPoint(lng: number, lat: number, count: number): void;
      setDataSet(data: { max: number; data: DataPoint[] }): void;
      setOptions(options: HeatmapOverlayOptions): void;
    }
    class HeatmapOverlay {
      constructor(opts?: HeatmapOverlayOptions);
    }
    interface DataPoint {
      lng: number;
      lat: number;
      count: number;
    }
    interface HeatmapOverlayOptions {
      radius?: number;
      visible?: boolean;
      gradient?: { [key: number]: string };
      opacity?: number;
    }
    interface LuShu extends IEventListenerProps {
      showInfoWindow(): void;
      hideInfoWindow(): void;
      slideChange(index: number): void;
      changeSpeed(speed: number): void;
      start(): void;
      stop(): void;
      pause(): void;
    }
    class LuShu {
      constructor(map: BMap.Map, path: BMap.Point[], opts?: LuShuOptions);
    }
    interface LuShuOptions {
      icon?: BMap.Icon;
      autoView?: boolean;
      speed?: number;
      enableRotation?: boolean;
      // landmarkPois?:
    }
    interface InfoBox extends IEventListenerProps {
      open(anchor: BMap.Point): void;
      close(): void;
      enableAutoPan(): void;
      disableAutoPan(): void;
      getOffset(): BMap.Size;
      getPosition(): BMap.Point;
      setPosition(point: BMap.Point): void;
      setOffset(offset: BMap.Size): void;
    }
    class InfoBox {
      constructor(map: BMap.Map, content: HTMLElement, opts?: InfoBoxOptions);
    }
    interface InfoBoxOptions {
      offset?: BMap.Size;
      boxClass?: string;
      boxStyle?: React.CSSProperties;
    }
    interface CurveLine extends BMap.Polyline,IEventListenerProps{
      setPaths(points:BMap.Point[]):void;

    }
    class CurveLine{
      constructor(points:BMap.Point[], opts?: BMap.PolylineOptions);
    }
  }
  