
# 多点温度监测系统

## 系统说明
本系统计划采用纯前端方案制作，由于系统功能并不复杂，故采用单页应用方式开发，目前使用技术：
- 前端基础 `VUE.JS`
- 后端基础 `NODE.JS`
- 数据库 `MONGODB`

---

为了增强系统的交互性能，使用了如下插件：

**前端插件**

- FontAwesome
- ECharts

**后端插件**

- Koa-bodyparser
- Koa-router
- Koa-static

---

为了更好的实现功能需求，使用了如下插件：

**前端插件**

- Axios

**后端插件**

- Koa
- Mongoose

 > 具体插件版本等信息请见 `package.json` 

## 系统目录说明

``````
- public --> 系统入口主文件
- src --> 系统开发文件
  - assets --> 系统静态资源文件
  - components --> 系统所有组件
  - router --> 系统路由文件
  - views --> 系统所有页面
- doc --> 系统开发API接口文档
``````

