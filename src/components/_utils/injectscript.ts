import { isBrowser } from './help-tools';

interface WindowWithMap extends Window {
  initMap?: () => void;
  pluginInit?: () => void;
}

interface InjectScriptArg {
  id: string;
  url: string;
}

export const injectScript = ({ url, id }: InjectScriptArg): Promise<any> => {
  if (!isBrowser) {
    Promise.reject(new Error('document is undefined'));
  }

  return (
    new Promise(function injectScriptCallback(resolve, reject) {
      const existingScript = document.getElementById(id) as HTMLScriptElement | undefined;
      const windowWithMap: WindowWithMap = window;
      if (existingScript) {
        // url 和 id 相同
        if (existingScript.src === url) {
          if (existingScript.getAttribute('data-state') === 'ready') {
            return resolve(id);
          } else {
            const originalInitMap = windowWithMap.initMap;
            windowWithMap.initMap = function() {
              if (originalInitMap) {
                originalInitMap();
              }
              resolve(id);
            };

            return;
          }
        }
        // Same script id but url changed: recreate the script
        else {
          existingScript.remove();
        }
      }

      const script = document.createElement('script');

      script.type = 'text/javascript';
      script.src = url;
      script.id = id;
      script.async = true;
      script.onerror = reject;

      windowWithMap.initMap = function onload() {
        script.setAttribute('data-state', 'ready');
        resolve(id);
      };

      document.head.appendChild(script);
    })
      // eslint-disable-next-line @getify/proper-arrows/name
      .catch(err => {
        console.error('injectScript error: ', err);
      })
  );
};

export const injectPluginScript = ({ url, id }: InjectScriptArg): Promise<any> => {
  if (!isBrowser) {
    Promise.reject(new Error('document is undefined'));
  }

  return (
    new Promise(function injectPluginScriptCallback(resolve, reject) {
      const existingScript = document.getElementById(id) as HTMLScriptElement | undefined;
      const windowWithMap: WindowWithMap = window;
      if (existingScript) {
        // url 和 id 相同
        if (existingScript.src === url) {
          if (existingScript.getAttribute('data-state') === 'ready') {
            resolve(id);
          } else {
            const originalPluginInit = windowWithMap.pluginInit;
            windowWithMap.pluginInit = existingScript.onload = function() {
              if (originalPluginInit) {
                originalPluginInit();
              }
              resolve(id);
            };

            return;
          }
        }
        // Same script id but url changed: recreate the script
        else {
          existingScript.remove();
        }
      }

      const script = document.createElement('script');

      script.type = 'text/javascript';
      script.src = url;
      script.id = id;
      script.async = true;
      script.onerror = reject;
      windowWithMap.pluginInit = script.onload = function onload() {
        script.setAttribute('data-state', 'ready');
        resolve(id);
      };

      document.head.appendChild(script);
    })
      // eslint-disable-next-line @getify/proper-arrows/name
      .catch(err => {
        console.error('injectScript error: ', err);
      })
  );
};
