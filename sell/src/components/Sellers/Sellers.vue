<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<Star :size="36" :score="seller.score"></Star>
					<span class="text">({{seller.ratingCount}})</span>
					<span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2>平均送配时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>元
						</div>
					</li>
				</ul>
			</div>
			<Split></Split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<ul v-if="seller.supports" class="supports">
					<li v-for="(item,index) in seller.supports" :key="index" class="support-item border-1px">
						<span class="icon" :class="classMap[item.type]"></span>
						<span class="text">{{item.description}}</span>
					</li>
				</ul>
			</div>
			<Split></Split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picwrapper">
					<ul class="pic-list" ref="piclist">
						<li class="pic-item"  v-for="(pic,index) in seller.pics" :key="index">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<Split></Split>
			<div class="info">
				<h1 class="title">商家信息</h1>
				<ul>
					<li class="info-item" v-for="(info,index) in seller.infos" :key="index">{{info}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import {getSellers} from '@/api/api'
import Star from '../Star/Star'
import Split from '../split/split'
import BScroll from 'better-scroll'
export default {
	props: {
	},
	components: {
		Star,
		Split
	},
	data () {
		return {
			seller: {}
		}
	},
	mounted () {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		getSellers().then(res => {
			this.seller = res.data;
			this.$nextTick(() => {
				this._initScroll();
				this._initPics();
			})
		})
	},
	methods: {
		_initScroll () {
			if (!this.scroll) {
				this.scroll = new BScroll(this.$refs.seller, {
					click: true
				});
			} else {
				this.scroll.refresh();
			}
		},
		_initPics () {
			if (this.seller.pics) {
				let picWidth = 120;
				let margin = 6;
				let width = (picWidth + margin) * this.seller.pics.length - margin;
				this.$refs.piclist.style.width = width + 'px';
				this.$nextTick(() => {
					this.picScorll = new BScroll(this.$refs.picwrapper, {
						scrollX: true,
						eventPassthrough: 'vertical'
					})
				})
			} else {
				this.picScorll.refresh();
			}
		}
	}
}
</script>
<style lang="stylus" type="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
.seller
	text-align: left
	position: absolute
	top: 174px
	bottom: 0
	left: 0
	width: 100%
	overflow: hidden
	.overview
		padding: 18px
		.title
			line-height: 14px
			font-size: 14px
			color: rgb(7, 17, 27)
			margin-bottom: 8px
		.desc
			padding-bottom: 18px
			border-1px(rgba(7, 17, 27, 0.1))
			font-szie: 0
			.star
				display: inline-block
				vertical-align: top
				margin-right: 8px
			.text
				display: inline-block
				vertical-align: top
				margin-right: 12px
				line-height: 18px
				font-size: 10px
				color: rgb(77, 85, 93)
		.remark
			display: flex
			padding: 18px 0 0 0
			li
				list-style: none
			.block
				flex: 1
				text-align: center
				border-right: 1px solid rgba(7, 17, 27, 0.1)
				&:last-child
					border: none
				h2
					margin-bottom: 4px
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
				.content
					line-height: 24px
					font-size: 10px
					color: rgb(7, 17, 27)
					.stress
						font-size: 24px
	.bulletin
		padding: 18px 18px 0 18px
		.title
			margin-bottom: 8px
			line-height: 14px
			color: rgb(7, 17, 27)
			font-size: 14px
		.content-wrapper
			padding: 0 12px 16px 12px
			border-1px(rgba(7, 17, 27, 0.1))
			.content
				line-height: 24px
				font-size: 12px
				font-weight: 200
				color: rgb(240, 20, 20)
				margin: 0
		.supports
			.support-item
				list-style: none
				padding: 16px 12px;
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none()
				.icon
					display: inline-block
					vertical-align: middle
					width: 12px
					height: 12px
					margin-right: 6px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_4')
					&.discount
						bg-image('discount_4')
					&.guarantee
						bg-image('guarantee_4')
					&.invoice
						bg-image('invoice_4')
					&.special
						bg-image('special_4')
				.text
					line-heigth: 16px
					width: 56px
					vertical-align: middle
					font-size: 12px
					font-weight: 200
					color: rgb(7, 17, 27)
	.pics
		padding: 18px
		ul
			li
				list-style: none
				display: inline
		.title
			margin-bottom: 12px
			line-height: 14px
			font-size: 14px
			color: rgb(7, 17, 27)
		.pic-wrapper
			width: 100%
			overflow: hidden
			white-space: nowrap
			.pic-list
				font-size: 0
				.pic-item
					display: inline-block
					margin-right: 6px
					width: 120px
					height: 90px
					&.last-child
						margin-right: 0
	.info
		padding: 18px 18px 0 18px
		ul
			li
				list-style: none
		.title
			margin-bottom: 12px
			line-height: 14px
			font-size: 14px
			color: #07111b
		.info-item
			padding: 16px 12px
			border-right: 1px solid rgba(7, 17, 27, 0.1)
			line-height: 16px
			font-size: 12px
			font-weight: 200
			color: rgb(7, 17, 27)
</style>
