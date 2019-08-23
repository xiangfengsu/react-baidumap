import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents, pointsTransform } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { addPlugins } from '../_utils/addPlugin';
import { useMap } from '../map-context';
import { IPoint, EventParamsBase } from '../_utils/point';

export interface IPolylineProps {
  points: IPoint[];
  strokeColor?: string;
  fillColor?: string;
  strokeOpacity?: number;
  fillOpacity?: number;
  strokeWeight?: number;
  strokeStyle?: string;
  enableEditing?: boolean;
  enableMassClear?: boolean;
  onClick?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onDblClick?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseDown?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseUp?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseOut?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseOver?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onRemove?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onLineUpdate?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
}

const defaultProps: Partial<IPolylineProps> = {};

const updaterMap = {
  points(instance: BMapLib.CurveLine, points: IPoint[]) {
    const paths = pointsTransform(points);
    instance.setPaths(paths);
  },
  strokeColor(instance: BMapLib.CurveLine, color: string) {
    instance.setStrokeColor(color);
  },
  fillColor(instance: BMapLib.CurveLine, color: string) {
    instance.setFillColor(color);
  },
  strokeOpacity(instance: BMapLib.CurveLine, opacity: number) {
    instance.setStrokeOpacity(opacity);
  },
  fillOpacity(instance: BMapLib.CurveLine, opacity: number) {
    instance.setFillOpacity(opacity);
  },
  strokeWeight(instance: BMapLib.CurveLine, weight: number) {
    instance.setStrokeWeight(weight);
  },
  strokeStyle(instance: BMapLib.CurveLine, style: string) {
    instance.setStrokeStyle(style);
  },
  enableEditing(instance: BMapLib.CurveLine, enable: boolean) {
    if (enable) instance.enableEditing();
    else instance.disableEditing();
  },
  enableMassClear(instance: BMapLib.CurveLine, enable: boolean) {
    if (enable) instance.enableMassClear();
    else instance.disableMassClear();
  },
};
const eventMap = {
  onClick: 'click',
  onDblClick: 'dblclick',
  onMouseDown: 'mousedown',
  onMouseUp: 'mouseup',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onRemove: 'remove',
  onLineUpdate: 'lineupdate',
};
const Polyline = forwardRef((props: IPolylineProps, ref: React.RefObject<Record<string, any>>) => {
  const map = useMap() as BMap.Map;
  const { points = [] } = props;
  const registeredEventsRef = useRef<any[]>([]);
  const [curveLineInstance, setCurveLineInstance] = useState<BMapLib.CurveLine>();
  const prevProps = usePreviousProps(props);

  useEffect(function initInstance() {
    addPlugins(['CurveLine']).then(() => {
      const paths = pointsTransform(points);
      const curveLine = new BMapLib.CurveLine(paths);
      map.addOverlay(curveLine);
      applyUpdatersToProps(updaterMap, {}, props, curveLine, map);
      setCurveLineInstance(curveLine);
    });
  }, []);

  useEffect(function updatersToProps() {
    if (curveLineInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, curveLineInstance, map);
    }
  });

  useEffect(function setEvents() {
    if (curveLineInstance) {
      registeredEventsRef.current = registerEvents<BMapLib.CurveLine>(
        curveLineInstance,
        props,
        eventMap,
      );
      return function clean() {
        registeredEventsRef.current.length > 0 &&
          unRegisterEvents<BMapLib.CurveLine>(curveLineInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => ({
      instance: curveLineInstance,
    }),
    [curveLineInstance],
  );

  return null;
});

Polyline.defaultProps = defaultProps;

export default Polyline;
