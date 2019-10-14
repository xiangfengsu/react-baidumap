import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { addPlugins } from '../_utils/addPlugin';
import { useMap } from '../map-context';

export interface IDistanceToolControlProps {
  isOpen?: boolean;
  followText?: string;
  unit?: string;
  lineColor?: string;
  lineStroke?: number;
  opacity?: number;
  lineStyle?: string;
  secIcon?: BMap.Icon;
  closeIcon?: BMap.Icon;
  cursor?: string;
  onAddPoint?: () => void;
  onDrawEnd?: () => void;
}

const defaultProps: Partial<IDistanceToolControlProps> = {};

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
};
const eventMap = {
  onAddPoint: 'onaddpoint',
  onDrawEnd: 'ondrawend',
};

const DistanceToolControl = forwardRef(
  (props: IDistanceToolControlProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const registeredEventsRef = useRef<any[]>([]);
    const instanceRef = useRef<BMapLib.DistanceTool | null>(null);
    const [distanceToolControlInstance, setDistanceToolControlInstance] = useState<
      BMapLib.DistanceTool
    >();
    const prevProps = usePreviousProps(props);
    useEffect(function initInstance() {
      // @ts-ignore
      addPlugins(['DistanceTool']).then(() => {
        const distanceToolControlOpts: Partial<IDistanceToolControlProps> = {
          ...props,
        };

        const distanceTool = new BMapLib.DistanceTool(map, distanceToolControlOpts);
        instanceRef.current = distanceTool;
        applyUpdatersToProps(updaterMap, {}, props, distanceTool, map);

        setDistanceToolControlInstance(distanceTool);
      });
      
    }, []);

    useEffect(function updatersToProps() {
      if (distanceToolControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, distanceToolControlInstance, map);
      }
    });

    useEffect(function setEvents() {
      if (distanceToolControlInstance) {
        registeredEventsRef.current = registerEvents<BMapLib.DistanceTool>(
          distanceToolControlInstance,
          props,
          eventMap,
        );
        return function clean() {
          registeredEventsRef.current.length > 0 &&
            unRegisterEvents<BMapLib.DistanceTool>(
              distanceToolControlInstance,
              registeredEventsRef.current,
            );
        };
      }
      return;
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: distanceToolControlInstance,
      }),
      [distanceToolControlInstance],
    );

    return null;
  },
);

DistanceToolControl.defaultProps = defaultProps;
DistanceToolControl.displayName = 'mousetool-distancetoolcontrol';

export default DistanceToolControl;
