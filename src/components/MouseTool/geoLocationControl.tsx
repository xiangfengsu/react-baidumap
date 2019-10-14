import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IOffset } from '../_utils/point';
import { ControlAnchorEnum } from '../MouseTool/navigationControl';

export interface IGeoLocationControlProps {
  anchor?: string;
  offset?: IOffset;
  showAddressBar?: boolean;
  enableAutoLocation?: boolean;
  onLocationSuccess?: (event: any) => void;
  onLocationError?: (event: any) => void;
}

const defaultProps: Partial<IGeoLocationControlProps> = {
  showAddressBar: true,
  enableAutoLocation: false,
};

const updaterMap = {
  anchor(instance: BMap.GeolocationControl, anchor: string) {
    instance.setAnchor(ControlAnchorEnum[anchor]);
  },
  offset(instance: BMap.GeolocationControl, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setOffset(new BMap.Size(left, top));
  },
};
const eventMap = {
  onLocationSuccess: 'locationSuccess',
  onLocationError: 'locationError',
};

const GeoLocationControl = forwardRef(
  (props: IGeoLocationControlProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const { anchor = ControlAnchorEnum[0], offset: offsetSize = { left: 0, top: 0 } } = props;
    const registeredEventsRef = useRef<any[]>([]);
    const [geoLocationControlInstance, setGeoLocationControlInstance] = useState<
      BMap.GeolocationControl
    >();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      const { left = 0, top = 0 } = offsetSize;
      const opts: BMap.GeolocationControlOptions = {
        anchor: ControlAnchorEnum[anchor],
        offset: new BMap.Size(left, top),
      };
      // console.log(opts);
      const geoLocationControl = new BMap.GeolocationControl(opts);
      map.addControl(geoLocationControl);
      applyUpdatersToProps(updaterMap, {}, props, geoLocationControl, map);

      setGeoLocationControlInstance(geoLocationControl);
    }, []);

    useEffect(function updatersToProps() {
      if (geoLocationControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, geoLocationControlInstance, map);
      }
    });

    useEffect(function setEvents() {
      if (geoLocationControlInstance) {
        // @ts-ignore
        registeredEventsRef.current = registerEvents<BMap.GeolocationControl>(
          geoLocationControlInstance,
          props,
          eventMap,
        );
        return function clean() {
          registeredEventsRef.current.length > 0 &&
            // @ts-ignore
            unRegisterEvents<BMap.GeolocationControl>(
              geoLocationControlInstance,
              registeredEventsRef.current,
            );
        };
      }
      return;
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: geoLocationControlInstance,
      }),
      [geoLocationControlInstance],
    );

    return null;
  },
);

GeoLocationControl.defaultProps = defaultProps;
GeoLocationControl.displayName = 'mousetool-geolocationcontrol';

export default GeoLocationControl;
