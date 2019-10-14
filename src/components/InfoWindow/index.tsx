import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { addPlugins } from '../_utils/addPlugin';
import { IPoint, IOffset, EventParamsBase } from '../_utils/point';

export interface IInfoWindowProps {
  position: IPoint;
  visible: boolean;
  enableAutoPan?: boolean;
  offset?: IOffset;
  markerInstance?: BMap.Marker;
  children?: React.ReactNode;
  onOpen?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point'>) => void;
  onCancel?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point'>) => void;
}

const defaultProps: Partial<IInfoWindowProps> = {
  enableAutoPan: true,
  offset: { left: 0, top: 10 },
};

const updaterMap = {
  position(instance: BMapLib.InfoBox, position: IPoint) {
    const { lng, lat } = position;
    const point = new BMap.Point(lng, lat);
    instance.setPosition(point);
  },
  offset(instance: BMapLib.InfoBox, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setOffset(new BMap.Size(left, top));
  },
  enableAutoPan(instance: BMapLib.InfoBox, enable: boolean) {
    if (enable) instance.enableAutoPan();
    else instance.disableAutoPan();
  },
};
const eventMap = {
  onOpen: 'open',
  onCancel: 'close',
};

const InfoWindow = forwardRef(
  (props: IInfoWindowProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const { position = map.getCenter(), visible, children } = props;
    const containerRef = useRef<HTMLElement | null>(null);

    const registeredEventsRef = useRef<any[]>([]);
    const [infoWindowInstance, setInfoWindowInstance] = useState<BMapLib.InfoBox>();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      addPlugins(['InfoBox']).then(() => {
        const boxStyle: React.CSSProperties = {
          position: 'absolute',
          minWidth: '300px',
          minHeight: '100px',
          border: '1px solid #e8e8e8',
          padding: '10px',
          background: '#fff',
        };
        const opts: BMapLib.InfoBoxOptions = {
          boxStyle,
        };
        containerRef.current = document.createElement('div');

        const infoWindow = new BMapLib.InfoBox(map, containerRef.current, opts);
        applyUpdatersToProps(updaterMap, {}, props, infoWindow, map);
        setInfoWindowInstance(infoWindow);
      });
    }, []);

    useEffect(() => {
      if (infoWindowInstance) {
        if (visible) {
          const { lng, lat } = position;
          const point = new BMap.Point(lng, lat);
          infoWindowInstance.open(point);
        } else {
          infoWindowInstance.close();
        }
      }
    }, [visible, position, infoWindowInstance]);

    useEffect(function updatersToProps() {
      if (infoWindowInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, infoWindowInstance, map);
      }
    });

    useEffect(function setEvents() {
      if (infoWindowInstance) {
        registeredEventsRef.current = registerEvents<BMapLib.InfoBox>(
          infoWindowInstance,
          props,
          eventMap,
        );
        return function clean() {
          registeredEventsRef.current.length > 0 &&
            unRegisterEvents<BMapLib.InfoBox>(infoWindowInstance, registeredEventsRef.current);
        };
      }
      return;
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: infoWindowInstance,
      }),
      [infoWindowInstance],
    );

    return containerRef.current !== null ? (
      createPortal(React.Children.only(children), containerRef.current)
    ) : (
      <></>
    );
  },
);

InfoWindow.defaultProps = defaultProps;

export default InfoWindow;
