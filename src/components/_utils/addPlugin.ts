import { injectPluginScript } from './injectscript';

const pluginList: { [key: string]: string } = {
  DrawingManager: 'http://bmaplib.surge.sh/DrawingManager_min.js',
  RichMarker: 'http://bmaplib.surge.sh/RichMarker_min.js',
  DistanceTool: 'http://bmaplib.surge.sh/DistanceTool_min.js',
  TextIconOverlay: 'http://bmaplib.surge.sh/TextIconOverlay_min.js',
  MarkerClusterer: 'http://bmaplib.surge.sh/MarkerClusterer_min.js',
  HeatMap: 'http://bmaplib.surge.sh/Heatmap_min.js',
  LuShu: 'http://bmaplib.surge.sh/LuShu.js',
  InfoBox: 'http://bmaplib.surge.sh/InfoBox.js',
  CurveLine: 'http://bmaplib.surge.sh/CurveLine.js',
};
export const addPlugins = (plugins: string[] = []): Promise<any> => {
  const injecScripts = [];
  for (let plugin of plugins) {
    if (plugin in pluginList) {
      injecScripts.push(injectPluginScript({ id: plugin, url: pluginList[plugin] }));
    }
  }
  return Promise.all(injecScripts);
};

