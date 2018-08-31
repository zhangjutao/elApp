<template>
<div>
    <transition name="move">
        <div v-show="showFlag" class="food" ref="food">
            <!-- food-content是必须的，better-scroll需要下一级有一个大的div包裹所有需要滑动的div-->
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click="hide">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <cartControl :food="food" @cart-add="emitCartAdd"></cartControl>
                    </div>
                    <transition name="fade">
                        <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst()">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingSelect @ratingtype-select="typeChange" @content-toggle="contentChange" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingSelect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="item-rating">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar">
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.lenght">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</div>
</template>
<script>
import BScroll from 'better-scroll'
import Vue from 'vue'
import cartControl from '../cartControl/cartControl'
import split from '../split/split'
import ratingSelect from '../ratingSelect/ratingSelect'
import {formatDate} from '../../common/js/date'

// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;

export default {
    props: {
        food: {
            type: Object
        }
    },
    data () {
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: false,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    components: {
        cartControl,
        split,
        ratingSelect
    },
    methods: {
        show () {
            this.showFlag = true;
            this.selectType = ALL;
            this.onlyContent = false;
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    })
                } else {
                    this.scroll.refresh();
                }
            });
        },
        hide () {
            this.showFlag = false;
        },
        addFirst () {
            Vue.set(this.food, 'count', 1);
            this.$emit('cart-add', event.target); // 加入购物车div消失会导致获取不到正确位置，小球落点出错。解决办法将加入购物车div消失做成动画，消失有时间延迟。
        },
        emitCartAdd () {
            this.$emit('cart-add', event.target);
        },
        needShow (type, text) {
            if (this.onlyContent && !text) {
                return false;
            }
            if (this.selectType === ALL) {
                return true;
            } else {
                return type === this.selectType;
            }
        },
        typeChange (type) {
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        contentChange (oContent) {
            this.onlyContent = oContent;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        }
    },
    filters: {
        formatDate (time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    }
}
</script>
<style lang='stylus' rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    transition: all 0.3s linear
    &.move-enter, &.move-leave-to
        transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
        transform: translate3d(100%, 0, 0)
    .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
        .back
            position: absolute
            top: 10px
            left: 0
        .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #93999f
    .content
        padding: 18px
        text-align: left
        position:relative
        .title
            line-height: 14px
            font-size: 14px
            font-weight: 700
            margin-bottom: 8px
            color: rgb(7, 17, 27)
        .detail
            margin-bottom: 18px
            line-height: 10px
            font-size: 0
            .sell-count, .rating
                font-size: 10px
                color: rgb(147, 153, 159)
            .sell-count
                margin-right: 12px
        .price
            font-size: 0
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
            bottom: 12px
            right: 12px
        .buy
            position: absolute
            bottom: 18px
            right: 18px
            z-index: 10
            padding: 6px 12px
            height: 24px
            box-sizing: border-box
            border-radius: 12px
            background-color: rgb(0, 160, 220)
            line-height: 12px
            font-size: 10px
            text-align: center
            color: rgb(255, 255, 255)
            transition: all 0.1s
            &.fade-enter, &fade-leave-to
                opacity: 0
    .info
        padding: 18px
        text-align: left
        .title
            line-height: 14px
            font-size: 14px
            font-weight: 700
            color: rgb(7, 17, 27)
            margin-bottom: 6px
        .text
            padding: 0 8px
            line-height: 24px
            font-size: 12px
            font-weight: 200
            color: rgb(77, 85, 93)
            margin: 0
    .rating
        padding-top: 18px
        text-align: left
        .title
            line-height: 14px
            margin-left: 18px
            margin-bottom: 6px
            font-size: 14px
            color: rgb(7, 17, 27)
        .rating-wrapper
            ul
                li
                    list-style-type: none
            padding: 0 18px
            .item-rating
                position: relative
                padding: 16px 0
                border-1px(rgba(7, 17, 27, 0.1))
                .user
                    position: absolute
                    right: 0
                    top: 16px
                    line-height: 12px
                    font-size: 0
                    .name
                        display: inline-block
                        vertical-align: top
                        margin-right: 6px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .avatar
                        border-radius: 50%
                .time
                    margin-bottom: 6px
                    line-height: 12px
                    font-size: 10px
                    color: rgb(147, 153, 159)
                .text
                    margin: 0
                    line-height: 16px
                    font-size: 12px
                    color: rgb(7, 17, 27)
                    .icon-thumb_up,.icon-thumb_down
                        margin-right: 4px
                        line-height: 16px
                        font-size: 12px
                    .icon-thumb_up
                        color: rgb(0, 160, 220)
                    .icon-thumb_down
                        color: rgb(7, 17, 27)
            .no-rating
                padding: 16px 0
                font-size: 12px
                color: rgb(147, 153, 159)
</style>
