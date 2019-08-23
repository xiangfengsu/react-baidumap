import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { addPlugins } from '../_utils/addPlugin';
import { useMap } from '../map-context';

export interface IHeatMapOverlayProps {
  options?: BMapLib.HeatmapOverlayOptions;
  points: BMapLib.DataPoint[];
}

const defaultProps: Partial<IHeatMapOverlayProps> = {};

const updaterMap = {
  options(instance: BMapLib.HeatmapOverlay, options: BMapLib.HeatmapOverlayOptions) {
    instance.setOptions(options);
  },
  points(instance: BMapLib.HeatmapOverlay, points: BMapLib.DataPoint[] = []) {
    const max = points.reduce((pre, act) => {
      if (act.count > pre) pre = act.count;
      return pre;
    }, 0);
    instance.setDataSet({
      max,
      data: points,
    });
  },
};
const eventMap = {};

const HeatMapOverlay = forwardRef(
  (props: IHeatMapOverlayProps, ref: React.RefObject<Record<string, any>>) => {
    const {} = props;
    const map = useMap() as BMap.Map;
    const registeredEventsRef = useRef<any[]>([]);
    const [heatMapOverlayInstance, setHeatMapOverlayInstance] = useState<BMapLib.HeatmapOverlay>();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      addPlugins(['HeatMap']).then(() => {
        const opts: BMapLib.HeatmapOverlayOptions = {};
        const heatMapOverlay = new BMapLib.HeatmapOverlay(opts);
        map.addOverlay(heatMapOverlay);
        applyUpdatersToProps(updaterMap, {}, props, heatMapOverlay, map);
        registeredEventsRef.current = registerEvents<BMapLib.HeatmapOverlay>(
          heatMapOverlay,
          props,
          eventMap,
        );
        setHeatMapOverlayInstance(heatMapOverlay);
      });
    }, []);

    useEffect(function updatersToProps() {
      if (heatMapOverlayInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, heatMapOverlayInstance, map);
      }
    });

    useEffect(function setEvents() {
      if (heatMapOverlayInstance) {
        registeredEventsRef.current = registerEvents<BMapLib.HeatmapOverlay>(
          heatMapOverlayInstance,
          props,
          eventMap,
        );
        return function clean() {
          unRegisterEvents<BMapLib.HeatmapOverlay>(
            heatMapOverlayInstance,
            registeredEventsRef.current,
          );
        };
      }
      return;
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: heatMapOverlayInstance,
      }),
      [heatMapOverlayInstance],
    );

    return null;
  },
);

HeatMapOverlay.defaultProps = defaultProps;

export default HeatMapOverlay;
