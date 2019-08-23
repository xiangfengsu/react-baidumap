import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents, pointsTransform } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IPoint, EventParamsBase } from '../_utils/point';

export interface IPolygonProps {
  points: IPoint[];
  strokeColor?: string;
  fillColor?: string;
  strokeOpacity?: number;
  fillOpacity?: number;
  strokeWeight?: number;
  strokeStyle?: string;
  enableEditing?: boolean;
  enableMassClear?: boolean;
  events?: { [key: string]: () => void } | null;
  onClick?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onDblClick?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseDown?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseUp?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseOut?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseOver?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onRemove?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onLineUpdate?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
}

const defaultProps: Partial<IPolygonProps> = {};

const updaterMap = {
  points(instance: BMap.Polygon, points: IPoint[]) {
    const paths = pointsTransform(points);
    instance.setPath(paths);
  },
  strokeColor(instance: BMap.Polygon, color: string) {
    instance.setStrokeColor(color);
  },
  fillColor(instance: BMap.Polygon, color: string) {
    instance.setFillColor(color);
  },
  strokeOpacity(instance: BMap.Polygon, opacity: number) {
    instance.setStrokeOpacity(opacity);
  },
  fillOpacity(instance: BMap.Polygon, opacity: number) {
    instance.setFillOpacity(opacity);
  },
  strokeWeight(instance: BMap.Polygon, weight: number) {
    instance.setStrokeWeight(weight);
  },
  strokeStyle(instance: BMap.Polygon, style: string) {
    instance.setStrokeStyle(style);
  },
  enableEditing(instance: BMap.Polygon, enable: boolean) {
    if (enable) instance.enableEditing();
    else instance.disableEditing();
  },
  enableMassClear(instance: BMap.Polygon, enable: boolean) {
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

const Polygon = forwardRef((props: IPolygonProps, ref: React.RefObject<Record<string, any>>) => {
  const map = useMap() as BMap.Map;
  const { points = [] } = props;
  const registeredEventsRef = useRef<any[]>([]);
  const [polygonInstance, setPolygonInstance] = useState<BMap.Polygon>();
  const prevProps = usePreviousProps(props);

  useEffect(function initInstance() {
    const paths = pointsTransform(points);
    const polygon = new BMap.Polygon(paths);
    map.addOverlay(polygon);
    applyUpdatersToProps(updaterMap, {}, props, polygon, map);
    registeredEventsRef.current = registerEvents<BMap.Polygon>(polygon, props, eventMap);
    setPolygonInstance(polygon);
  }, []);

  useEffect(function updatersToProps() {
    if (polygonInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, polygonInstance, map);
    }
  });

  useEffect(function setEvents() {
    if (polygonInstance) {
      registeredEventsRef.current = registerEvents<BMap.Polygon>(polygonInstance, props, eventMap);
      return function clean() {
        unRegisterEvents<BMap.Polygon>(polygonInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => ({
      instance: polygonInstance,
    }),
    [polygonInstance],
  );

  return null;
});

Polygon.defaultProps = defaultProps;

export default Polygon;
