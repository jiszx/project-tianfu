//area-popup.js
import {
  getData
} from '../../utils/api.js'
Component({
  properties: {
    //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden
    showBrandDrag: {
      type: Boolean
    },
    type: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    }
  },
  data: {
    // 这里是一些组件内部数据
    api_get_data: '/administrativeAreas/list',
    show: false,
    loading: false,
    alreadyExistIds: [],
    province: [],
    city: [],
    county: [],
    areaList: ''
  },
  ready() {
    this.onshow();
  },
  methods: {
    // 这里是一个自定义方法
    onshow: function () {
      if (this.data.showBrandDrag)
        this.setData({
          show: true
        });
      this.getAreaData('-1', 'province');
    },
    confirm(val) { //子传父
      // console.log('触发子组件', val.detail) 
      this.setData({
        show: false
      })
      // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
      this.triggerEvent('confirm', val.detail.detail);
    },
    cancelFn() {
      this.setData({
        show: false
      })
    },
    getAreaData(id, type) {
      if (this.data.alreadyExistIds.indexOf(id) >= 0) {
        return;
      } else {
        this.data.alreadyExistIds.push(id);
      }
      this.loading = true;
      let params = {areaCode: id};
      var _this = this;
      getData(this.data.api_get_data, params,
        function(res){
          res = res.data.list || [];
          let temp_res = [...res];
          _this.data.loading = false;
          if (type === 'province') {
            if (_this.data.type && _this.data.type == 'customer') {
              _this.data.province = [...temp_res];
            } else
            _this.data.province = [{
              areaCode: '0',
              areaId: 0,
              areaLevel: 1,
              areaParentCode: '-1',
              areaPath: '全国',
              areaName: '全国',
              children: [],
              leaf: true
            }, ...temp_res];
            if (_this.data.province.length) {
              _this.getAreaData(_this.data.province[0].areaCode, 'city')
            }
          } else if (type === 'city') {
            _this.data.city = [..._this.data.city, ...temp_res]
            if (temp_res.length) {
              _this.getAreaData(temp_res[0].areaCode, 'county')
            }
          } else {
            _this.data.county = [..._this.data.county, ...temp_res]
          }
          _this.getAreaList();
        },
        function(err){
          _this.data.loading = false;
          console.log(err)  
        }
      )
    },
    change(val) {
      //console.log(val.detail.values,'val.detail.values');
      let list = val.detail.values;
      if (list[0]) {
        this.getAreaData(list[0].code, 'city')
      }
      if (list[1]) {
        this.getAreaData(list[1].code, 'county')
      }
    },
    getAreaList() {
      let province = {};
      let city = {};
      let county = {};
      for (let i = 0, len = this.data.province.length; i < len; i++) {
        province[this.data.province[i].areaCode] = this.data.province[i].areaName;
      }
      for (let i = 0, len = this.data.city.length; i < len; i++) {
        city[this.data.city[i].areaCode] = this.data.city[i].areaName;
      }
      for (let i = 0, len = this.data.county.length; i < len; i++) {
        county[this.data.county[i].areaCode] = this.data.county[i].areaName;
      }
      let areaData = {
        province_list: { ...province
        },
        city_list: { ...city
        },
        county_list: { ...county
        }
      }
      this.setData({
        areaList: areaData
      })
    }
  }
})