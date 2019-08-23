import { useEffect, useRef, useState } from 'react';
import invariant from 'invariant';
import { isBrowser, LoadScriptUrlOptions, makeLoadScriptUrl } from '../_utils/help-tools';
import { injectScript } from '../_utils/injectscript';

export interface UseLoadScriptOptions extends LoadScriptUrlOptions {
  id?: string;
}
let previouslyLoadedUrl: string;

export default function useLoadScript({
  mapKey,
  id = 'baidumap',
  version = '3.0',
}: UseLoadScriptOptions) {
  const isMounted = useRef(false);
  const [isLoaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | undefined>(undefined);

  useEffect(function trackMountedState() {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(
    function validateLoadedState() {
      if (isLoaded) {
        invariant(
          // @ts-ignore
          !!window.BMap,
          'useLoadScript was marked as loaded, but window.BMap is not present. Something went wrong.',
        );
      }
    },
    [isLoaded],
  );
  const url = makeLoadScriptUrl({
    version,
    mapKey,
  });

  useEffect(
    function loadScriptAndModifyLoadedState() {
      if (!isBrowser) {
        return;
      }

      function setLoadedIfMounted() {
        if (isMounted.current) {
          setLoaded(true);
          previouslyLoadedUrl = url;
        }
      }

      if ((window as any).google && previouslyLoadedUrl === url) {
        setLoadedIfMounted();
        return;
      }

      injectScript({ id, url })
        .then(setLoadedIfMounted)
        .catch(function handleInjectError(err) {
          if (isMounted.current) {
            setLoadError(err);
          }
          console.warn(`error`);
          console.error(err);
        });
    },
    [id, url],
  );
  return { isLoaded, loadError, url };
}
