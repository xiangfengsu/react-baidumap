import React, { useState, useCallback } from 'react';
import { Card } from 'antd';
import { IPoint } from '../_utils/point';
import { Map, Marker, InfoWindow } from '../../index';
import Player from './player';
import Control from './control';

export interface IDrivingRouteReplayProps {
  points: IPoint[];
  speed?: number;
}

const defaultProps: Partial<IDrivingRouteReplayProps> = {};

const DrivingRouteReplay: React.FunctionComponent<IDrivingRouteReplayProps> = props => {
  const { points = [], speed = 1000 } = props;
  const [playerRefs, setPlayerRefs] = useState<BMapLib.LuShu | null>(null);
  const [moveStatus, setMoveStatus] = useState<string>('pause');
  const [infoWindowPosition, setInfoWindowPosition] = useState(points[0]);
  const [passedPolylinePath, setPassedPolylinePath] = useState<IPoint[]>([]);
  const [slideValue, setSlideValue] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const playerRef = useCallback(node => {
    if (node && node.instance) {
      setPlayerRefs(node.instance);
    }
  }, []);

  function onStartMove() {
    setMoveStatus('start');
    if (moveStatus === 'over') {
      setInfoWindowPosition(points[0]);
      setPassedPolylinePath([]);
    }
  }
  function onPauseMove() {
    setMoveStatus('pause');
  }
  function onMoveEnd() {
    setMoveStatus('over');
  }
  function onMoving(event: any) {
    const { passedPath } = event;
    setPassedPolylinePath(passedPath);
  }
  function onMarkerMoving(event: any) {
    const { point, index } = event;
    setInfoWindowPosition(point);
    const value = Math.ceil((index / points.length) * 100);
    setSlideValue(value);
  }
  function onSlideChange(value: any) {
    if (playerRefs) {
      const index = Math.ceil((value / 100) * points.length);
      setSlideValue(value);
      playerRefs.slideChange(index);
      setMoveStatus('start');
    }
  }
  function onSpeedChange(value: number) {
    if (playerRefs) {
      playerRefs.changeSpeed(value);
    }
  }
  function onMarkerClick() {
    setVisible(true);
  }

  const CustonCard = () => (
    <div>
      <Card title="Default size card" style={{ width: 300 }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </div>
  );
  return (
    <Map
      mapKey="SbtCslmFwveeKa1mM1dHoNL2uyambFMN"
      viewportPoints={points}
      mapContainerStyle={{ height: '450px' }}
    >
      <Marker position={infoWindowPosition}>
        <div />
      </Marker>

      <InfoWindow
        position={infoWindowPosition}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <CustonCard />
      </InfoWindow>
      <Player
        points={points}
        speed={speed}
        passedPolylinePath={passedPolylinePath}
        ref={playerRef}
        onStartMove={onStartMove}
        onPauseMove={onPauseMove}
        onMoveEnd={onMoveEnd}
        onMoving={onMoving}
        onMarkerMoving={onMarkerMoving}
        onMarkerClick={onMarkerClick}
      />
      <Control
        slideValue={slideValue}
        playerRef={playerRefs}
        moveStatus={moveStatus}
        onSlideChange={onSlideChange}
        onSpeedChange={onSpeedChange}
      />
    </Map>
  );
};

DrivingRouteReplay.defaultProps = defaultProps;

export default DrivingRouteReplay;
