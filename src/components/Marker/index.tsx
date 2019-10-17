import React, {
  useEffect,
  createContext,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps, useClientRect } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import { addPlugins } from '../_utils/addPlugin';
import { useMap } from '../map-context';
import { IOffset, IPoint, EventParamsBase, ISize } from '../_utils/point';
export const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export enum MarkerDefaultIcon {
  ICON_DOT_GREEN = 'icon_dot_green',
  ICON_DOT_YELLOW = 'icon_dot_yellow',
  ICON_DOT_RED = 'icon_dot_red',
  ICON_CAR_GREEN = 'icon_car_green',
  ICON_CAR_YELLOW = 'icon_car_yellow',
  ICON_CAR_RED = 'icon_car_red',
}

export interface IMarkerProps {
  position: IPoint;
  icon?: string;
  iconSize?: ISize;
  iconUrl?: string;
  offset?: IOffset;
  title?: string;
  rotation?:number;
  label?: string | React.ReactNode;
  labelStyle?: React.CSSProperties;
  enableDragging?: boolean;
  enableMassClear?: boolean;
  children?: React.ReactNode;
  onClick?: (
    event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel' | 'overlay'>,
  ) => void;
  onDblClick?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseDown?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseUp?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseOut?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onMouseOver?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onDragStart?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onDragging?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onDragEnd?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
}

const defaultProps: Partial<IMarkerProps> = {
  title: '',
};

const eventMap = {
  onClick: 'onclick',
  onDblClick: 'ondblclick',
  onMouseDown: 'onmousedown',
  onMouseUp: 'onmouseup',
  onMouseOut: 'onmouseout',
  onMouseOver: 'onmouseover',
  onDragStart: 'ondragstart',
  onDragging: 'ondragging',
  onDragEnd: 'ondragend',
};

const updaterMap = {
  position(instance: BMapLib.RichMarker, position: IPoint) {
    const { lng, lat } = position;
    const point = new BMap.Point(lng, lat);
    instance.setPosition(point);
  },
  offset(instance: BMapLib.RichMarker, offset: IOffset) {
    const { left = 0, top = 0 } = offset;
    instance.setAnchor(new BMap.Size(left, top));
  },
  rotation(instance: BMapLib.RichMarker, rotation: number) {
    instance.setRotation(rotation);
  },
  enableDragging(instance: BMap.Marker, enable: boolean) {
    if (enable) instance.enableDragging();
    else instance.disableDragging();
  },
  enableMassClear(instance: BMap.Marker, enable: boolean) {
    if (enable) instance.enableMassClear();
    else instance.disableMassClear();
  },
  zIndex(instance: BMap.Marker, zIndex: number){
    instance.setZIndex(zIndex)
  }
};

const DefaultMarker: React.FunctionComponent<IMarkerProps> = props => {
  const {
    title,
    label,
    iconSize = { width: 24, height: 34 },
    iconUrl = 'ICON_DOT_GREEN',
    labelStyle,
  } = props;
  const isDefaultIcon = MarkerDefaultIcon[iconUrl];
  const iconSrc = isDefaultIcon
    ? `https://static.test.hongchouat.com/aliyunNAS/library/icon/${MarkerDefaultIcon[iconUrl]}.svg`
    : reg.test(iconUrl)
    ? iconUrl
    : `https://static.test.hongchouat.com/aliyunNAS/library/icon/${MarkerDefaultIcon['ICON_DOT_GREEN']}.svg`;
  const [rect, ref] = useClientRect();
  const styles: React.CSSProperties = {
    position: 'absolute',
    whiteSpace: 'nowrap',
    display: 'inline',
    cursor: 'inherit',
    left: '0px',
    top: '0px',
    ...labelStyle,
  };

  const boxStyles: React.CSSProperties = {
    position: 'absolute',
    left: rect ? `${-rect['width'] / 2}px` : '-12px',
    top: rect ? `${-rect['height']}px` : '-34px',
  };
  const { width, height } = iconSize;
  return (
    <div title={title} style={boxStyles}>
      <img ref={ref} style={{ width: width, height: height }} alt="" src={iconSrc} />
      <label htmlFor="" style={styles}>
        {label}
      </label>
    </div>
  );
};

export const MarkerContext = createContext<BMap.Marker | null>(null);

const Marker = forwardRef((props: IMarkerProps, ref: React.RefObject<Record<string, any>>) => {
  const map = useMap() as BMap.Map;
  const { position = map.getCenter(), children } = props;
  const registeredEventsRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLElement>(document.createElement('div'));
  const [markerInstance, setMarkerInstance] = useState<BMapLib.RichMarker>();
  const prevProps = usePreviousProps(props);

  useEffect(function initInstance() {
    // @ts-ignore
    addPlugins(['RichMarker']).then(() => {
      // console.log('FFFFFF');
      const { lng, lat } = position;
      const point = new BMap.Point(lng, lat);
      const marker = new BMapLib.RichMarker(containerRef.current, point);
      map.addOverlay(marker);
      applyUpdatersToProps(updaterMap, {}, props, marker, map);
      setMarkerInstance(marker);
    });
  }, []);

  useEffect(function updatersToProps() {
    if (markerInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, markerInstance, map);
    }
  });

  useEffect(function setEvents() {
    if (markerInstance) {
      registeredEventsRef.current = registerEvents<BMapLib.RichMarker>(
        markerInstance,
        props,
        eventMap,
      );
      return function clean() {
        registeredEventsRef.current.length > 0 &&
          unRegisterEvents<BMapLib.RichMarker>(markerInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => ({
      marker: markerInstance,
    }),
    [markerInstance],
  );

  if (markerInstance) {
    const parentNode = containerRef.current.parentNode as HTMLElement;
    if (parentNode) {
      parentNode.style.background = 'none';
      if (children) return createPortal(React.Children.only(children), containerRef.current);
      return createPortal(<DefaultMarker {...props} />, containerRef.current);
    }
  }

  return null;
});

Marker.defaultProps = defaultProps;

export default Marker;
