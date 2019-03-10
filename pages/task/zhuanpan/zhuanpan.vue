<template>
    <view class="page">
        <view class="page-content">
            <image src="../../../static/images/task/zhuanpan_bg.png" mode="" class="zhuanpan_bg"></image>
            <view class="container">
                <view class="z_title">抽奖赢缤纷好礼</view>
                <view class="z_remaining_times">剩余次数：{{lastCount}}次</view>
                <view class="yuanpan">
                    <image :src="deng_url" mode="" class="z_deng"></image>
                    <image :src="active_deng_url" mode="" class="z_deng_active" v-if="showGif"></image>
                    <image :src="img_url" mode="" class="z_content" v-bind:style="has_transition" v-bind:class="[hasT?'has_transition':'']"></image>
                    <image :src="pointer_url" mode="" class="z_pointer"  @click="playGames"></image>
                    <canvas canvas-id="firstC" class="shadow"  v-bind:style="has_transition"></canvas>
                </view>
                <list :lists='lists' :animate='animate'></list>
            </view>

            <prizing :current_gift_item='current_gift_item' :showPrizingToast="showPrizingToast" @hide='hide'></prizing>
        </view>

    </view>

</template>

<script>
    import list from './list.vue';
    import prizing from './prizing.vue';
    import api from '../../../js/api/module/task.js';
    import format from 'date-fns/format'
    import NavigationBar from "../../../components/NavigationBar";
    import store from '../../../js/store.js';
    export default {
        data() {
            return {
                img_url: '../../../static/images/task/z_content.png', //奖品圆盘主图
                deng_url:'../../../static/images/task/z_deng.png',//跑马灯静态图
                active_deng_url:'../../../static/images/task/z_deng_active.gif',//跑马灯动态图
                pointer_url: '../../../static/images/task/z_pointer.png', //指针图片
                prize_num: 8, //圆盘内奖品数量
                c_num: 2, //当前抽中的下标
                can_press:true,//按钮是否可点击的标志
                base_rotate: 720, //基础转动的角度
                rotateDeg: 0, //需要旋转的角度
                hasT: true, //是否有渐变效果
                proportion: 1, //换算比例
                w:0,//canvas画布一半的宽度
                pointer_anim:false,//控制按钮是否有放大效果的
                timer:'',//定时器
                animate:false,//控制跑马灯是否有动画
                showGif:false,//控制转盘外圈跑马灯的显隐
                lists:[],//中奖名单\
                prize_type:2,
                turntableSectorModels:[],//奖品数组
                lastCount: 0,//剩余抽奖次数
                current_gift_item:{
// 					giftName:'5积分',
// 					giftType:3
                },//当前抽中的奖品
                showPrizingToast:false,
            };
        },
        components:{
            NavigationBar,
            list,
            prizing
        },
        computed: {
            has_transition() {
                return 'transform : rotate(' + this.rotateDeg + 'deg)';
            }
			
        },
        onReady(e) {
            const winw = uni.canIUse('getSystemInfoSync.return.windowWidth') ? uni.getSystemInfoSync().windowWidth : 375;
            this.w = winw*245/750;
            this.ctx = uni.createCanvasContext('firstC');
        },
        onShow() {
            this.getTurntableInfo();
        },
        onHide() {
            clearInterval(this.timer);
        },
        methods: {
            // 获取获奖列表
            getTurntableInfo(){
                uni.showLoading();
                api.getTurntableInfo().then(res=>{
					console.info(res)
                    for(let k in res.userGiftModels){
                        res.userGiftModels[k].time = format(res.userGiftModels[k].createTime,'HH:mm:ss');
                    }
                    if(res.userGiftModels.length>6){
                        // 获奖列表超过6个才出现跑马灯
                        let timer = setInterval(this.scroll,1000);
                        this.timer = timer;
                    }
					this.lastCount = res.playCount;
					this.turntableSectorModels = res.turntableSectorModels;
					this.lists = res.userGiftModels;
                    uni.hideLoading();
                }).catch((err) => {
                    uni.hideLoading();
										if (err.code !== '1005') {
												this.showToast(err.message ? err.message : '未知错误');
										}
                });
            },


            //绘画扇形阴影
            ctx_arc() {
                let every_deg = (Math.PI*2) / this.prize_num,
                    start_angle = -(Math.PI/2) - Math.PI/this.prize_num,
                    end_angle = -(Math.PI/2) + (Math.PI/this.prize_num);//因为远点是从水平向右的角度算起，要像图中指针按照垂直向上算得-90deg;
                start_angle += (this.c_num-1)*every_deg;
                end_angle += (this.c_num-1)*every_deg;
                this.ctx.beginPath();
                this.ctx.translate(this.w, this.w);
                this.ctx.moveTo(0, 0);
                this.ctx.arc(0, 0,this.w, start_angle, end_angle);
                this.ctx.closePath();
                this.ctx.setFillStyle('rgba(251,176,59,0.3)');
                this.ctx.fill();
                this.ctx.draw();
            },
            //清除画布内容
            clear_ctx(){
                if(this.ctx){
                    this.ctx.clearRect(-100, -100, 2*this.w, 2*this.w);
                    this.ctx.draw();
                    this.current_gift_item = {};
                }
            },
            playGames(){
                if(this.lastCount<=0){
                    this.showToast('今日次数已经用完');
                    return;
                }
                if(!this.can_press){
                    // this.showToast('正在抽奖中');
                    return;
                }
                uni.showLoading();
                this.can_press = false;//不允许用户连续点击
                this.rotateDeg = 0;//旋转的角度归零
                this.clear_ctx();//清除画布里面的扇形
                api.playGames().then((res)=>{
                    this.lastCount = res.lastCount;
                    uni.hideLoading();
                    for(let k in this.turntableSectorModels){
                        if(res.giftId == this.turntableSectorModels[k].giftId){
                            this.current_gift_item = this.turntableSectorModels[k];
                            this.lists.push({
                                createTime:new Date().getTime(),
                                time: format(new Date().getTime(),'HH:mm:ss'),
                                nickName:store.getUser().nickName,
                                giftName:this.turntableSectorModels[k].giftName
                            })
                            this.c_num = Number(k) + 1;
                            // 显示动态跑马灯
                            this.showGif = true;
                            this.prizing();
                            break;
                        }
                    }
                }).catch((err) => {
                    uni.hideLoading();
                    this.can_press = true;//按钮恢复可点击状态
										if (err.code != '1005') {
											this.showToast(err.message?err.message:'未知错误');
										}
                });
            },
            prizing() {
                // this.pointer_anim = true;//抽奖点击之后放大的触发标志

                this.handel_rotate();
                let timer_can_press = setTimeout(()=>{
                    this.can_press = true;//用户可以点击
                    this.hasT = false;//转盘是否旋转的标记
                    this.ctx_arc();
                    this.showPrizingToast = true;
                    this.showGif = false;
                    // this.pointer_anim = false;//抽奖点击之后放大的触发标志
                    clearTimeout(timer_can_press);
                },5000)
            },
            handel_rotate() {
                this.hasT = true;
                let every_deg = 360 / this.prize_num,
                    range = Math.random(),
                    deg = 0,
                    proportion = range<0.2 ? 0.2 : range>0.8 ? 0.8 : range,
                    offset_deg = every_deg * proportion;
                deg = (this.prize_num - this.c_num + 0.5) * every_deg + offset_deg;
                this.rotateDeg = this.base_rotate + deg;
            },
            // 跑马灯滚动效果
            scroll(){
                this.animate=true;
                let timeout = setTimeout(()=>{
                    this.lists.push(this.lists.shift());
                    this.animate=false;
                    clearTimeout(timeout);
                },500)
            },
            hide(){
                this.showPrizingToast = false;
            }
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: scroll;
        position: relative;
    }
    .page-content {
        position: relative;
    }
    .zhuanpan_bg {
        /* width: 750upx; */
        width: 100vw;
        height: 1710upx;
        position: absolute;
        z-index: 1;
    }
    .container {
        width: 100%;
        height: 1710upx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        overflow: hidden;
    }
    .z_title {
        font-size: 63upx;
        width: 100%;
        text-align: center;
        line-height: 60upx;
        color: #FFFFFF;
        margin-top: 94upx;
    }
    .z_remaining_times {
        width: 240upx;
        height: 60upx;
        border: 1upx solid rgba(201, 166, 117, 1);
        border-radius: 30upx;
        text-align: center;
        line-height: 60upx;
        margin: 64upx auto 0;
        color: rgba(201, 166, 117, 1);
        font-size: 24upx;
    }
    .yuanpan {
        width: 610upx;
        height: 610upx;
        margin: 81upx auto 0;
        position: relative;
    }
    .z_deng{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        width: 610upx;
        height: 610upx;
    }
    .z_deng_active{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 4;
        width: 610upx;
        height: 610upx;
    }
    .z_content {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        width: 610upx;
        height: 610upx;
    }
    .z_pointer {
        width: 610upx;
        height: 610upx;
        position: absolute;
        z-index: 7;
        /* top:50%;
        left: 50%;
        margin: -65upx -65upx 0 0;*/
        top: 0upx;
        left: 0upx;
        transition: all 1s;
        -moz-transition: all 1s;
        -webkit-transition:all 1s;
        -o-transition: all 1s;
    }
    .has_transition {
        transition: all 5s;
    }
    .shadow {
        width: 490upx;
        height: 490upx;
        position: absolute;
        top: 60upx;
        left: 60upx;
        z-index: 6;
    }
    /* .pointer_animC{
        animation: pointer_animate 0.8s;

    }
    @keyframes pointer_animate{
        0%{
            transform:scale(1);
        }
        25%{
            transform:scale(0.95);
        }
        50%{
            transform:scale(1);
        }
        75%{
            transform:scale(1.05);
        }
        100%{
            transform:scale(1);
        }
    } */
</style>
