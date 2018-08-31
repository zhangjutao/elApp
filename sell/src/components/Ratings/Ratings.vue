<template>
  <div>
      评论详情
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
