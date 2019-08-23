import React, { useEffect, forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import WrapperCustomOverlay from './wrapperCustomOverlay';
import { useMap } from '../map-context';
import { IPoint } from '../_utils/point';

export interface ICustomOverlayProps {
  position: IPoint;
  offset?: number[];
  children?: React.ReactNode;
}

const CustomOverlay = forwardRef(
  (props: ICustomOverlayProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const { position = map.getCenter(), offset = [], children } = props;
    const [instance, setInstance] = useState<any>();
    const containerRef = useRef<HTMLElement>(document.createElement('div'));

    useEffect(function initInstance() {
      const { lng, lat } = position;
      const point = new BMap.Point(lng, lat);
      import('./customOverlayBase').then(CustomOverlayBase => {
        const myCompOverlay = new CustomOverlayBase.default({
          point,
          wrapper: containerRef.current,
        });

        map.addOverlay(myCompOverlay);
        setInstance(myCompOverlay);
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        instance: instance,
      }),
      [instance],
    );
    if (instance && children) {
      return createPortal(
        <WrapperCustomOverlay map={map} position={position} offset={offset}>
          {children}
        </WrapperCustomOverlay>,
        containerRef.current,
      );
    }
    return null;
  },
);

export default CustomOverlay;
