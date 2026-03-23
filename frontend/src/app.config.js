export default {
  pages: [
    'pages/home/index',
    'pages/statistics/index',
    'pages/community/index',
    'pages/mine/index',
    'pages/login/index',
    'pages/diaryEdit/index',
    'pages/diaryDetail/index'
  ],
  tabBar: {
    color: '#999999',
    selectedColor: '#4CAF50',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '日记',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/statistics/index',
        text: '统计',
        iconPath: 'assets/icons/stats.png',
        selectedIconPath: 'assets/icons/stats-active.png'
      },
      {
        pagePath: 'pages/community/index',
        text: '社区',
        iconPath: 'assets/icons/community.png',
        selectedIconPath: 'assets/icons/community-active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/icons/mine.png',
        selectedIconPath: 'assets/icons/mine-active.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'JOMO日记',
    navigationBarTextStyle: 'black'
  }
};
