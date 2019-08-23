import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IOffset } from '../_utils/point';
import { ControlAnchorEnum } from './navigationControl';

export enum LengthUnitTypeEnum {
  BMAP_UNIT_METRIC,
  BMAP_UNIT_IMPERIAL,
}

export interface IScaleControlProps {
  anchor?: string;
  offset?: IOffset;
  unit?: string;
}

const defaultProps: Partial<IScaleControlProps> = {};

const updaterMap = {
  anchor(instance: BMap.ScaleControl, anchor: string) {
    instance.setAnchor(ControlAnchorEnum[anchor]);
  },
  offset(instance: BMap.ScaleControl, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setOffset(new BMap.Size(left, top));
  },
  unit(instance: BMap.ScaleControl, unit: string) {
    instance.setUnit(LengthUnitTypeEnum[unit]);
  },
};

const ScaleControl = forwardRef(
  (props: IScaleControlProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const { anchor = ControlAnchorEnum[0], offset: offsetSize = { left: 0, top: 0 } } = props;
    const [scaleControlInstance, setScaleControlInstance] = useState<BMap.ScaleControl>();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      const { left = 0, top = 0 } = offsetSize;
      const opts: BMap.ScaleControlOptions = {
        anchor: ControlAnchorEnum[anchor],
        offset: new BMap.Size(left, top),
      };
      const scaleControl = new BMap.ScaleControl(opts);
      map.addControl(scaleControl);
      applyUpdatersToProps(updaterMap, {}, props, scaleControl, map);

      setScaleControlInstance(scaleControl);
    }, []);

    useEffect(function updatersToProps() {
      if (scaleControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, scaleControlInstance, map);
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: scaleControlInstance,
      }),
      [scaleControlInstance],
    );

    return null;
  },
);

ScaleControl.defaultProps = defaultProps;
ScaleControl.displayName = 'mousetool-scalecontrol';

export default ScaleControl;
