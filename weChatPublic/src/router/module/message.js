/**
 *  消息中心相关路由
 * */
const MessageCenter = () => import('pages/message/MessageCenter');
const MessageList = () => import('pages/message/MessageList');
export default [
  {
    path: '/message',
    name: '消息中心',
    component: MessageCenter,
    meta: {
      showTabbar: true,
      title: '消息中心'
    }
  }, {
    path: '/messageList',
    name: '消息列表',
    component: MessageList,
    meta: {
      title: '消息列表'
    }
  }
]
