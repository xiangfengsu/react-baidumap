import { injectPluginScript } from './injectscript';

const pluginList: { [key: string]: string } = {
  DrawingManager: 'https://static.test.hongchouat.com/aliyunNAS/library/DrawingManager_min.js',
  RichMarker: 'https://static.test.hongchouat.com/aliyunNAS/library/RichMarker_min.js',
  DistanceTool: 'https://static.test.hongchouat.com/aliyunNAS/library/DistanceTool_min.js',
  TextIconOverlay: 'https://static.test.hongchouat.com/aliyunNAS/library/TextIconOverlay_min.js',
  MarkerClusterer: 'https://static.test.hongchouat.com/aliyunNAS/library/MarkerClusterer_min.js',
  HeatMap: 'https://static.test.hongchouat.com/aliyunNAS/library/Heatmap_min.js',
  LuShu: 'https://static.test.hongchouat.com/aliyunNAS/library/LuShu.js',
  InfoBox: 'https://static.test.hongchouat.com/aliyunNAS/library/InfoBox.js',
  CurveLine: 'https://static.test.hongchouat.com/aliyunNAS/library/CurveLine.js',
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

