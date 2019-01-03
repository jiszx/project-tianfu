/**
 * type管理
 */
// Toast消息弹层
export const SHOW_MSG_TIPS = "showMsgTips"; // 显示提示弹层
export const HIDE_MSG_TIPS = "hideMsgTips"; // 隐藏提示弹层

//  发现模块

//  我的模块
export const UPADTE_OAUTH = 'updataOauth' // 更新认证相关数据
export const SAVE_USER_TO_LOCAL = 'saveUserToLocal' // 将user相关数据存储在localstorage里面
export const UPDATE_USER_FROM_LOCAL = 'updateUserFromLocal' // 从localstore里取出user数据然后更新vuex中的user
export const UPDATE_USERDATA = 'updataUserData' // 更新用户个人信息
export const UPDATE_OPENID = 'updateopenId' // 更新微信openId
export const UPDATE_REFRESH_TOKEN = 'updateRefreshToken' // 更新微信access_token
export const SETTING_GET_INFO = 'settingGetInfo' // 获取基础设置信息

//  订单模块
// order 订单相关
export const ADD_SUBMITING_ORDER = 'addSubmitingOrder' // 添加商品到待提交订单
export const GET_SUBMITING_ORDER = 'getSubmitingOrder' // 获取待提交订单
export const UPDATE_SUBMITING_ADDRESS = 'updateSubmitingAddress' // 更新订单地址
export const UPDATE_SUBMITING_REMARK = 'updateSubmitingRemark' // 更新备注
export const UPDATE_SUBMITING_PAYTYPE = 'updateSubmitingPaytype' // 更新订单支付方式
export const UPDATE_SUBMITING_CONVEY = 'updateSubmitingConvey' // 配送方式
export const UPDATE_SUBMITING_TRANSTIME = 'updateSubmitingTransTime' // 更新配送时间

//  消息模块
export const MESSAGE_GET_LIST = 'messageGetList' // 获取消息列表

//  获取token
export const USER_GET_ACCESS = 'userGetAccess' // 获取消息列表
export const UNREAD_MESSAGE = 'unreadMessage' // 获取未读消息

// 历史搜索记录相关
export const SEARCH_ADD_HISTORY = 'searchAddHistory' // 添加搜索记录
export const SEARCH_EMPTY_HISTORY = 'searchEmptyHistory' // 清空历史记录

// 购物车
export const CART_GET_LIST = 'cartGetList' // 获取购物车商品列表
export const CART_GET_MORE_LIST = 'cartGetMoreList' // 获取购物车商品列表
export const CART_ADD = 'cartAdd' // 添加商品到购物车
export const UPDATE_CART_SELECTED = 'updateCartSelected' // 更新选中的购物车
export const CART_ADD_AGAIN = 'cartAddAgain' // 再次购买
