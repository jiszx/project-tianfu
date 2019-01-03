/**
 *  订单相关路由
 * */
const OrderList = () => import('pages/order/OrderList');
const OrderDetails = () => import('pages/order/OrderDetails');
const SubmitingOrder = () => import('pages/order/SubmitingOrder');
const confirmReceipt = () => import('pages/order/confirmReceipt');
const publishReport = () => import('pages/order/publishReport');
const reportSuccess = () => import('pages/order/reportSuccess');
const OrderProtect = () => import('pages/order/OrderProtect');
const ProtectSuccess = () => import('pages/find/purchasing/PublicSuccess');
const OrderPay = () => import('pages/order/OrderPay');
const PayType = () => import('pages/order/PayType');
const PaySuccess = () => import('pages/order/PaySuccess');
export default [{
  path: '/orderList',
  name: '我的订单',
  component: OrderList,
  meta: {
    showTabbar: false,
    title: '我的订单'
  }
}, {
  path: '/orderDetails',
  name: '订单详情',
  component: OrderDetails,
  meta: {
    title: '订单详情'
  }
}, {
  path: '/submit-order',
  name: '待提交订单',
  component: SubmitingOrder,
  meta: {
    title: '填写订单'
  }
}, {
  path: '/pay-type',
  name: '选择支付配送方式',
  component: PayType,
  meta: {
    title: '选择支付配送方式'
  }
},
{
  path: '/confirm',
  name: '交易成功',
  component: confirmReceipt,
  meta: {
    title: '交易成功'
  }
},
{
  path: '/publishreport',
  name: '发表评价',
  component: publishReport,
  meta: {
    title: '发表评价'
  }
},
{
  path: '/reportsuccess',
  name: '评价成功',
  component: reportSuccess,
  meta: {
    title: '评价成功'
  }
},
 {
  path: '/orderProtect',
  name: '维权售后',
  component: OrderProtect,
  meta: {
    title: '维权售后'
  }
}, {
  path: '/protectSuccess',
  name: '提交成功',
  component: ProtectSuccess,
  meta: {
    title: '提交成功'
  }
}, 
 {
  path: '/orderPay',
  name: '在线支付',
  component: OrderPay,
  meta: {
    title: '在线支付'
  }
}, 
 {
  path: '/orderPaySuccess',
  name: '支付成功',
  component: PaySuccess,
  meta: {
    title: '支付成功'
  }
}]
