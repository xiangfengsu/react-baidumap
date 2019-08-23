import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { Spin } from 'antd';
import { registerEvents, unRegisterEvents } from '../_utils/help-tools';
import { usePreviousProps } from '../_utils/hooks';
import { applyUpdatersToProps } from '../_utils/help';
import useLoadScript from './useLoadScript';
import MapContext from '../map-context';
import { IPoint, EventParamsBase } from '../_utils/point';
import './index.less';

export interface IMapProps {
  mapKey: string;
  version?: string;
  id?: string;
  mapContainerStyle?: React.CSSProperties;
  mapContainerClassName?: string;
  zoom?: number;
  enableDragging?: boolean;
  enableScrollWheelZoom?: boolean;
  enableDoubleClickZoom?: boolean;
  enableKeyboard?: boolean;
  inMapViewport?: boolean;
  viewportPoints?: IPoint[];
  center?: number[] | string;
  children?: React.ReactNode;
  onClick?: (
    event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel' | 'overlay'>,
  ) => void;
  onDblClick?: (event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel'>) => void;
  onRightClick?: (
    event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel' | 'overlay'>,
  ) => void;
  onRightDblClick?: (
    event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel' | 'overlay'>,
  ) => void;
  onMapTypeChange?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onMouseMove?: (
    event: Pick<EventParamsBase, 'type' | 'target' | 'point' | 'pixel' | 'overlay'>,
  ) => void;

  onMouseOver?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onMouseOut?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onMouseStart?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onMoving?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onMoveEnd?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onZoomStart?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onZoomEnd?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onAddOverlay?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onAddControl?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onRemoveControl?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onRemoveOverlay?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onClearOverlays?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onDragStart?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point'>) => void;
  onDragging?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point'>) => void;
  onDragEnd?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point'>) => void;
  onAddTileLayer?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onRemoveTileLayer?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onLoad?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point' | 'zoom'>) => void;
  onResize?: (event: Pick<EventParamsBase, 'type' | 'target' | 'size'>) => void;
  onHotspotClick?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onHotspotOver?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onHotspotOut?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onTilesLoaded?: (event: Pick<EventParamsBase, 'type' | 'target'>) => void;
  onTouchStart?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point'>) => void;
  onTouchMove?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point'>) => void;
  onTouchEnd?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point'>) => void;
  onLongPress?: (event: Pick<EventParamsBase, 'type' | 'target' | 'pixel' | 'point'>) => void;
}

const defaultProps: Partial<IMapProps> = {
  id: `map_${Date.now()}`,
  zoom: 16,
  enableDragging: true,
  enableDoubleClickZoom: true,
  enableScrollWheelZoom: true,
};
const eventMap = {
  onClick: 'click',
  onDblClick: 'dblclick',
  onRightClick: 'rightclick',
  onRightDblClick: 'rightdblclick',
  onMapTypeChange: 'maptypechange',
  onMouseMove: 'mousemove',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout',
  onMouseStart: 'movestart',
  onMoving: 'moving',
  onMoveEnd: 'moveend',
  onZoomStart: 'zoomstart',
  onZoomEnd: 'zoomend',
  onAddOverlay: 'addoverlay',
  onAddControl: 'addcontrol',
  onRemoveControl: 'removecontrol',
  onRemoveOverlay: 'removeoverlay',
  onClearOverlays: 'clearoverlays',
  onDragStart: 'dragstart',
  onDragging: 'dragging',
  onDragEnd: 'dragend',
  onAddTileLayer: 'addtilelayer',
  onRemoveTileLayer: 'removetilelayer',
  onLoad: 'load',
  onResize: 'resize',
  onHotspotClick: 'hotspotclick',
  onHotspotOver: 'hotspotover',
  onHotspotOut: 'hotspotout',
  onTilesLoaded: 'tilesloaded',
  onTouchStart: 'touchstart',
  onTouchMove: 'touchmove',
  onTouchEnd: 'touchend',
  onLongPress: 'longpress',
};

const updaterMap = {
  enableDragging(map: BMap.Map, enable: boolean) {
    if (enable) map.enableDragging();
    else map.disableDragging();
  },
  enableScrollWheelZoom(map: BMap.Map, enable: boolean) {
    if (enable) map.enableScrollWheelZoom();
    else map.disableScrollWheelZoom();
  },
  enableDoubleClickZoom(map: BMap.Map, enable: boolean) {
    if (enable) map.enableDoubleClickZoom();
    else map.disableDoubleClickZoom();
  },
  enableKeyboard(map: BMap.Map, enable: boolean) {
    if (enable) map.enableKeyboard();
    else map.disableKeyboard();
  },
  zoom(map: BMap.Map, zoom: number) {
    map.setZoom(zoom);
  },
  center(map: BMap.Map, center: string | number[]) {
    if (Array.isArray(center)) {
      const [lng, lat] = center;
      const point = new BMap.Point(lng, lat);
      map.setCenter(point);
    }
  },
};

const Map = forwardRef((props: IMapProps, ref: React.RefObject<Record<string, any>>) => {
  const {
    mapKey,
    version,
    id,
    children,
    mapContainerStyle,
    mapContainerClassName,
    zoom = 16,
    center,
    inMapViewport = true,
    viewportPoints = [],
  } = props;
  const { isLoaded } = useLoadScript({ mapKey, version });
  const registeredEventsRef = useRef<any[]>([]);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapOnLoad, setMapOnLoad] = useState<boolean>(false);
  const [mapInstance, setMapInstance] = useState<BMap.Map | null>(null);
  const prevProps = usePreviousProps(props);

  useEffect(() => {
    function mapInit(map: BMap.Map) {
      if (typeof center === 'string') {
        map.centerAndZoom(center);
      } else if (Array.isArray(center)) {
        const [lng, lat] = center;
        const point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, zoom);
      }
    }
    if (isLoaded && mapRef.current) {
      const map = new BMap.Map(mapRef.current);
      map.onload = () => {
        setMapOnLoad(true);
      };
      mapInit(map);
      applyUpdatersToProps(updaterMap, {}, props, map, undefined);

      setMapInstance(map);
    }
  }, [isLoaded]);

  useEffect(
    function setPointsInViewport() {
      if (mapInstance && inMapViewport) {
        const bPoins: BMap.Point[] = [];
        viewportPoints.forEach(point => {
          const { lng, lat } = point;
          bPoins.push(new BMap.Point(lng, lat));
        });

        mapInstance.setViewport(bPoins);
      }
    },
    [mapInstance, inMapViewport, viewportPoints],
  );

  useEffect(function updatersToProps() {
    if (mapInstance) {
      applyUpdatersToProps(updaterMap, prevProps, props, mapInstance, undefined);
    }
  });

  useEffect(function setEvents() {
    if (mapInstance) {
      // @ts-ignore
      registeredEventsRef.current = registerEvents<BMap.Map>(mapInstance, props, eventMap);
      return function clean() {
        registeredEventsRef.current.length > 0 &&
          // @ts-ignore
          unRegisterEvents<BMap.Map>(mapInstance, registeredEventsRef.current);
      };
    }
    return;
  });

  useImperativeHandle(
    ref,
    () => {
      if (mapOnLoad) {
        return {
          map: mapInstance,
        };
      }
      return {
        map: null,
      };
    },
    [mapOnLoad],
  );

  const classes = classNames('map-box', { mapContainerClassName: !!mapContainerClassName });
  return (
    <div className={classes} style={mapContainerStyle}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {isLoaded ? (
          <>
            {' '}
            <div id={id} ref={mapRef} className="map-container" />
            {mapInstance && mapOnLoad && (
              <MapContext.Provider value={mapInstance}>
                <div>{children}</div>
              </MapContext.Provider>
            )}
          </>
        ) : (
          <div className="map-loading">
            <Spin />
          </div>
        )}
      </div>
    </div>
  );
});

Map.defaultProps = defaultProps;

export default React.memo(Map);
