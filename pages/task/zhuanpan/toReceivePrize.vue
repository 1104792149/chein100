<template>
	<view class="page">
		<!-- #ifdef H5 -->
		<view @click="aa" style="z-index: 9999;color: red;position: fixed;top: 0;">
			地址
		</view>
		<!-- #endif -->
		<view class="prize_content">
			<view class="prize_item" v-for="(gift,index) in list"  :key='index'>
				<view class="detailBox">
					<view class="detailBox-left" @click="selectTap(index)">
						<image v-if="gift.status" src='../../../static/images/task/yes2x.png'></image>
						<image v-else src='../../../static/images/task/no2x.png'></image>
					</view>
					<view class="detailBox-rigth">
						<view style="display: flex;align-items: center;">{{ gift.giftName }}</view>
						<view style="display: flex;align-items: center;color: #999999;font-size: 24upx;margin-top: 10upx;">{{ gift.time }}</view>
					</view>
				</view>
				<view class="show_type"  style="color:rgba(34,34,34,1);font-size: 30upx;">待领取</view>
			</view>
		</view>


		<view class="button-select">
			<view class="button-select-left">
				<image @click="selectArrTap" v-if="selectArr" src='../../../static/images/task/yes2x.png'></image>
				<image @click="selectArrTap" v-else src='../../../static/images/task/no2x.png'></image>
				<text>全选</text>
			</view>
			<view class="button-select-center">
				<text>合计:</text>
				<text>{{selectItem.length}}</text>
				<text>件</text>
			</view>
			<view class="button-select-rigth">
				<button @click="is_logout" :disabled="selectItem.length==0" class="btn-primary">
					去领取
				</button>
			</view>
		</view>
			
		<uni-load-more :loading-type="loadingType"></uni-load-more>
		 <alert-dialog ref="dialog" @confirm="onConfirm"></alert-dialog>
		<status-page :status="dataStatus" @retry="retry"></status-page>

	</view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";
    import loadMoreMixins from '@/js/mixins/loadMoreMixins';
	import store from '@/js/store'
    import UniLoadMore from "../../../components/uni-load-more";
    import StatusPage from "../../../components/StatusPage";
	import AlertDialog from "../../../components/AlertDialog";
    export default {
        components: {NavigationBar, StatusPage, UniLoadMore,AlertDialog},
        data() {
            return {
                list: [],
            };
        },
        mixins: [loadMoreMixins],
		computed:{
			//已选择的数量
			selectItem(){
				var yes=this.list.filter(o=>o.status==true);
				return yes
			},
			//是否已全选
			selectArr(){
				if((this.selectItem.length==this.list.length)&&(this.list.length>0)){
					return true
				}else{
					return false
				}
			}
		},
        mounted () {
			
			
        },
		onShow() {
			//是否允许刷新当前页面
			
				this.moreLoading = true;
				this.currentPage=0;
				this.list=[];
				this.fetch();
			
			
		},
		onNavigationBarButtonTap () {
			 //地址列表
			 this.navigateTo('/pages/task/zhuanpan/address')
		},
        methods:{
			aa(){
				 //地址列表
				this.navigateTo('/pages/task/zhuanpan/address')
			},
            fetch (){
                this.$api.myGifts(this.currentPage,0).then(result =>{
					console.info(result)
                    if (this.currentPage === 0) {
                        this.list = [];
                    }
                    result.list.forEach(item => {
                        item.time = this.formatDate(item.time, 'MM/DD HH:mm:ss');
						item.status = false;
                    })
                    this.loadMoreSuccessHandle(result.list);
                    this.list = this.list.concat(result.list);
                })
            },
			
			//选择事件
			selectTap(index){
				console.info(index)
				 this.list[index].status=! this.list[index].status;
				 
			},
			//全选或反选
			selectArrTap(){
				if(this.list.length==0){
					return false;
				}
				if(this.selectArr){
					this.list.forEach(item => {
						item.status = false;
					})
				}else{
					this.list.forEach(item => {
						item.status = true;
					})
				}
			},
			//去领取事件
			cashingTap(){
				 var data=JSON.stringify(this.selectItem);
				 console.info(data)
				 uni.navigateTo({
				 	url: '/pages/task/zhuanpan/confirmToReceivePrize?data='+data,
				 	
				 });
			},
			 is_logout () {
				 if(this.selectItem.length>1){
					this.cashingTap();
				 }else{
					this.$refs.dialog.show({
					     title: '提示',
					     message: '单件提货邮费到付，两件及以上包邮',
					     confirmButtonText: '确认',
					     cancelButtonText: '取消',
					 })
				 }
			    
			},
			onConfirm(){
				 this.cashingTap();
			}	
        }
    }
</script>

<style scoped>
	.page{
		width: 100%;
		min-height: 100vh;
		overflow-x: hidden;
		padding-bottom: 230upx;
	}
	.prize_content{
		width: 690upx;
		margin: 0 auto;
	}
	.prize_item{
		width: 690upx;
		height: 157upx;
		align-items:center;
		border-bottom: 2upx solid #F2F2F2;
		color: #1E1E1E;
		font-size: 30upx;
		justify-content: space-between;
		display: flex;
	}
	.detailBox{
		display: flex;
		flex-direction: row;
		align-items:center;
	}
	.detailBox-left image{
		height: 46upx;
		width: 46upx;
	}
	.detailBox-rigth{
		align-items:center;
		padding-left: 20upx;
	}
	/* 底部选择 */
	.button-select{
		display: flex;
		flex-direction: row;
		align-items:center;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		width: 100vw;
		padding: 30upx 0;
		border-top: #EBEBEB 1upx solid;
		
	}
	.button-select-left{
		padding-left: 30upx;
		color: #1E1E1E;
		font-size: 30upx;
		display: flex;
		flex-direction: row;
		align-items:center;
	}
	.button-select-left image{
		height: 46upx;
		width: 46upx;
		padding-right: 24upx;
	}
	.button-select-center{
		color: #999999;
		font-size: 30upx;
	}
	.button-select-rigth {
		padding-right: 30upx;
	}
	.button-select-rigth button{
		height: 68upx;
		width: 196upx;
		border-radius: 68upx;
		line-height: 68upx;
		font-size: 36upx;
		text-align: center;
		color: #6F4F2B;
	}
</style>
