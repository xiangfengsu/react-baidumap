import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { addPlugins } from '../_utils/addPlugin';
import { useMap } from '../map-context';
import { IPoint, IOffset, ISize } from '../_utils/point';

export interface IMarkersProps {
  points: IPoint[];
  gridSize?: number;
  maxZoom?: number;
  minClusterSize?: number;
  isAverangeCenter?: boolean;
  styles?: BMapLib.IconStyle[];

  onLocationSuccess?: () => void;
}
interface Styles {
  url: string;
  size?: ISize;
  anchor?: IOffset;
  offset?: IOffset;
  textSize?: number;
  textColor?: string;
}

const defaultProps: Partial<IMarkersProps> = {
  isAverangeCenter: false,
};

const updaterMap = {
  points(instance: BMapLib.MarkerClusterer, points: IPoint[] = []) {
    const markerClusterers: BMap.Marker[] = [];
    points.forEach(position => {
      const { lng, lat } = position;
      const point = new BMap.Point(lng, lat);
      const marker = new BMap.Marker(point);
      marker.setIcon(new BMap.Icon('http://localhost:8888/marker.svg', new BMap.Size(24, 34)));
      markerClusterers.push(marker);
    });
    instance.addMarkers(markerClusterers);
  },
  gridSize(instance: BMapLib.MarkerClusterer, size: number) {
    instance.setGridSize(size);
  },
  maxZoom(instance: BMapLib.MarkerClusterer, maxZoom: number) {
    instance.setMaxZoom(maxZoom);
  },
  minClusterSize(instance: BMapLib.MarkerClusterer, size: number) {
    instance.setMinClusterSize(size);
  },
  styles(instance: BMapLib.MarkerClusterer, styles: Styles[]) {
    const iconStyles: BMapLib.IconStyle[] = [];
    styles.forEach(style => {
      const { url, size = {}, anchor = {}, offset = {}, textSize = 0, textColor = '' } = style;
      const { width = 0, height = 0 } = size;
      const { left: anchorL = 0, top: anchorT = 0 } = anchor;
      const { left: offsetL = 0, top: offsetT = 0 } = offset;
      iconStyles.push({
        url,
        size: new BMap.Size(width, height),
        anchor: new BMap.Size(anchorL, anchorT),
        offset: new BMap.Size(offsetL, offsetT),
        textSize,
        textColor,
      });
    });

    instance.setStyles(iconStyles);
  },
};
const eventMap = {};

const Markers = forwardRef((props: IMarkersProps, ref: React.RefObject<Record<string, any>>) => {
  const { isAverangeCenter } = props;
  const map = useMap() as BMap.Map;
  const registeredEventsRef = useRef<any[]>([]);
  const [markersInstance, setMarkersInstance] = useState<BMapLib.MarkerClusterer>();
  const prevProps = usePreviousProps(props);

  useEffect(function initInstance() {
    addPlugins(['TextIconOverlay', 'MarkerClusterer']).then(() => {
      const markersOpts: BMapLib.MarkerClustererOptions = {
        isAverangeCenter,
      };
      const markers = new BMapLib.MarkerClusterer(map, markersOpts);

      applyUpdatersToProps(updaterMap, {}, props, markers, map);
      setMarkersInstance(markers);
    });
  }, []);

  useEffect(function updatersToProps() {
    if (markersInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, markersInstance, map);
    }
  });

  useEffect(function setEvents() {
    if (markersInstance) {
      registeredEventsRef.current = registerEvents<BMapLib.MarkerClusterer>(
        markersInstance,
        props,
        eventMap,
      );
      return function clean() {
        registeredEventsRef.current.length > 0 &&
          unRegisterEvents<BMapLib.MarkerClusterer>(markersInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => ({
      instance: markersInstance,
    }),
    [markersInstance],
  );

  return null;
});

Markers.defaultProps = defaultProps;

export default Markers;
