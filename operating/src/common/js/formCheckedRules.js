let formCheckedRules = {
    /* 手机号码验证 */
    phoneNumberChecked: (msg) => {
        return (rule, value, callback) => {
            //固定电话号码验证规则
            var reg1 = "^([0-9]{3,4}-)?[0-9]{7,8}$";
            //手机号码验证规则
            var reg2 = "^1[0-9]{10}$";

            if (value) {
                if ((value + '').match(reg1) || (value + '').match(reg2)) {
                    callback();
                } else {
                    callback(msg);
                }
            } else {
                callback();
            }
        }
    },
    //整数验证
    numberChecked: function(rule, value, callback) {
        var reg = '^[1-9][0-9]*$'; //阿拉伯数字验证正则
        if (!value) {
            callback()
        } else {
            if (!(value + '').match(reg)) {
                callback('请输入正整数');
            } else if (value > 2147483647) {
                callback('输入数字过大');
            } else {
                callback()
            }
        }

    },
    //小数验证  保留两位小数
    decimalChecked: (msg) => {
        return (rule, value, callback) => {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!value) {
                callback()
            } else {
                if (!(value + '').match(reg)) {
                    callback(msg);
                } else {
                    callback()
                }
            }
        }
    },
    numberLetterCkecked: (msg) => {
        return (rule, value, callback) => {
            if(!value){
                callback()
                return;
            }
            //字母和数字的组合
            var reg = /[^\w\.\/]/ig;
            if (!value.match(reg)) {
                callback();
            } else {
                callback(msg);
            }
        }
    },

}


export {
    formCheckedRules
}