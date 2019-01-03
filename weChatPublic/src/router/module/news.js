/**
 *  新闻相关路由
 * */
const NewsList = () => import('pages/news/NewsList');
const NewsDetails = () => import('pages/find/ClassDetail');

export default [{
  path: '/newsList',
  name: '行业动态',
  component: NewsList,
  meta: {
    showTabbar: false,
    title: '行业动态'
  }
}, {
  path: '/newsDetails',
  name: '动态详情',
  component: NewsDetails,
  meta: {
    title: '动态详情'
  }
}, {
  path: '/adDetails',
  name: '广告详情',
  component: NewsDetails,
  meta: {
    title: '广告详情'
  }
}]