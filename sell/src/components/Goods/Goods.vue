<template>
	<div class="goods">
    <div class="menu-wrapper" ref="menuwrapper">
			<ul>
				<li v-for="(item,menuindex) in goods" :key="menuindex" class="menu-item" :class="{'current': currentIndex === menuindex}" @click="selectMenu(menuindex)">
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodswrapper">
			<ul>
				<li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="(food,foodindex) in item.foods" :key="foodindex" class="food-item border-1px" @click="selectFood(food)">
							<div class="icon">
								<img width="57" height="57" :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="description">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartControl :food="food" @cart-add="cartAdd"></cartControl>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopCart ref="shopcart" @cart-add2="cartAdd" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopCart>
		<Food :food="selectedFood" ref="food" @cart-add="cartAdd"></Food>
	</div>
</template>
<script>
import {getGoods} from '@/api/api'
import BScroll from 'better-scroll'
import shopCart from '../shopCart/shopCart'
import cartControl from '../cartControl/cartControl'
import Food from '../food/food'

export default {
	props: {
		seller: {
			type: Object
		}
	},
	data () {
		return {
			goods: [],
			listHeight: [],
			scrollY: 0,
			selectedFood: {}
		}
	},
	components: {
		shopCart,
		cartControl,
		Food
	},
	mounted () {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		getGoods().then(res => {
			this.goods = res.data;
			this.$nextTick(() => {
					this._initScroll();
					this._calculateHeight();
			});
		})
	},
	computed: {
		currentIndex () {
			for (let i = 0; i < this.listHeight.length; i++) {
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i + 1];
				if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
					return i;
				}
			}
			return 0;
		},
		selectFoods () {
			let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
	},
	methods: {
		_initScroll () {
			this.menuScroll = new BScroll(this.$refs.menuwrapper, {
				click: true
			});
			this.foodsScroll = new BScroll(this.$refs.foodswrapper, {
				click: true,
				probeType: 3
			});

			this.foodsScroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(Math.round(pos.y));
			})
		},
		_calculateHeight () {
			let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			for (let i = 0; i < foodList.length; i++) {
				let item = foodList[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}
		},
		selectMenu (index) {
			let foodList = this.$refs.foodswrapper.getElementsByClassName('food-list-hook');
			let el = foodList[index];
			this.foodsScroll.scrollToElement(el, 300);
		},
		cartAdd (el) {
			this.$nextTick(() => {
				this.$refs.shopcart.drop(el);
			});
		},
		selectFood (food) {
			this.selectedFood = food;
			this.$refs.food.show();
		}
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 46px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				display: table
				height: 54px
				width: 56px
				line-height: 14px
				padding: 0 12px
				&.current
					position: relative
					margin-top: -1px
					z-index: 10
					background: #fff
					font-weight: 700
					.text
						border: none
				.icon
					display: inline-block
					vertical-align: middle
					width: 12px
					height: 12px
					margin-right: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					border-1px(rgba(7, 17, 27, 0.1))
					font-size: 12px
		.foods-wrapper
			flex: 1
			text-align: left
			ul
				list-style-type:none
			.title
				text-align: left
				padding-left: 14px
				height: 26px
				line-height: 26px
				font-size: 12px
				color: rgb(147, 153, 159)
				border-left: 2px solid #d9dde1
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.description, .extra
						font-size: 10px
						line-height: 10px
						color: rgb(147, 153, 159)
					.description
						margin-bottom: 8px
					.extra
						font-size: 0
						span
							font-size: 10px
							line-height: 10px
							color: rgb(147, 153, 159)
						.count
							margin-right: 12px
					.price
						font-size: 0
						margin-bottom: 18px
						font-weight: 700
						.now
							margin-right: 8px
							font-size: 14px
							line-height: 24px
							color: rgb(240, 20, 20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147, 153, 159)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 12px
</style>
