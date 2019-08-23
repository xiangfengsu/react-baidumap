import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IOffset } from '../_utils/point';
import { ControlAnchorEnum } from '../MouseTool/navigationControl';

export interface IPanoramaControlProps {
  anchor?: string;
  offset?: IOffset;
}

const defaultProps: Partial<IPanoramaControlProps> = {};

const updaterMap = {
  anchor(instance: BMap.PanoramaControl, anchor: string) {
    instance.setAnchor(ControlAnchorEnum[anchor]);
  },
  offset(instance: BMap.PanoramaControl, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setOffset(new BMap.Size(left, top));
  },
};

const PanoramaControl = forwardRef(
  (props: IPanoramaControlProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const [panoramaControlInstance, setPanoramaControlInstance] = useState<BMap.PanoramaControl>();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      const panoramaControl = new BMap.PanoramaControl();
      map.addControl(panoramaControl);
      applyUpdatersToProps(updaterMap, {}, props, panoramaControl, map);

      setPanoramaControlInstance(panoramaControl);
    }, []);

    useEffect(function updatersToProps() {
      if (panoramaControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, panoramaControlInstance, map);
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: panoramaControlInstance,
      }),
      [panoramaControlInstance],
    );

    return null;
  },
);

PanoramaControl.defaultProps = defaultProps;
PanoramaControl.displayName = 'mousetool-panoramacontrol';

export default PanoramaControl;
