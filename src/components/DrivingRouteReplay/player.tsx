import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { addPlugins } from '../_utils/addPlugin';
import { useMap } from '../map-context';
import { IPoint } from '../_utils/point';
import { Polyline } from '../../index';

export interface IPlayerProps {
  points: IPoint[];
  speed?: number;
  passedPolylinePath: IPoint[];
  markerRef: BMapLib.RichMarker;
  onMoving?: (event?: any) => void;
  onMoveEnd?: (event?: any) => void;
  onStartMove?: (event?: any) => void;
  onStopMove?: (event?: any) => void;
  onPauseMove?: (event?: any) => void;
  onMarkerMoving?: (event?: any) => void;
  onMarkerClick?: (event?: any) => void;
}

const defaultProps: Partial<IPlayerProps> = {};

const updaterMap = {
  //   options(instance: BMapLib.LuShu, options: BMapLib.LuShuOptions) {
  //     instance.setOptions(options);
  //   },
  //   points(instance: BMapLib.LuShu, points: BMapLib.DataPoint[] = []) {
  //     const max = points.reduce((pre, act) => {
  //       if (act.count > pre) pre = act.count;
  //       return pre;
  //     }, 0);
  //     instance.setDataSet({
  //       max,
  //       data: points,
  //     });
  //   },
};
const eventMap = {
  onMoving: 'moving',
  onMoveEnd: 'moveend',
  onStartMove: 'startmove',
  onPauseMove: 'pausemove',
  onMarkerMoving: 'markermoving',
  onMarkerClick: 'markerclick',
  //   onStopMove: 'stopmove',
};

const transformPoints = (points: IPoint[]): BMap.Point[] => {
  return points.map(point => {
    const { lng, lat } = point;
    return new BMap.Point(lng, lat);
  });
};

const Player = forwardRef((props: IPlayerProps, ref: React.RefObject<Record<string, any>>) => {
  const { points = [], speed, passedPolylinePath } = props;
  const map = useMap() as BMap.Map;
  const registeredEventsRef = useRef<any[]>([]);
  const passedPolylineRef = useRef<{ instance: BMap.Polyline | null }>(null);
  const [playerInstance, setPlayerInstance] = useState<BMapLib.LuShu>();
  const prevProps = usePreviousProps(props);

  useEffect(function initInstance() {
    addPlugins(['LuShu']).then(() => {
      const opts: BMapLib.LuShuOptions = {
        icon: new BMap.Icon('https://webapi.amap.com/images/car.png', new BMap.Size(52, 26)),
        autoView: true,
        speed: speed,
        enableRotation: true,
      };

      const drivingRouteReplay = new BMapLib.LuShu(map, transformPoints(points), opts);
      applyUpdatersToProps(updaterMap, {}, props, drivingRouteReplay, map);
      setPlayerInstance(drivingRouteReplay);
    });
  }, []);

  useEffect(function updatersToProps() {
    if (playerInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, playerInstance, map);
    }
  });

  useEffect(function setEvents() {
    if (playerInstance) {
      registeredEventsRef.current = registerEvents<BMapLib.LuShu>(playerInstance, props, eventMap);
      return function clean() {
        registeredEventsRef.current.length > 0 &&
          unRegisterEvents<BMapLib.LuShu>(playerInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => ({
      instance: playerInstance,
    }),
    [playerInstance],
  );

  if (playerInstance) {
    return (
      <>
        <Polyline points={points} strokeColor="#28F" strokeWeight={6} strokeOpacity={1} />
        <Polyline
          ref={passedPolylineRef}
          points={passedPolylinePath}
          strokeColor="#AF5"
          strokeWeight={6}
          strokeOpacity={1}
        />
      </>
    );
  }
  return null;
});

Player.defaultProps = defaultProps;

export default Player;
