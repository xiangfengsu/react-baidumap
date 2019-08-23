
export const reduce = (obj: any, fn: any, acc: any): any => {
  return Object.keys(obj).reduce(function reducer(newAcc, key) {
    return fn(newAcc, obj[key], key);
  }, acc);
};

export function forEach(obj: any, fn: any): any {
  Object.keys(obj).forEach(function iterator(key) {
    return fn(obj[key], key);
  });
}

export const applyUpdaterToNextProps = (
  updaterMap: any,
  prevProps: any,
  nextProps: any,
  // eslint-disable-next-line @getify/proper-arrows/params
  instance: any,
  mapInstance: BMap.Map | undefined,
): any => {
  let map: any = {};
  const iter = (fn: any, key: string) => {
    const nextValue = nextProps[key];
    if (nextValue !== prevProps[key]) {
      map[key] = nextValue;
      fn(instance, nextValue, mapInstance);
    }
  };

  forEach(updaterMap, iter);

  return map;
};

export function applyUpdatersToProps(
  updaterMap: any,
  prevProps: any,
  nextProps: any,
  instance: any,
  mapInstance: BMap.Map | undefined,
) {
  applyUpdaterToNextProps(updaterMap, prevProps, nextProps, instance, mapInstance);
}


