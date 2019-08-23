import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IPoint, EventParamsBase } from '../_utils/point';

export interface ICircleProps {
  center: IPoint;
  radius: number;
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

const defaultProps: Partial<ICircleProps> = {};

const updaterMap = {
  center(instance: BMap.Circle, center: IPoint) {
    const { lng, lat } = center;
    const point = new BMap.Point(lng, lat);
    instance.setCenter(point);
  },
  radius(instance: BMap.Circle, radius: number) {
    instance.setRadius(radius);
  },
  strokeColor(instance: BMap.Circle, color: string) {
    instance.setStrokeColor(color);
  },
  fillColor(instance: BMap.Circle, color: string) {
    instance.setFillColor(color);
  },
  strokeOpacity(instance: BMap.Circle, opacity: number) {
    instance.setStrokeOpacity(opacity);
  },
  fillOpacity(instance: BMap.Circle, opacity: number) {
    instance.setFillOpacity(opacity);
  },
  strokeWeight(instance: BMap.Circle, weight: number) {
    instance.setStrokeWeight(weight);
  },
  strokeStyle(instance: BMap.Circle, style: string) {
    instance.setStrokeStyle(style);
  },
  enableEditing(instance: BMap.Circle, enable: boolean) {
    if (enable) instance.enableEditing();
    else instance.disableEditing();
  },
  enableMassClear(instance: BMap.Circle, enable: boolean) {
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

const Circle = forwardRef((props: ICircleProps, ref: React.RefObject<Record<string, any>>) => {
  const map = useMap() as BMap.Map;
  const { center = map.getCenter(), radius = 1 } = props;
  const registeredEventsRef = useRef<any[]>([]);
  const [circleInstance, setCircleInstance] = useState<BMap.Circle>();
  const prevProps = usePreviousProps(props);

  useEffect(function initInstance() {
    const { lng, lat } = center;
    const point = new BMap.Point(lng, lat);
    const circle = new BMap.Circle(point, radius);
    map.addOverlay(circle);
    applyUpdatersToProps(updaterMap, {}, props, circle, map);
    setCircleInstance(circle);
  }, []);

  useEffect(function updatersToProps() {
    if (circleInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, circleInstance, map);
    }
  });

  useEffect(function setEvents() {
    if (circleInstance) {
      registeredEventsRef.current = registerEvents<BMap.Circle>(circleInstance, props, eventMap);
      return function clean() {
        registeredEventsRef.current.length > 0 &&
          unRegisterEvents<BMap.Circle>(circleInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => ({
      instance: circleInstance,
    }),
    [circleInstance],
  );

  return null;
});

Circle.defaultProps = defaultProps;

export default Circle;
