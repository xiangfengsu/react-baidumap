import { IBundleOptions } from 'father';

const options: IBundleOptions = {
  esm: 'babel',
  cjs: 'babel',
  entry: 'src/index.ts',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ]
};

export default options;
