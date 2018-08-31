<template>
  <div>
      商家详情
  </div>
</template>
<script>
import {getSellers} from '@/api/api'
export default {
	data () {
		return {
			seller: {}
		}
	},
	mounted () {
		getSellers().then(res => { this.seller = res.data })
	}
}
</script>
<style></style>
