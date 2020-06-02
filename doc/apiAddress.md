#API地址

## 登录注册

- 登录地址 `/login`
  - 用户名 : `name`
  - 密码 : `key`
- 注册地址 `/sign`
  - 用户名 : `name`
  - 密码 : `key`
  - 邮箱 : `email`
- 数据刷新时间 `/setTime`
  - 用户Id : `uId`
  - 新的时间 : `time`

## 环境相关

## 监测点相关

- 首页列表数据读取地址 `/getDevList`
-  添加数据源地址 `/addDev`

- 监测点信息查看地址 `/getDevInfo`
  - 监测点ID : `devId`

- 监测点历史变化图地址 `/getChart`
  - 监测点ID : `devId`

- 监测点信息修改提交地址 `/editInfo`

- 监测点修改验证地址 `/checkCode`
  - 密钥名 : `codeName`
  - 密钥 : `code`

