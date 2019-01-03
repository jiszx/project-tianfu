const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 时间格式方法
 *
 * @param {any} timeStamp  时间戳，秒级/毫秒级
 * @param {any} type 格式化时间类型，默认  Y-M-D H:I:S
 * @returns {string} formatTime 格式化后的时间 例如： 2017-05-05 12:09:22
 */
const formatDate = (nS, str) => {
  if (!nS) {
    return ''
  }
  if (isNaN(parseInt(nS))) {
    return nS
  }
  var date = new Date(nS)
  var year = date.getFullYear()
  var mon = date.getMonth() + 1
  var day = date.getDate()
  var hours = date.getHours()
  var minu = date.getMinutes()
  var sec = date.getSeconds()

  if (str === 'yyyy-MM-dd') {
    return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day)
  } else if (str === 'hh-mm-ss') {
    return (hours < 10 ? '0' + hours : hours) + ':' + (minu < 10 ? '0' + minu : minu) + ':' + (sec < 10 ? '0' + sec : sec)
  } else if (str === 'yyyy/MM/dd') {
    return year + '/' + (mon < 10 ? '0' + mon : mon) + '/' + (day < 10 ? '0' + day : day)
  } else {
    return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minu < 10 ? '0' + minu : minu) + ':' + (sec < 10 ? '0' + sec : sec)
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 字符串格式验证
 * checkType('165226226326','phone')
 * false
 * 大家可以根据需要扩展
 */
const checkType = (str, type) => {
  str = str ? str.toString() : ''
  switch (type) {
    case 'email':
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str)
    case 'phone': // 手机含189,199号段
      return /^1[3|4|5|7|8|9][0-9]{9}$/.test(str)
    case 'tel':
      return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str)
    case 'number':
      return /^\+?[1-9][0-9]*$/.test(str)
    case 'english':
      return /^[a-zA-Z]+$/.test(str)
    case 'chinese':
      return /^[\u4E00-\u9FA5]+$/.test(str)
    case 'lower':
      return /^[a-z]+$/.test(str)
    case 'upper':
      return /^[A-Z]+$/.test(str)
    case 'dateNumber': // /*大于0小于100数字*/
      return /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/.test(str)
    case 'password': // 密码
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/.test(str)
    case 'contact': // 联系方式
      return /(^[0-9]{3,20}$)/.test(str)
    case 'card': // 身份证
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
    case 'money': // 金额验证，保留两位小数
      return /^([1-9]\d{0,8}|0)(\.\d{1,6})?$/.test(str)
    case 'name': // 验证合法的姓名
      return /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(str)
    default:
      return true
  }
}

module.exports = {
  formatTime: formatTime,
  checkType: checkType,
  formatDate: formatDate
}
