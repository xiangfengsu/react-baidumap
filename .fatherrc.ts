
const options = {
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
  ],
  // doc:{
  //   htmlContext:{
  //     head: {
  //       scripts: [
  //         { src: 'http://bmaplib.surge.sh/tracksession/index.js' },
  //       ],
  //     },
  //   }
  // }
};

export default options;
