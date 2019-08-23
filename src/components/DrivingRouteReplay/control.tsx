import React from 'react';
import { Button, Slider, Select } from 'antd';

export interface IControlProps {
  //   points: IPoint[];
  playerRef: BMapLib.LuShu | null;
  moveStatus: string;
  slideValue: number;
  onSlideChange?: (value?: any) => void;
  onSpeedChange?: (value?: number) => void;
}

const defaultProps: Partial<IControlProps> = {
  onSlideChange: () => {},
};

const Control: React.FunctionComponent<IControlProps> = props => {
  const { playerRef, moveStatus, onSlideChange, onSpeedChange, slideValue } = props;

  const boxStyle: React.CSSProperties = {
    // position: 'absolute',
    // bottom: '0px',
    // left: '0px',
    // padding: '5px 10px',
    // border: '1px solid #d3d3d3',
    color: '#fff',
    backgroundColor: '#fff',
    marginTop: 2,
    display: 'flex',
    alignItems: 'center',
  };

  function changeHandle() {
    if (moveStatus === 'pause' || moveStatus === 'over') {
      playerRef && playerRef.start();
    } else {
      playerRef && playerRef.pause();
    }
  }

  return (
    <div style={boxStyle}>
      <Button
        type="primary"
        shape="circle"
        icon={moveStatus === 'pause' || moveStatus === 'over' ? 'caret-right' : 'pause'}
        onClick={changeHandle}
      />
      <div style={{ paddingLeft: 4 }}>
        <Select defaultValue={1} size="small" onChange={onSpeedChange}>
          <Select.Option value={1}>1x</Select.Option>
          <Select.Option value={2}>2x</Select.Option>
          <Select.Option value={4}>4x</Select.Option>
          <Select.Option value={8}>8x</Select.Option>
        </Select>
      </div>

      <div style={{ flex: 1, paddingLeft: 10 }}>
        <Slider value={slideValue} onChange={onSlideChange} />
      </div>
    </div>
  );
};

Control.defaultProps = defaultProps;

export default Control;
