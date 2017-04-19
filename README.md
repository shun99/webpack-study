# webpack的学习笔记
## 现状
伴随着移动互联的大潮，当今越来越多的网站已经从网页模式进化到了 Webapp 模式。它们运行在现代的
高级浏览器里，使用 HTML5、 CSS3、 ES6 等更新的技术来开发丰富的功能，网页已经不仅仅是完成
浏览的基本需求，并且webapp通常是一个单页面应用，每一个视图通过异步的方式加载，这导致页面初始
化和使用过程中会加载越来越多的 JavaScript 代码，这给前端开发的流程和资源组织带来了巨大的挑战。
前端开发和其他开发工作的主要区别，首先是前端是基于多语言、多层次的编码和组织工作，其次前端产
品的交付是基于浏览器，这些资源是通过增量加载的方式运行到浏览器端，如何在开发环境组织好这些碎片化
的代码和资源，并且保证他们在浏览器端快速、优雅的加载和更新，就需要一个模块化系统，这个理想中的
模块化系统是前端工程师多年来一直探索的难题。
## webpack.config.js
webpack 在执行的时候，除了在命令行传入参数，还可以通过指定的配置文件来执行。默认情况下，会搜索当前目录的
webpack.config.js 文件，这个文件是一个 node.js 模块，返回一个 json 格式的配置信息对象，
或者通过 --config 选项来指定配置文件。
```
var webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}
```
这段entry和output配置的含义是：编译entry.js文件，然后输出到bundle.js文件。
### Loader
Webpack 本身只能处理 JavaScript 模块，如果要处理其他类型的文件，就需要使用 loader 进行转换。
Loader 可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件作为参数，返回转换的结果。这样，
我们就可以通过 require 来加载任何类型的模块或文件，比如 CoffeeScript、 JSX、 LESS 或图片。
最终都是转换成js

### entry.js
要打包的模块放在此处，方便统一管理

### bundle.js
打好后的js，界面只需引入这一个js，就可以使用entry.js中指定的css，js，字体等等。

## webpack.config.js不同方式的打包结果
### 方式1
```
var webpack = require('webpack')

module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}
```
打包过程
```
Hash: 77d2ad12b06f4464e0ac
Version: webpack 2.2.1
Time: 809ms
    Asset     Size  Chunks             Chunk Names
bundle.js  12.4 kB       0  [emitted]  main
   [0] ./module.js 44 bytes {0} [built]
   [1] ./style.css 927 bytes {0} [built]
   [2] ./~/.0.13.2@style-loader/addStyles.js 6.91 kB {0} [built]
   [3] ./~/.0.26.2@css-loader!./style.css 188 bytes {0} [built]
   [4] ./~/.0.26.2@css-loader/lib/css-base.js 1.46 kB {0} [built]
   [5] ./entry.js 116 bytes {0} [built]

```
entry.js被打包到了bundle.js
### 方式2
```
var webpack = require('webpack')

module.exports = {
  entry: ['./entry.js', './entry1.js'],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}
```
打包过程
```
Hash: d8ac9daeb494b50bb470
Version: webpack 2.2.1
Time: 814ms
    Asset     Size  Chunks             Chunk Names
bundle.js  12.7 kB       0  [emitted]  main
   [0] ./module.js 44 bytes {0} [built]
   [1] ./style.css 927 bytes {0} [built]
   [2] ./entry.js 116 bytes {0} [built]
   [3] ./entry1.js 118 bytes {0} [built]
   [4] ./~/.0.13.2@style-loader/addStyles.js 6.91 kB {0} [built]
   [5] ./~/.0.26.2@css-loader!./style.css 188 bytes {0} [built]
   [6] ./~/.0.26.2@css-loader/lib/css-base.js 1.46 kB {0} [built]
   [7] multi ./entry.js ./entry1.js 40 bytes {0} [built]

```
entry.js和entry1.js都被打包到了bundle.js
### 样式3
```
var webpack = require('webpack')

module.exports = {
    entry: {
        app: './entry.js'
    },
    output: {
        //根据入口的name和文件hash自动为生成的js文件命名
        //name指的是entry的name，此处是app  [hash]是指本次打包相关的整体的hash，[chunkhash]是指分片的hash
        filename: '[name]-[hash].js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'}
        ]
    }
}

```
打包过程
```
Hash: 4f4ca8725786fd6f367f
Version: webpack 2.2.1
Time: 973ms
                      Asset     Size  Chunks             Chunk Names
app-4f4ca8725786fd6f367f.js  12.4 kB       0  [emitted]  app
   [0] ./module.js 44 bytes {0} [built]
   [1] ./style.css 927 bytes {0} [built]
   [2] ./~/.0.13.2@style-loader/addStyles.js 6.91 kB {0} [built]
   [3] ./~/.0.26.2@css-loader!./style.css 188 bytes {0} [built]
   [4] ./~/.0.26.2@css-loader/lib/css-base.js 1.46 kB {0} [built]
   [5] ./entry.js 116 bytes {0} [built]

```
生成app-4f4ca8725786fd6f367f.js （此文件名称可以修改）
## 分片
> 值得注意的是，webpack对代码拆分的定位仅仅是为了解决文件过大，无法并发加载，加载时间过长等问题，并不包括公共代码提取和复用的功能。对公共代码的提取将由CommonChunks插件来完成。




[webpack中文文档](http://zhaoda.net/webpack-handbook/module-system.html)
[webpack进阶](https://webpack.toobug.net/zh-cn/chapter3/config.html)