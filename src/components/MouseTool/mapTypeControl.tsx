import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IOffset } from '../_utils/point';
import { ControlAnchorEnum } from '../MouseTool/navigationControl';

export enum MapTypeControlTypeEnum {
  BMAP_MAPTYPE_CONTROL_HORIZONTAL,
  BMAP_MAPTYPE_CONTROL_DROPDOWN,
  BMAP_MAPTYPE_CONTROL_MAP,
}

export interface IMapTypeControlProps {
  anchor?: string;
  offset?: IOffset;
  type?: string;
}

const defaultProps: Partial<IMapTypeControlProps> = {};

const updaterMap = {
  anchor(instance: BMap.MapTypeControl, anchor: string) {
    instance.setAnchor(ControlAnchorEnum[anchor]);
  },
  offset(instance: BMap.MapTypeControl, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setOffset(new BMap.Size(left, top));
  },
};

const MapTypeMapControl = forwardRef(
  (props: IMapTypeControlProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const { type = MapTypeControlTypeEnum[0] } = props;
    const [mapTypeControlInstance, setMapTypeControlInstance] = useState<BMap.MapTypeControl>();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      const opts: BMap.MapTypeControlOptions = {
        type: MapTypeControlTypeEnum[type],
      };
      const mapTypeControl = new BMap.MapTypeControl(opts);
      map.addControl(mapTypeControl);
      applyUpdatersToProps(updaterMap, {}, props, mapTypeControl, map);

      setMapTypeControlInstance(mapTypeControl);
    }, []);

    useEffect(function updatersToProps() {
      if (mapTypeControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, mapTypeControlInstance, map);
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: mapTypeControlInstance,
      }),
      [mapTypeControlInstance],
    );

    return null;
  },
);

MapTypeMapControl.defaultProps = defaultProps;
MapTypeMapControl.displayName = 'mousetool-maptypecontrol';

export default MapTypeMapControl;
