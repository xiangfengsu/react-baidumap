import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IOffset } from '../_utils/point';

export enum NavigationControlTypeEnum {
  BMAP_NAVIGATION_CONTROL_LARGE,
  BMAP_NAVIGATION_CONTROL_SMALL,
  BMAP_NAVIGATION_CONTROL_PAN,
  BMAP_NAVIGATION_CONTROL_ZOOM,
}
export enum ControlAnchorEnum {
  BMAP_ANCHOR_TOP_LEFT,
  BMAP_ANCHOR_TOP_RIGHT,
  BMAP_ANCHOR_BOTTOM_LEFT,
  BMAP_ANCHOR_BOTTOM_RIGHT,
}

export interface INavigationControlProps {
  type?: string;
  anchor?: string;
  offset?: IOffset;
  showZoomInfo?: boolean;
  enableGeolocation?: boolean;
}

const defaultProps: Partial<INavigationControlProps> = {};

const updaterMap = {
  type(instance: BMap.NavigationControl, type: string) {
    instance.setType(NavigationControlTypeEnum[type]);
  },
  anchor(instance: BMap.NavigationControl, anchor: string) {
    instance.setAnchor(ControlAnchorEnum[anchor]);
  },
  offset(instance: BMap.NavigationControl, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setOffset(new BMap.Size(left, top));
  },
};

const NavigationControl = forwardRef(
  (props: INavigationControlProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const {
      type = NavigationControlTypeEnum[0],
      anchor = ControlAnchorEnum[0],
      offset: offsetSize = { left: 0, top: 0 },
      showZoomInfo,
      enableGeolocation,
    } = props;
    const [navigationControlInstance, setNavigationControlInstance] = useState<
      BMap.NavigationControl
    >();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      const { left = 0, top = 0 } = offsetSize;
      const opts: BMap.NavigationControlOptions = {
        type: NavigationControlTypeEnum[type],
        anchor: ControlAnchorEnum[anchor],
        offset: new BMap.Size(left, top),
        showZoomInfo,
        enableGeolocation,
      };
      const navigationControl = new BMap.NavigationControl(opts);
      map.addControl(navigationControl);
      applyUpdatersToProps(updaterMap, {}, props, navigationControl, map);

      setNavigationControlInstance(navigationControl);
    }, []);

    useEffect(function updatersToProps() {
      if (navigationControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, navigationControlInstance, map);
      }
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: navigationControlInstance,
      }),
      [navigationControlInstance],
    );

    return null;
  },
);

NavigationControl.defaultProps = defaultProps;
NavigationControl.displayName = 'mousetool-navigationcontrol';

export default NavigationControl;
