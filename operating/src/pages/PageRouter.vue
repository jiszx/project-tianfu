<template>
  <div>
    <transition name="fade" mode="out-in">
      <router-view class="subpage" ></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowBread: false
    }
  },
  created () {},
  components: {
  },

  methods: {}
}
</script>

<style scoped>

</style>
