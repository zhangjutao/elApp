<template>
  <div id="app">
    <Header :seller="seller"></Header>
    <div class="tab">
      <div class="tab-item border-1px">
				<router-link to='/goods'>商品</router-link>
			</div>
			<div class="tab-item">
				<router-link to='/ratings'>评论</router-link>
			</div>
			<div class="tab-item">
				<router-link to='/sellers'>商家</router-link>
			</div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import Header from './components/header/header'
import {getSellers} from '@/api/api'

export default {
	name: 'App',
	data () {
		return {
			seller: {}
		}
	},
	components: {
		Header
	},
	created () {
		getSellers().then(res => { this.seller = res.data; console.log(res.data) })
	}
}
</script>

<style lang="stylus" rel="text/stylus">
@import "./common/stylus/mixin.styl"
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

#app
	.tab
		display: flex
		width: 100%
		height: 40px
		line-height: 40px
		border-1px(rgba(7, 17, 27, 0.1))
		.tab-item
			flex: 1
			text-align: center
			& > a
				display: block
				font-size: 14px
				color: rgb(77, 85, 93)
				text-decoration: none;
				&.router-link-active
					color: rgb(240, 20, 20)
					text-decoration: none;\
</style>
