import React from 'react';

import { ICustomOverlayProps } from './index';

export interface IWrapperCustomOverlayProps extends ICustomOverlayProps {
  map: BMap.Map;
}

const WrapperCustomOverlay = (props: IWrapperCustomOverlayProps): React.ReactElement => {
  const { map, position, offset = [], children } = props;
  const { lng, lat } = position;
  const point = new BMap.Point(lng, lat);
  const pixel = map.pointToOverlayPixel(point);
  // console.log('pixel', pixel);
  const [l = 0, t = 0] = offset;
  const left = `${pixel.x + l}px`;
  const top = `${pixel.y + t}px`;

  return (
    <div style={{ position: 'absolute', whiteSpace: 'nowrap', left: left, top: top }}>
      {children}
    </div>
  );
};

export default WrapperCustomOverlay;
