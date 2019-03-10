<template>
	<view class="page">
		<!-- #ifdef H5 -->
		<view @click="through" style="z-index: 9999;color: red;position: fixed;top: 0;">
			待领取
		</view>
		<!-- #endif -->
		<view class="prize_content">
			<view class="prize_item" v-for="(gift,index) in list"  :key='index'>
				<view class="detailBox">
					<view style="display: flex;align-items: center;">{{ gift.giftName }}</view>
					<view style="display: flex;align-items: center;color: #999999;font-size: 24upx;margin-top: 10upx;">{{ gift.time }}</view>
				</view>
				<view class="show_type"  style="color:rgba(34,34,34,1);font-size: 30upx;">{{gift.state==0?"未领取":"已领取"}}</view>
			</view>
		</view>

		<uni-load-more :loading-type="loadingType"></uni-load-more>

		<status-page :status="dataStatus" @retry="retry"></status-page>

	</view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";

    import loadMoreMixins from '@/js/mixins/loadMoreMixins';
    import UniLoadMore from "../../../components/uni-load-more";
    import StatusPage from "../../../components/StatusPage";

    export default {
        components: {NavigationBar, StatusPage, UniLoadMore},
        data() {
            return {
                list: [],
            };
        },

        mixins: [loadMoreMixins],

        mounted () {
            this.moreLoading = true;
            this.fetch();
        },
		onNavigationBarButtonTap () {
		 //待领取 
		 this.through();
		},
        methods:{
			through(){
				 //待领取 
				this.navigateTo('/pages/task/zhuanpan/toReceivePrize')
			},
            fetch (){
                this.$api.myGifts(this.currentPage,1).then(result =>{
                    if (this.currentPage === 0) {
                        this.list = [];
                    }
                    result.list.forEach(item => {
                        item.time = this.formatDate(item.time, 'MM/DD HH:mm:ss')
                    })
                    this.loadMoreSuccessHandle(result.list);
                    this.list = this.list.concat(result.list);
                })
            }
			
				
        }
    }
</script>

<style scoped>
	.page{
		width: 100%;
		min-height: 100vh;
		overflow-x: hidden;
		border-top: 2upx solid #F2F2F2;
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
		align-items:center;
	}
</style>
