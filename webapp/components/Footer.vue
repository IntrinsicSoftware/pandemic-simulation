<template>
  <footer
    class="flex flex-col items-center justify-center h-16 text-xs text-center text-gray-400 border-t-2 footer"
  >
    <a class="pr-1" href="//www.intrinsic.ventures" target="_blank"
      >⸺ INTRINSIC ⸺</a
    >
    <div>&copy; 2021 Intrinsic All Rights Reserved</div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component<Footer>({})
export default class Footer extends Vue {}
</script>
<style>
.footer {
  background: #0a0a0a;
  border-color: #262626;
}
</style>
