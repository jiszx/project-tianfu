<template>
  <div class="page-purchasing-pubic">
    <div v-if="type === 'new'" class="purchasing-type">
      <div class="purchasing-item">
        <div class="purchasing-class">
          <div v-for="(child, index) in listData">
            <span :class="activeName === child.commoTyName?'active':'gray'" @click="chooseSelect(child)">{{child.commoTyName}}</span>
          </div>
        </div>
      </div>
      <div v-if="!listData.length" class="text-center gray">没有更多</div>
    </div>
    <div v-if="type === 'edit'" class="purchasing-info">
      <div class="purchasing-info-title gray fontsize-32">您选择的采购信息是：{{formData.commoTyName}}</div>
      <van-cell-group>
        <van-field
          v-model="formData.procurementName"
          label="信息名称："
          maxlength="30"
          placeholder="请输入信息名称"
          @blur="checkExit('procurementName')"
          :error-message="errorMessage.procurementName"
        />
        <van-field
          v-model="formData.commoNum"
          label="要货数量："
          type="number"
          placeholder="请输入要货数量"
          @blur="checkExit('commoNum')"
          :error-message="errorMessage.commoNum"
        />
        <van-field
          v-model="formData.commoUnit"
          label="单位："
          placeholder="请输入单位"
          @blur="checkExit('commoUnit')"
          :error-message="errorMessage.commoUnit"
        />
        <div class="datepicker-row van-cell">
          <p>
            <span class="inline-block datepick-name">指定产地：</span>
            <span class="inline-block" @click="showAreaDrag">
              <span v-if="!areaData.addrProvinceName" class="inline-block gray">请选择指定产地</span>
              <span v-else  class="inline-block">{{areaData.addrProvinceName+areaData.addrCityName+areaData.addrCountyName}}</span>
              <p v-if="errorMessage.areaPath" class="err-msg">请选择指定产地</p>
            </span>
          </p>
        </div>
        <div class="datepicker-row van-cell">
          <p>
            <span class="inline-block datepick-name">要货时间：</span>
            <span class="inline-block">
              <span v-if="!formData.toStartDate" class="inline-block gray" @click="chooseStartDate">要货时间起</span>
              <span v-else  class="inline-block" @click="chooseStartDate">{{$mUtils.formatDate(formData.toStartDate, 'yyyy-MM-dd')}}</span>
              ~
              <span v-if="!formData.toEndDate" class="inline-block gray" @click="chooseEndDate">要货时间止</span>
              <span v-else  class="inline-block" @click="chooseStartDate">{{$mUtils.formatDate(formData.toEndDate, 'yyyy-MM-dd')}}</span>
              <p v-if="errorMessage.toStartDate || errorMessage.toEndDate" class="err-msg">请选择要货时间</p>
            </span>
          </p>
        </div>
        <van-switch-cell class="transe-cell" v-model="formData.canTrace" title="是否可追溯：" />
        <van-field
          v-model="formData.qualityRequirement"
          label="品质要求："
          type="textarea"
          placeholder="请输入品质要求"
          rows="1"
          autosize
        />
      </van-cell-group>
      <div class="purchasing-pubilc-btn" @click="savePurchas">提交</div>
      <!--行政区域组件-->
      <areaPopup v-model="showBrandDrag" @confirm="areaConfirm"></areaPopup>
      <!-- 时间选择器弹层 -->
      <van-popup v-model="showDatePick" position="bottom" :lazy-render="false">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :formatter="formatter"
          :min-date="minDate"
          @confirm="getDate"
          @cancel="showDatePick=false"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
import { CellGroup, Field, Icon, DatetimePicker, Popup, SwitchCell } from 'vant';
import areaPopup from 'components/area-popup';
export default {
  data() {
    return {
      apiList: '/commodityTypes/list',
      apiSave: '/found/procurements/save',
      type: 'new',
      searchParamsData: {
        page: 1,
        size: 5
      },
      showBrandDrag:false,
      showDatePick:false,
      isDatePick: 1,
      currentDate: new Date(),
      minDate: new Date(),
      formData: {
        toStartDate: '',
        toEndDate: '',
        canTrace: false,
        areaPath: '',
      },
      errorMessage: {
        procurementName: '',
        commoNum: '',
        commoUnit: '',
        areaPath: '',
        toEndDate: '',
        toStartDate: '',
      },
      rules: {
        procurementName: [
          { required: true, message: '请输入信息名称' },
          { maxlength: 30, message: '信息名称不能超过30个字' },
        ],
        commoNum: [
          { required: true, message: '请输入要货数量' },
        ],
        commoUnit: [
          { required: true, message: '请输入单位' },
          { maxlength: 2, message: '单位不能超过2个字' },
        ],
        areaPath: [{ required: true, message: '请选择指定产地' }],
        toStartDate: [{ required: true, message: '请选择到货时间' }],
        toEndDate: [{ required: true, message: '请选择到货时间止' }],
      },
      areaData: {},
      openSelect: false,
      activeName: '全部',
      listData: []
    }
  },
  computed: {
   
  },
  components: {
    'van-cell-group': CellGroup,
    'van-field': Field,
    'van-icon': Icon,
    'van-datetime-picker': DatetimePicker,
    'van-popup': Popup,
    areaPopup,
    'van-switch-cell': SwitchCell
  },
  watch: {
    showBrandDrag(val) {
      if(val==false) {
        this.checkExit('areaPath');
      }
    },
    showDatePick(val) {
      if(val==false) {
        this.checkExit('toStartDate')?this.checkExit('toEndDate'):false;
      }
    }
  },
  created() {
    this.type = this.$route.query.type || 'edit';
    console.log(this.$route.query.commoData)
    if(this.type === 'new') this.getList();
    else {
      this.formData.commoTyId = this.$route.query.commoData.commoTyId;
      this.formData.commoTyName = this.$route.query.commoData.commoTyPathName;
      this.formData.commoTyPath = this.$route.query.commoData.commoTyPath;
    }
  },
  methods: {
    /**
     * 获取列表数据
     */
    getList() {
      this.$axios.get(this.apiList, {commoTyParentId: this.$route.query.commoData.commoTyId}).then(res => {
        this.listData = res.list;
      })
    },
    /**
     * 选择三级菜单
     */
    chooseSelect(data) {
      this.type = 'edit';
      this.formData.commoTyId = data.commoTyId;
      this.formData.commoTyName = data.commoTyPathName;
      this.formData.commoTyPath = data.commoTyPath;
    },
    /**
     * 行政区域弹层控制
     */
    showAreaDrag() {
      this.showBrandDrag = true;
    },
    /**
     * 行政数据获取
     */
    areaConfirm(val){
      this.areaData.addrProvince = val[0] && val[0] != undefined ? val[0].code : '';
      this.areaData.addrProvinceName = val[0] && val[0] != undefined ? val[0].name : '';
      this.areaData.addrCity = val[1] && val[1] != undefined ? val[1].code : '';
      this.areaData.addrCityName = val[1] && val[1] != undefined ? val[1].name : '';
      this.areaData.addrCounty = val[2] && val[2] != undefined ? val[2].code : '';
      this.areaData.addrCountyName = val[2] && val[2] != undefined ? val[2].name : '';
      this.formData.areaCode = val.length && val[val.length-1] != undefined ? val[val.length-1].code : '';
      this.formData.areaName = val.length && val[val.length-1] != undefined ? val[val.length-1].name : '';
      let arr = [];
      val.map(item => {
        if(item && item != undefined)
        arr.push(item.name);
      })
      this.formData.areaPath = arr.length ? arr.join('>') : '';
    },
    /**
     * 处理时间选择器数据格式
     */
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      }
      return value;
    },
    /**
     * 选择时间
     */
    chooseStartDate() {
      this.isDatePick = 1;
      this.showDatePick = true;
      if(this.formData.toStartDate) {
        this.currentDate = this.formData.toStartDate;
        this.minDate = new Date();
      }
    },
    chooseEndDate() {
      this.isDatePick = 2;
      this.showDatePick = true;
      if(this.formData.toEndDate) {
        this.currentDate = this.formData.toEndDate;
        this.minDate = this.formData.toStartDate;
      }
    },
    /**
     * 唤起时间选择器
     */
    getDate() {
      if(this.formData.toStartDate) {
        switch (this.isDatePick) {
          case 1: this.formData.toStartDate = Date.parse(this.currentDate);
            this.minDate = this.currentDate;
            break;
          case 2: this.formData.toEndDate = Date.parse(this.currentDate);
          break;
        }
      } else {
        switch (this.isDatePick) {
          case 1: this.formData.toStartDate = Date.parse(this.currentDate);
            this.minDate = this.currentDate;
            break;
          case 2: this.formData.toStartDate = Date.parse(this.currentDate);
          break;
        }
      }
      this.showDatePick = false;
    },
    /**
     * 表单校验
     */
    checkExit(name) {
      let rules = this.rules[name];
      for(let i = 0; i < rules.length; i++) {
        typeof this.formData[name] == 'string' ? this.formData[name] = this.trimStr(this.formData[name]): ''
        if(rules[i].required) {
          if(!this.formData[name]) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
          else this.errorMessage[name] = '';
        }
        if(rules[i].maxlength) {
          if(this.formData[name].length > rules[i].maxlength) {
            this.errorMessage[name] = rules[i].message;
            return false
          }
          else this.errorMessage[name] = '';
        }
      }
      return true
    },
    /**
     * 提交采购需求
     */
    savePurchas() {
      let flag = true;
      for(let i in this.errorMessage) {
        if(!this.checkExit(i)) {
          flag = false;
        }
      }
      if(!flag) {
        this.$toast('请完善表单');
        return
      }
      let saveData = {...this.formData}
      saveData.canTrace = saveData.canTrace? 1 : 0;
      this.$axios.post(this.apiSave, saveData).then(res => {
        this.$router.replace({name: '发布成功', query: {data: res.procurementId}})
      })
    },
    /**
     * 去前后空格
     */
    trimStr(str) {
      return str?str.replace(/(^\s*)|(\s*$)/g,""):'';
    }
  }
}
</script>

<style lang="scss" scoped>
.purchasing-type {
  .purchasing-item {
    padding: 0.5rem 0 0 0.3rem;
    .purchasing-class{
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      div {
        text-align: left;
        width: 25%;
        margin-top: 14px;
      }
    }
    span {
      padding: 5px 0 6px;
      width: 88%;
      text-align: center;
      border: 1px solid rgba(212, 212, 212, 1);
      background: #fff;
      border-radius: 7px;
      display: inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .active {
      background: #34C975;
      color: #fff;
      border: none;
    }
  }
  .trainning-class {
    margin-top: 10px;
    padding: 0.32rem;
    background: #fff;
    p {
      font-size: 0.3rem;
      margin-bottom: 0.3rem;
    }
    img {
      width: 100%;
      max-height: 340px;
    }
  }
}
.purchasing-info {
  .purchasing-info-title {
    padding: 0.3rem;
  }
  .datepick-name {
    color: #333;
    max-width: 90px;
    width: 90px;
  }
}
.datepicker-row>p {
  display: flex;
  .err-msg {
    font-size: 12px;
    color: #f44;
  }
}
.transe-cell::after  {
  display: initial!important;
}
.purchasing-pubilc-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.3rem;
  color: #fff;
  background: #34C975;
  text-align: center;
}
</style>
<style lang="scss">
.purchasing-info {
  .van-popup--bottom {
    top: auto!important;
  }
}
</style>

