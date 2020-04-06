<template>
  <footer
    class="footer bg-black text-gray-400 h-12 text-center text-xs flex justify-center items-center"
  >
    <a class="pr-1" href="https://www.intrinsic.ventures" target="_blank"
      >- INTRINSIC -</a
    >
    <div>&copy; 2015 - 2020 Intrinsic All Rights Reserved</div>
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
}
</style>
