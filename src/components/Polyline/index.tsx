import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents, pointsTransform } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
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
  points(instance: BMap.Polyline, points: IPoint[]) {
    const paths = pointsTransform(points);
    instance.setPath(paths);
  },
  strokeColor(instance: BMap.Polyline, color: string) {
    instance.setStrokeColor(color);
  },
  fillColor(instance: BMap.Polyline, color: string) {
    instance.setFillColor(color);
  },
  strokeOpacity(instance: BMap.Polyline, opacity: number) {
    instance.setStrokeOpacity(opacity);
  },
  fillOpacity(instance: BMap.Polyline, opacity: number) {
    instance.setFillOpacity(opacity);
  },
  strokeWeight(instance: BMap.Polyline, weight: number) {
    instance.setStrokeWeight(weight);
  },
  strokeStyle(instance: BMap.Polyline, style: string) {
    instance.setStrokeStyle(style);
  },
  enableEditing(instance: BMap.Polyline, enable: boolean) {
    if (enable) instance.enableEditing();
    else instance.disableEditing();
  },
  enableMassClear(instance: BMap.Polyline, enable: boolean) {
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
  const [polylineInstance, setPolylineInstance] = useState<BMap.Polyline>();
  const prevProps = usePreviousProps(props);

  useEffect(function initInstance() {
    const paths = pointsTransform(points);
    const polygon = new BMap.Polyline(paths);
    map.addOverlay(polygon);
    applyUpdatersToProps(updaterMap, {}, props, polygon, map);
    registeredEventsRef.current = registerEvents<BMap.Polyline>(polygon, props, eventMap);
    setPolylineInstance(polygon);
  }, []);

  useEffect(function updatersToProps() {
    if (polylineInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, polylineInstance, map);
    }
  });

  useEffect(function setEvents() {
    if (polylineInstance) {
      registeredEventsRef.current = registerEvents<BMap.Polyline>(
        polylineInstance,
        props,
        eventMap,
      );
      return function clean() {
        unRegisterEvents<BMap.Polyline>(polylineInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => ({
      instance: polylineInstance,
    }),
    [polylineInstance],
  );

  return null;
});

Polyline.defaultProps = defaultProps;

export default Polyline;
