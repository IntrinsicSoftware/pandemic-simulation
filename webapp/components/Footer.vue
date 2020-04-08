<template>
  <footer
    class="footer h-16 text-gray-400 text-center text-xs flex justify-center items-center border-t-2 flex flex-col"
  >
    <a class="pr-1" href="//www.intrinsic.ventures" target="_blank"
      >- INTRINSIC -</a
    >
    <div>&copy; 2020 Intrinsic All Rights Reserved</div>
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
