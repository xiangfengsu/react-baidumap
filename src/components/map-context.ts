import { useContext, createContext } from 'react';
const MapContext = createContext<BMap.Map | null>(null);

export function useMap(): BMap.Map | null {
  const map = useContext(MapContext);
  // invariant(!!map, 'useMap needs a Map available up in the tree');
  return map;
}

export default MapContext;
