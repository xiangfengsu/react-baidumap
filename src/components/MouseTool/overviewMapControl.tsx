import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { useMap } from '../map-context';
import { IOffset, ISize, EventParamsBase } from '../_utils/point';
import { ControlAnchorEnum } from '../MouseTool/navigationControl';

export interface IOverviewMapControlProps {
  anchor?: string;
  offset?: IOffset;
  size?: ISize;
  isOpen?: boolean;
  onViewchanged?: (event: Pick<EventParamsBase, 'type' | 'target' | 'isOpen'>) => void;
  onViewChanging?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
}

const defaultProps: Partial<IOverviewMapControlProps> = {
  anchor: ControlAnchorEnum[0],
};

const updaterMap = {
  anchor(instance: BMap.OverviewMapControl, anchor: string) {
    instance.setAnchor(ControlAnchorEnum[anchor]);
  },
  offset(instance: BMap.OverviewMapControl, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setOffset(new BMap.Size(left, top));
  },
  size(instance: BMap.OverviewMapControl, size: ISize) {
    const { width = 10, height = 10 } = size;
    instance.setSize(new BMap.Size(width, height));
  },
  isOpen(instance: BMap.OverviewMapControl) {
    instance.changeView();
  },
};
const eventMap = {
  onViewchanged: 'viewchanged',
  onViewChanging: 'viewchanging',
};

const OverviewMapControl = forwardRef(
  (props: IOverviewMapControlProps, ref: React.RefObject<Record<string, any>>) => {
    const map = useMap() as BMap.Map;
    const { anchor = ControlAnchorEnum[0], offset: offsetSize = { left: 0, top: 0 } } = props;
    const registeredEventsRef = useRef<any[]>([]);
    const [overviewMapControlInstance, setOverviewMapControlInstance] = useState<
      BMap.OverviewMapControl
    >();
    const prevProps = usePreviousProps(props);

    useEffect(function initInstance() {
      const { left = 0, top = 0 } = offsetSize;
      const opts: BMap.OverviewMapControlOptions = {
        anchor: ControlAnchorEnum[anchor],
        offset: new BMap.Size(left, top),
      };
      const overviewMapControl = new BMap.OverviewMapControl(opts);
      map.addControl(overviewMapControl);
      applyUpdatersToProps(updaterMap, {}, props, overviewMapControl, map);

      setOverviewMapControlInstance(overviewMapControl);
    }, []);

    useEffect(function updatersToProps() {
      if (overviewMapControlInstance) {
        applyUpdatersToProps(updaterMap, prevProps, props, overviewMapControlInstance, map);
      }
    });

    useEffect(function setEvents() {
      if (overviewMapControlInstance) {
        // @ts-ignore
        registeredEventsRef.current = registerEvents<BMap.OverviewMapControl>(
          overviewMapControlInstance,
          props,
          eventMap,
        );
        return function clean() {
          registeredEventsRef.current.length > 0 &&
            // @ts-ignore
            unRegisterEvents<BMap.OverviewMapControl>(
              overviewMapControlInstance,
              registeredEventsRef.current,
            );
        };
      }
      return;
    });

    useImperativeHandle(
      ref,
      () => ({
        instance: overviewMapControlInstance,
      }),
      [overviewMapControlInstance],
    );

    return null;
  },
);

OverviewMapControl.defaultProps = defaultProps;
OverviewMapControl.displayName = 'mousetool-overviewmapcontrol';

export default OverviewMapControl;
