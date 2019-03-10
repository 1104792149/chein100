<template>
    <view class="page">
        <view class="content">
            <image mode="aspectFill" class="avatar" :src="user.headImg"></image>
            <view class="username">{{ user.nickName }}</view>
            <view class="phone">{{ phone }}</view>
			
			<view class="condition">
				<view :class="[user.isCheck==0?'titleType':'','isCheck']">
					<text>通过身份认证</text>
					<image v-if="user.isCheck==1" src="../../static/mine/xz_3x.png"></image>
				</view>
				<view :class="[user.isConform==0?'titleType':'','isConform']">
					<text>持有{{user.needAmount}}BTA及以上</text>
					<image v-if="user.isConform==1" src="../../static/mine/xz_3x.png"></image>
				</view>
			</view>
			<view :class="[!userStatus?'hint1':'hint2']" >
				该用户必须满足以上所有条件
			</view>
            <view  :class="[userStatus?'':'opacitySize','btn-primary','button']" @click="confirm">设置TA为辅助节点</view>
        </view>

    </view>
</template>

<script>

    import store from '@/js/store'
    import NavigationBar from "../../components/NavigationBar";

    export default {
        name: "SetAssistNodeConfirm",
        components: {NavigationBar},
        data () {
            return {
                user: {},
                phone: '',
				preventStatus:false
            }
        },

        onLoad (option) {
             console.log(option)
            this.user = option;

            if (option.mobile) {
                this.phone = this.hidePhone(option.mobile);
            }
        },
		computed:{
			userStatus(){
				if(this.user.isConform==1&&this.user.isCheck==1){
					return true;
				}else{
					return false;
				}
			}
		},
        methods: {
            hidePhone (phone) {
                return phone.substring(0, 3) + '****' + phone.substring(7, 11)
            },
            confirm () {
				if(!this.userStatus){
					return false;
				}
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
                uni.showLoading();
                this.$api.setAssistNode(this.user.userId).then(result => {
                    this.redirectTo('./SuccessPage', {
                        title: '设置辅助节点',
                        message: '设置成功'
                    })
                    uni.hideLoading();
					this.preventStatus=false;
                    uni.setStorageSync('reload', true);
                }).catch(error => {
					this.preventStatus=false;
                    uni.hideLoading();
					if(error.code!='1005'){
						this.showError(error);
					}
                });
            }
        },

    }
</script>

<style scoped lang="less">

    .content {
        text-align: center;
        padding-top: 102upx;
    }

    .avatar {
        width: 148upx;
        height: 148upx;
        border-radius: 50%;
        margin-bottom: 24upx;
    }
    .username {
        font-size:36upx;
        color:rgba(30,30,30,1);
    }
    .phone {
        font-size:28upx;
        color:rgba(153,153,153,1);
    }
    .button {
        line-height: 110upx;
		height: 110upx;
        margin:43upx 32upx 32upx 32upx ;
        font-size:38upx;
        color:rgba(111,79,43,1);
		border-radius: 110upx;
    }
	.condition{
		font-size: 32upx;
		color: #D7AB6C;
		margin-top: 60upx;
		margin-bottom: 22upx;
	}
	.condition image{
		height: 28upx;
		width: 40upx;
	}
	.condition view{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 56upx 0upx;
		margin:0 30upx;
		border-bottom: 1upx solid #F2F2F2;
	}
	.isCheck{
		border-top: 1upx solid #F2F2F2;
	}
	.isConform{
	}
	.hint1{
		font-size: 24upx;
		color: #F93336;
		margin:0 30upx;
		text-align: right;
	}
	.hint2{
		font-size: 24upx;
		color: #F93336;
		margin:0 30upx;
		text-align: right;
		opacity: 0;
	}
	.titleType{
		color: #999999 !important;
	}
	.opacitySize{
		opacity:0.5;
	}
</style>