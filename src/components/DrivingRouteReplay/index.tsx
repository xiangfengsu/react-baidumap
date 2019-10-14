import React, { useState, useCallback, useRef } from 'react';
import { Card } from 'antd';
import { IPoint } from '../_utils/point';
import { Map, Marker, InfoWindow } from '../../index';
import Player from './player';
import Control from './control';

export interface IDrivingRouteReplayProps {
  points: IPoint[];
  speed?: number;
}

type IpointWithIndex = { index: number } & IPoint;

const defaultProps: Partial<IDrivingRouteReplayProps> = {};

const DrivingRouteReplay: React.FunctionComponent<IDrivingRouteReplayProps> = props => {
  const { points = [], speed = 1000 } = props;
  const [playerRefs, setPlayerRefs] = useState<BMapLib.LuShu | null>(null);
  const [moveStatus, setMoveStatus] = useState<string>('pause');
  const [infoWindowPosition, setInfoWindowPosition] = useState(points[0]);
  const [passedPolylinePath, setPassedPolylinePath] = useState<IpointWithIndex[]>([]);
  const [slideValue, setSlideValue] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const currentIndex = useRef<number>(0);
  const playerRef = useCallback(node => {
    if (node && node.instance) {
      setPlayerRefs(node.instance);
    }
  }, []);

  function reCalcPassedPolylinePath(){
    setPassedPolylinePath(points => {
      return points.filter(point => {
        return point.index < currentIndex.current;
      });
    });
  }

  function onStartMove() {
    setMoveStatus('start');
    console.log('start');
    if (currentIndex.current === 0) {
      setPassedPolylinePath([]);
    } else {
      reCalcPassedPolylinePath()
    }

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
    // const { index } = event;
    // if (points.length > 0) {
    //   setPassedPolylinePath(points.slice(0, index + 1));
    // }
    // console.log('passedPath', passedPath);
    // setPassedPolylinePath(passedPath);
  }

  function onStopMove(){

  }

  function calcPassedPolyLinePath(point: IPoint, index: number) {
    const pointWithIndex = { ...point, index };
    setPassedPolylinePath(p => [...p, pointWithIndex]);
  }

  function onMarkerMoving(event: any) {
    const { point, index } = event;
    const len = points.length - 1;
    const value = Math.ceil((index / len) * 100);
    currentIndex.current = index;
    setInfoWindowPosition(point);
    setSlideValue(value);
    calcPassedPolyLinePath(point, index);
  }

  function onSlideChange(value: any) {
    if (playerRefs) {
      const index = Math.ceil((value / 100) * points.length);
      console.log('index',index);
      currentIndex.current = index;
      setSlideValue(value);
      playerRefs.slideChange(index);
      setMoveStatus('start');
      reCalcPassedPolylinePath()
    }
  }

  function onSpeedChange(value: number) {
    if (playerRefs) {
      console.log('value',value)
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
        onStopMove={onStopMove}
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
