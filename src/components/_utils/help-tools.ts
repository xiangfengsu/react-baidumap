import invariant from 'invariant';
import isFunction from 'lodash/isFunction';
import { IPoint } from './point';

export interface IEventListenerProps {
  addEventListener: (type: string, eventHandle: () => void) => void;
  removeEventListener: (type: string, eventHandle: () => void) => void;
}

export interface LoadScriptUrlOptions {
  mapKey?: string;
  version?: string;
}

export const isBrowser: boolean = typeof document !== 'undefined';

export const makeLoadScriptUrl = ({ mapKey, version }: LoadScriptUrlOptions) => {
  const params = [];

  invariant(!!mapKey, 'mapKey is must');

  if (mapKey !== '') {
    params.push(`ak=${mapKey}`);
  }

  if (version !== '') {
    params.push(`v=${version}`);
  }

  params.push('callback=initMap');

  return `https://api.map.baidu.com/api?${params.join('&')}`;
};

export const registerEvents = <T extends IEventListenerProps>(
  instance: T,
  props: any,
  eventMap: any,
) => {
  let events: any[] = [];
  Object.keys(eventMap).forEach(key => {
    const eventHandle = props[key];
    if (isFunction(eventHandle)) {
      const eventName = eventMap[key];
      instance.addEventListener(eventName, eventHandle);
      events.push([eventName, eventHandle]);
    }
  });
  return events;
};

export const unRegisterEvents = <T extends IEventListenerProps>(
  instance: T,
  registerEvents: any[],
) => {
  registerEvents.forEach(event => {
    const [eventName, eventHandle] = event;
    instance.removeEventListener(eventName, eventHandle);
  });
};

export const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    invariant(!url, 'Must use a valid image url');
    const img: HTMLImageElement = document.createElement('img');
    img.onload = () => {
      const { width, height } = img;
      resolve({ width, height });
    };
    img.onerror = err => {
      reject(err);
    };
    img.src = url;
  });
};

export const pointsTransform = (points: IPoint[]) => {
  return points.map(p => {
    const { lng, lat } = p;
    const point = new BMap.Point(lng, lat);
    return point;
  });
};
