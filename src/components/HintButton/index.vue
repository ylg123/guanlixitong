<template>
  <a :title="title" style="margin:10px">
    <!-- $attrs：收集父组件传过来的属性  $listeners：收集父组件传过来的自定义事件 -->
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name:'HintButton',
  props:['title']
}
</script>

<style>

</style>