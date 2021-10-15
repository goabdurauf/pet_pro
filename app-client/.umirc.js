// ref: https://umijs.org/config/
import {resolve} from "path";

export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/login',
          component: './login',
        },
        {
          path: '/',
          component: './login',
        },
        {
          path: '/user',
          component: './user',
        },
        {
          path: '/404',
          component: './404',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'app-client',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  proxy: {
    "/api": {
      "target": "http://localhost:80/",
      "changeOrigin": true
    }
  },
  alias: {
    utils: resolve(__dirname, "./src/utils"),
    config: resolve(__dirname, "./src/utils/config"),
    components: resolve(__dirname, "./src/components"),
  },
  outputPath:'../app-server-side/src/main/resources/static'

};
