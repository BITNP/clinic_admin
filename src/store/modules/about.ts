const state = {
  changeLog: [
    {
      version: "v0.13.11",
      dateTime: "2019-10-19",
      change: [
        { refactor: "更好的内部报错与外部报错" },
        { refactor: "响应式" }
      ],
      color: "white",
      scale: "large"
    },
    {
      version: "v0.13.10",
      dateTime: "2019-10-17",
      change: [{ fix: "修复后端带来的 break change" }],
      color: "pink",
      scale: "small"
    },
    {
      version: "v0.13.9",
      dateTime: "2019-10-16",
      change: [
        { feature: "增加了`未到诊所`状态" },
        { feature: "增加批量关闭未完成工单的操作" }
      ],
      color: "blue",
      scale: "small"
    },
    {
      version: "v0.13.8",
      dateTime: "2019-10-14",
      change: [
        { fix: "增加字数限制提示（没有真正限制提交）" },
        { feature: "扔给明天以后自动插入新工单" },
        { fix: "增大了公告编辑框的宽度以方便显示" }
      ],
      color: "white",
      scale: "middle"
    },
    {
      version: "v0.13.7",
      dateTime: "2019-10-13",
      change: [{ fix: "本地持久化存储过滤参数" }],
      color: "yellow",
      scale: "small"
    },
    {
      version: "v0.13.6",
      dateTime: "2019-10-12",
      change: [
        { fix: "修复公告显示问题，隐藏content" },
        { fix: "抽离组件" },
        { feature: "表头排序功能" }
      ],
      color: "black",
      scale: "middle"
    },
    {
      version: "v0.13.5",
      dateTime: "2019-10-10",
      change: [{ fix: "修复不能在同一时间创建两个校区问题" }],
      color: "grey lighten-2",
      scale: "small"
    },
    {
      version: "v0.13.4",
      dateTime: "2019-10-08 - 2019-10-09",
      change: [
        { fix: "加入优先级，修复公告类型显示问题" },
        { fix: "删除无用的注释代码" },
        { feature: "可以通过 FAB 新建工单" }
      ],
      color: "orange lighten-2",
      scale: "small"
    },
    {
      version: "v0.13.3",
      dateTime: "2019-10-02",
      change: [{ fix: "/schedule 中时间选择器无法正常渲染" }],
      color: "teal lighten-2",
      scale: "small"
    },
    {
      version: "v0.13.2",
      dateTime: "2019-09-28",
      change: [
        { fix: "工单号零填充" },
        { feature: "增加三种过滤功能" },
        { feature: "更直观的修改个人信息方式" },
        { feature: "可以修改自己的校区了" },
        { fix: "刷新功能可以刷新服务时间数据了（还有员工信息）" }
      ],
      color: "deep-purple",
      scale: "large"
    },
    {
      version: "v0.13.1",
      dateTime: "2019-09-28 凌晨",
      change: [
        { refactor: "重构工单的列表渲染模块，分离组件" },
        { fix: "修复不从分的状态转移判断" },
        { fix: "修复user界面的icon显示问题" },
        { feature: "增加撤销功能“后悔药”" },
        { feature: "默认修理人为自己" },
        { fix: "修复若干不一致性问题" },
        { fix: "‘更多’按钮居中" },
        { feature: "获取数据时也有进度条了" }
      ],
      color: "deep-purple",
      scale: "large"
    },
    {
      version: "v0.13.0",
      dateTime: "2019-09-27",
      change: [
        { fix: "修复时间中因为后台api改变产生的break" },
        { feature: "增加开始与结束时间，细化服务信息" }
      ],
      color: "yellow",
      scale: "small"
    },
    {
      version: "v0.12.2",
      dateTime: "2019-09-23 - 2019-09-24",
      change: [
        { fix: "修复时间" },
        { fix: "修复公告管理若干显示bug" },
        { feature: "增加登出按钮" }
      ],
      color: "pink",
      scale: "small"
    },
    {
      version: "v0.12.1",
      dateTime: "2019-08-18 下午",
      change: [
        { fix: "修复工单号无法显示的问题" },
        { fix: "修复预约时间显示问题" },
        { feature: "已完成时使用灰色显示" }
      ],
      color: "cyan",
      scale: "small"
    },
    {
      version: "v0.12.0",
      dateTime: "2019-08-18 下午",
      change: [
        { feature: "增加公告管理功能" },
        { feature: "公告编辑中可以预览markdown内容" },
        { feature: "在加载时显示loading动画" }
      ],
      color: "cyan",
      scale: "large"
    },

    {
      version: "v0.11.0",
      dateTime: "2019-08-17 下午",
      change: [
        { feature: "增加服务时间管理功能" },
        { fix: "修复刷新功能无法正确加载用户的问题" }
      ],
      color: "purple",
      scale: "large"
    },
    {
      version: "v0.10.1",
      dateTime: "2019-08-14 下午",
      change: [
        { feature: "更新vuetify 1.5.x --> 2.x" },
        {
          fix: "修复一些空间布局，个人信息的布局以及icon"
        },
        { todo: "移除sms功能" },
        { todo: "可以添加一个工单(目前只能在`/admin`中添加)" }
      ],
      color: "red",
      scale: "large"
    },
    {
      version: "v0.9.11",
      dateTime: "2019-02-24 晚",
      change: [
        { feature: "根据后端变化, 增加短信通知功能" },
        { fix: "修改状态改变问题和本地化" }
      ],
      color: "blue",
      scale: "small"
    },
    {
      version: "v0.9.10",
      dateTime: "2019-02-19 凌晨",
      change: [{ feature: "根据后端变化, 修改初始化顺序实现校区区分" }],
      color: "blue",
      scale: "small"
    },
    {
      version: "v0.9.9",
      dateTime: "2019-02-17 晨",
      change: [
        {
          feature: "新版register界面上线"
        }
      ],
      color: "cyan"
    },
    {
      version: "v0.9.8",
      dateTime: "2019-02-16 晚",
      change: [
        {
          feature: "增加图标颜色"
        },
        {
          feature: "增加按钮图标"
        },
        {
          fix: "空白日期显示错误"
        },
        {
          fix: "选择明天维修后未创建新工单"
        },
        {
          fix: "临时值班无法选择自己"
        },
        {
          fix: "解决对齐问题，但是失去了蛇形的美感QAQ"
        }
      ],
      scale: "large",
      color: "cyan"
    },
    {
      version: "v0.9.7",
      dateTime: "2019-02-16 15:24",
      change: [
        {
          feature: "完成状态依然可以修改电脑的取走状态"
        },
        {
          feature: "增加Change Log（此页面）"
        }
      ],
      color: "red lighten-2",
      scale: "small"
    },
    {
      version: "v0.9.6",
      dateTime: "2019-02-16",
      change: [
        {
          fix: "typo & 时间格式"
        },
        {
          fix: "到达后提交时间"
        }
      ],
      color: "indigo lighten-2",
      scale: "small"
    },
    {
      version: "v0.9.5",
      dateTime: "2019-02-16 凌晨",
      change: [
        {
          fix: "解决疯狂请求用户信息问题"
        }
      ],
      color: "blue lighten-2",
      scale: "large"
    },
    {
      version: "v0.9.0",
      dateTime: "2019-02-15",
      change: [
        {
          feature: "完成主要框架",
          "why v0.9.0?": "基于老版本进行了重构"
        }
      ],
      color: "yellow lighten-2",
      scale: "large"
    }
  ]
};

export default {
  namespaced: true,
  state
};
