<template>
  <div class="ratings">
      <div class="ratings-content">
	  </div>
  </div>
</template>
<script>
import {getRatings} from '@/api/api'
export default {
	data () {
		return {
			ratings: {}
		}
	},
	mounted () {
		getRatings().then(res => { this.ratings = res.data })
	}
}
</script>
<style></style>
