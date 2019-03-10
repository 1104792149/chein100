<template>
	<view class="page" >
    <!-- 顶部导航 -->
    <navigation-bar title="我的钱包" transparent black>
        <span @click="openWalletDetails" class="WalletDetails">明细</span>
    </navigation-bar>

		<view class="top" >
            <image class="wallet-bg" src="../../../static/mine/wallet/MyWallet@2x.png"></image>
            <view class="info-row">
				<view @click="sxTap" class="label" style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
					<text>总资产（BTA）</text> 
					<label style="display: flex;flex-direction: row;align-items: center;">
						<image style="width: 34upx;height: 26upx;"  src="../../../static/mine/sx.png"></image>
						<text style="padding: 0 30upx 0 14upx;">刷新资产</text>
					</label> 
				</view>
                <view class="value">{{ BTA }}</view>
            </view>
            <view class="info-row">
                <view class="label">总积分</view>
                <view class="value">{{ INTEGRAL }}</view>
            </view>
		
        <view class="payAndget">
            <view class="get" @click="openRecharge">
                <image src="../../../static/mine/wallet/wallet_get.png" class="payAndgetImg"></image>
                <text class="payAndgetText">转入</text>
            </view>
            <view class="mediumLine"></view>
            <view class="pay"  @click="open_new">
                <image src="../../../static/mine/wallet/wallet_pay.png" class="payAndgetImg"></image>
                <text class="payAndgetText">转出</text>
            </view>
        </view>
		</view>
		
		
        <view class="instructions" @click="openState">查看钱包说明</view>

	</view>
</template>

<script>
import NavigationBar from "../../../components/NavigationBar";
	export default {
		components: {NavigationBar},
		data() {
			return {
				BTA:"--",
				INTEGRAL:"--",
				ADDRESS:'',
				preventStatus:false
			}
		},
		onLoad() {

		},
		mounted (){
            uni.showLoading();
		},

        onShow () {
            this.fetch();
        },

		methods: {
			//刷新资产事件
			sxTap(){
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
				uni.showLoading({
				title: '刷新中...'
				});
				this.$api.syncChargeCoin(this.ADDRESS).then(result=>{
					uni.hideLoading();
					this.BTA = result.BTA
					this.INTEGRAL = result.INTEGRAL
					this.showToast('同步成功');
					this.preventStatus=false;
				}).catch(error => {
					this.preventStatus=false;
                    uni.hideLoading();
					if(error.code!='1005'){
						this.showError(error);
					}
                })
			},
			openWalletDetails () {
				this.navigateTo('./WalletDetails')
			},
			openRecharge () {
				this.navigateTo('./recharge',{address: this.ADDRESS});
			},
			openMention () {
				this.navigateTo('./Withdraw');
			},
            open_new () {
                this.navigateTo('./newWithdraw');
            },
			openTransferAccounts () {
				this.navigateTo('./TransferAccounts');
			},
			openState () {
				this.navigateTo('./state');
			},
			fetch () {
				this.$api.getMyWallet().then(result => {
				    this.BTA = result.BTA
				    this.INTEGRAL = result.INTEGRAL
                    this.ADDRESS = result.ADDRESS;
					uni.hideLoading();
				}).catch(error => {
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.page {
		height: 100vh;
		background-color: #F8F8F8;
	}
    .top {
		position: fixed;
		width: 100%;
		top: 0;
		padding-top: calc(88upx + var(--status-bar-height) + 40upx);
		box-sizing: border-box;
        padding-bottom: 130upx;

        .wallet-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
        }
        .info-row {

			margin-left: 60upx;

			&+.info-row {
				margin-top: 56upx;
			}

            .label {
				font-size:26upx;
				color: #C9A675;
				line-height: 27upx;
				margin-bottom: 30upx;
            }
            .value {
				font-size:60upx;
				font-weight:bold;
				color:rgba(201,166,117,1);
				line-height:60upx;
            }
        }

    }

    .option-list {
		margin-top: calc(509upx - 88upx - var(--status-bar-height) - 40upx + 32upx);
		margin-left: 30upx;
		margin-right: 30upx;
		background-color: #ffffff;
		border-radius:8upx;

        .option-item {
			display: flex;
			height: 96upx;
			align-items: center;
			padding: 0 47upx;
			position: relative;

			&:active {
				background-color: #eee;
			}

			&:after {
				content: "";
				width: calc(100% - 56upx);
				height: 1upx;
				background-color: #F2F2F2;
				position: absolute;
				bottom: 0;
				left: 28upx;
			}

            .icon {
				width: 34upx;
				height: 34upx;
				margin-right: 47upx;
			}

            .text {
				font-size:30upx;
				color:rgba(34,34,34,1);
				line-height:31upx;
				flex: 1;
			}

            .ic-right {
				width: 14upx;
				height: 24upx;
			}

        }

    }

    .payAndget{
        width: 710upx;
        position: absolute;
		bottom:-112upx;
        left: 20upx;
        justify-content: space-between;
        display: flex;
        background-color: white;
		
    }
    .get,.pay{
        display: flex;
        width: 350upx;
        height: 160upx;
        text-align: center;
        line-height: 160upx;
        justify-content: center;
        align-items:center;
    }

    .mediumLine{
        width: 1upx;
        height: 78upx;
        margin-top: 41upx;
        background-color: #EBEBEB;
    }
    .payAndgetImg{
        width: 32upx;
        height: 33upx;
        vertical-align: middle;
        display: inline-block;
    }
    .payAndgetText{
        display: inline-block;
        font-size: 30upx;
        color: #222222;
        margin-left: 35upx;
        vertical-align: middle;
    }
    .instructions{
        color: #C9A675;
        font-size: 30upx;
        text-align: center;
        width: 100%;
        position: fixed;
        bottom: 82upx;
        height: 60upx;
    }
</style>
