# react-bmaps


> react-bmaps 是一个基于 React 封装的百度地图组件；帮助你轻松的接入地图到 React 项目中。除了必须引用的 Map 组件外，我们目前提供了最常用的 11 个地图组件，能满足大部分简单的业务场景；如果你有更复杂的需求，或者觉得默认提供的组件功能不够，你完全可以自定义一个地图组件，然后根据百度地图原生 API 做百度地图允许你做的一切事情。

### 最近更新

react-bmaps 初版 1.0.0（2019-08-23）


### 扩展组件

如果 react-bmaps 中已有的组件不能满足你的业务需求，你可以使用自己写的地图组件。
```jsx
 import { useMap } from 'react-bmaps/map-context';
 const map = useMap();
```

在你的组件中，通过map参数访问到创建好的百度地图实例，你可以根据百度地图API做你做的一切事情。实际上，react-bmaps 中的其他组件就是这么做的。


如何在项目中接入 react-bmaps;

### 安装
```sh
npm install --save react-bmaps
```

### npm 用法

```html
<div id="app"></div>
```

```css
#app {
  width: 600px;
  height: 400px;
}
```

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'react-bmaps';

ReactDOM.render(
  <Map mapKey={YOUR_AMAP_KEY} />,
  document.querySelector('#app')
)
```

mapKey 说明见下文

也可以手工引入你需要的组件：

 ```jsx   
import Map from 'react-bmaps/lib/map';
import Marker from 'react-bmaps/lib/marker';
// ... your other code
 ```


### 关于 Key

在上面的例子中需要给 Map 组件传入 `mapKey` 属性，这个是百度图给开发者分配的开发者 Key；你可以在[百度开放平台](http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/getkey)申请你自己的 Key。

在 react-bmaps 中 Key 的传入方式有两种:

+ 给 Map 组件传入 `mapKey` 属性（因为 React 框架本身对 `key` 属性有其他作用，所以不能用 `key`，所以我们用 `mapKey`），这样的缺点是如果多个地方使用就要每次都要传入；
+ 你也可以定义一个纯组件,把 Map 组件的 mapKey 属性写好后返回新组件。

组件的使用请移步[组件文档](http://react-baidu-map.surge.sh/)。




