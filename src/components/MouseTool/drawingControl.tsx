import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { addPlugins } from '../_utils/addPlugin';
import { useMap } from '../map-context';

export enum DrawingModelEnum {
  BMAP_DRAWING_MARKE = 'marker',
  BMAP_DRAWING_CIRCLE = 'circle',
  BMAP_DRAWING_POLYLINE = 'polyline',
  BMAP_DRAWING_POLYGON = 'polygon',
  BMAP_DRAWING_RECTANGLE = 'rectangle',
}
export interface IDrawingControlProps {
  isOpen?: boolean;
  enableCalculate?: boolean;
  drawingMode?: string;
  markerOptions?: BMap.MarkerOptions;
  circleOptions?: BMap.CircleOptions;
  polylineOptions?: BMap.PolylineOptions;
  polygonOptions?: BMap.PolygonOptions;
  rectangleOptions?: BMap.PolygonOptions;
  onCircleComplete?: (event: BMap.Circle) => void;
  onMarkerComplete?: (event: BMap.Marker) => void;
  onPolygonComplete?: (event: BMap.Polygon) => void;
  onPolylineComplete?: (event: BMap.Polyline) => void;
  onRectangleComplete?: (event: BMap.Polygon) => void;
  onOverlayComplete?: (event: any) => void;
}

const defaultProps: Partial<IDrawingControlProps> = {};

const updaterMap = {
  isOpen(instance: BMapLib.DrawingManager, isOpen: boolean, map: BMap.Map) {
    if (isOpen) {
      instance.open();
      map.disableDoubleClickZoom();
    } else {
      instance.close();
      map.enableDoubleClickZoom();
    }
  },
  enableCalculate(instance: BMapLib.DrawingManager, enable: boolean) {
    if (enable) instance.enableCalculate();
    else instance.disableCalculate();
  },
  drawingMode(instance: BMapLib.DrawingManager, drawingMode: string) {
    instance.setDrawingMode(DrawingModelEnum[drawingMode]);
  },
};
const eventMap = {
  onCircleComplete: 'circlecomplete',
  onMarkerComplete: 'markercomplete',
  onPolygonComplete: 'polygoncomplete',
  onPolylineComplete: 'polylinecomplete',
  onRectangleComplete: 'rectanglecomplete',
  onOverlayComplete: 'overlaycomplete',
};

const DrawingControl = forwardRef(
  (props: IDrawingControlProps, ref: React.RefObject<Record<string, any>>) => {
    const {
      markerOptions = {},
      circleOptions = {},
      polylineOptions = {},
      polygonOptions = {},
      rectangleOptions = {},
    } = props;
    const map = useMap() as BMap.Map;
    const registeredEventsRef = useRef<any[]>([]);
    const [drawingControlInstance, setDrawingControlInstance] = useState<BMapLib.DrawingManager>();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      // @ts-ignore
      addPlugins(['DrawingManager']).then(() => {
        const drawingControlOpts: BMapLib.DrawingManagerOptions = {
          markerOptions,
          circleOptions,
          polylineOptions,
          polygonOptions,
          rectangleOptions,
        };

        const drawingControl = new BMapLib.DrawingManager(map, drawingControlOpts);
        applyUpdatersToProps(updaterMap, {}, props, drawingControl, map);

        setDrawingControlInstance(drawingControl);
      });
    }, []);

    useEffect(function updatersToProps() {
      if (drawingControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, drawingControlInstance, map);
      }
    });

    useEffect(function setEvents() {
      if (drawingControlInstance) {
        registeredEventsRef.current = registerEvents<BMapLib.DrawingManager>(
          drawingControlInstance,
          props,
          eventMap,
        );
        return function clean() {
          registeredEventsRef.current.length > 0 &&
            unRegisterEvents<BMapLib.DrawingManager>(
              drawingControlInstance,
              registeredEventsRef.current,
            );
        };
      }
      return;
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: drawingControlInstance,
      }),
      [drawingControlInstance],
    );

    return null;
  },
);

DrawingControl.defaultProps = defaultProps;
DrawingControl.displayName = 'mousetool-drawingcontrol';

export default DrawingControl;
