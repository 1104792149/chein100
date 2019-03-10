<!--验证老手机页面-->
<template>
    <view class="page status">
		<!-- #ifdef H5 -->
		<view @click="through" style="z-index: 9999;color: red;position: fixed;top: 0;">
			提交
		</view>
		<!-- #endif -->
         <view class="form">
             <view class="form-item small-padding">
                 <text class="label">头像</text>
                 <view class="form-item-control" @click="chooseImage">
                     <image class="avatar" :src="user.headImg"></image>
                 </view>
             </view>
             <view class="form-item">
                 <text class="label">昵称</text>
                 <view class="form-item-control">
                     <input class="form-item-input" v-model="user.nickName" />
                 </view>
             </view>
             <view class="form-item"  v-if="user.nodeType==0 || user.nodeType==1">
                 <text class="label">性别</text>
                 <view style=" width: 70%;" v-if="user.gender==-1">
					<radio-group @change="selectSex" class="selectSexClass" >
						<view :class="[index==1?'selectSexClass1':'selectSexClass2']" v-for="(item, index) in items" :key="item.value">
							<radio color="#C9A675" :value="item.value" :checked="index == current" />
							<label>{{item.name}}</label>
						</view>
					</radio-group>
				 </view>
				  <view class="form-item-control" v-if="user.gender!=-1">
				    {{user.gender==1?'男':'女'}}
				 </view>
             </view>
             <!--<view class="form-item">-->
                 <!--<text class="label">ID</text>-->
                 <!--<view class="form-item-control">{{ user.id }}</view>-->
             <!--</view>-->
             <view class="form-item" @click="openInviteCode">
                 <text class="label">二维码名片</text>
                 <view class="form-item-control">
                     <image class="qrcode" src="../../static/mine/qrcode_gray.png"></image>
                 </view>
             </view>
             <view class="form-item" @click="charge_comfirm = true" v-if="user.nodeType==0 || user.nodeType==1">
                <text class="label">手机号码</text>
                <view class="form-item-control">{{ newMobile }}</view>
             </view>
         </view>
        <!--确认框-->
        <view class="zhezhaoceng" @click="charge_comfirm = false" v-if='charge_comfirm'></view>
        <view class="charge"  v-bind:class="[!charge_comfirm?'hide_charge_toast':'']">
            <view class="comfirm_title">提示</view>
            <view class="comfirm_content">{{comfirm_msg}}</view>
            <view class="comfirm_btn" @click="comfirm_fun()">{{comfirm_btn_msg}}</view>
            <view class="que_btn" @click="charge_comfirm=false">取消</view>
        </view>
		<alert-dialog ref="dialog" @confirm="onConfirm"></alert-dialog>
    </view>
</template>

<script>

    import store from '@/js/store';
    import NavigationBar from "../../components/NavigationBar";
	  import AlertDialog from "../../components/AlertDialog";
    import oss from '@/js/oss'

    export default {
        name: "UserProfileEdit",
        components: {NavigationBar,AlertDialog},
        data () {
            return {
                user: {},
                charge_comfirm:false,//确认框是否显示的标志
                comfirm_msg:'是否更换绑定手机号',//确认框的content
                comfirm_btn_msg:'确认',//按钮的文字
				items: [
                {
                    value: '1',
                    name: '男',
                },{
                    value: '0',
                    name: '女'
                },
            ],
            current: -1,//-1,未设置,1-女(0),0-男(1),
			preventStatus:false
            }
        },

        computed: {
             sex () {
                 if (this.user.gender == -1&&this.current==-1){
					  return -1
				 }else if(this.current==-1){
					 return this.user.gender 
				 }else if(this.current!=-1){
					  return this.current == 0 ? 1 : 0;
				 }
                
            },
			newMobile(){
				return this.user.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			},
        },
		
        onNavigationBarButtonTap (e) {
           this.through();
        },

        onShow () {
            this.user = store.getUser();
            this.$api.getUserInfo().then(result => {
                this.user = result;
				console.info(result)
            })
        },

        methods: {
			through(){
				if(this.user.gender==-1&&this.current!=-1){
					 this.$refs.dialog.show({
					    title: '提示',
					    message: '选择后不可更改？',
					    confirmButtonText: '确认',
					    cancelButtonText: '取消',
					})
				}else{
					this.submit();
				}
				 
			},
			onConfirm(){
				this.submit();
			},
            comfirm_fun(){
                this.charge_comfirm = false;
                uni.navigateTo({
                    url: '/pages/mine/testOldMobile?mobile=' + this.user.mobile
                });
            },
            openInviteCode () {
                this.navigateTo('./InviteCode', {
                    code: this.user.inviteCode
                });
            },

            chooseImage () {
                uni.chooseImage({
                    count: 1,
                    success: res => {
                        const file = res.tempFiles[0];
                        this.uploadFile(file).then(url => {
                            this.user.headImg = url;
                        });
                    }
                });
            },

            selectSex (evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
					this.current = i;
					break;
					}
				}
            },

            submit () {
                if (!this.user.nickName || this.user.nickName.trim().length === 0) {
                    this.showToast('昵称不能为空')
                    return;
                }
				if(this.preventStatus)return;//按钮防刷
				this.preventStatus=true;
                uni.showLoading();
                this.$api.modifyUserInfo({
                    nickName: this.user.nickName,
                    headImg: this.user.headImg,
                    gender:this.sex,
                }).then(result => {
                    uni.hideLoading();
                    this.showToast('修改成功');
                    setTimeout(() => {
                        uni.navigateBack({ delta: 1 });
						this.preventStatus=false;
                    }, 1000);
                }).catch(error => {
					this.preventStatus=false;
                    uni.hideLoading();
                    this.showError(error);
                })
            }

        },

    }
</script>

<style scoped lang="less">
	.page {
	    min-height: 100vh;
	}
	
    .form {
        padding: 0 30upx;
    }

    .form-item {
        display: flex;
        height: 30upx;
        align-items: center;
        padding: 45upx 0;
        border-bottom: 1upx solid #F2F2F2;

        .label {
            font-size:30upx;
            color:rgba(34,34,34,1);
            width: 30%;
        }
        .form-item-control {
            width: 70%;
            text-align: right;
            font-size:26upx;
            color:rgba(153,153,153,1);
			justify-content:center;
			flex-direction: column;
        }
        .form-item-input {
            color:rgba(153,153,153,1);
        }
        .avatar {
            width: 92upx;
            height: 92upx;
            border-radius: 50%;
        }
        .qrcode {
            width: 35upx;
            height: 35upx;
        }
    }

    .small-padding {
        height: 80 upx;
        padding: 20 upx 0;
        margin-top: -36upx;
    }
    .zhezhaoceng {
        width: 100%;
        height: 100vh;
        z-index: 20;
        background-color: #000000;
        opacity: 0.8;
        position: fixed;
        top: 0;
        left: 0;
    }
    .charge{
        width: 690upx;
        height: 400upx;
        position: fixed;
        z-index: 30;
        background-color: #FFFFFF;
        top: 50%;
        left: 30upx;
        transform: translateY(-50%) scale(1);
        transition: all 0.7s;
        transform-origin: 50% 0;
        opacity: 1;
        font-size: 32upx;
        border-radius: 4upx;
    }
    .hide_charge_toast {
        transform: scale(0);
        opacity: 0;
    }
    .comfirm_title{
        width: 100%;
        text-align: center;
        height: 105upx;
        line-height: 105upx;
        color: #222222;
        border-bottom: 2upx solid #F2F2F2;
    }
    .comfirm_content{
        width: 100%;
        text-align: center;
        color: #222222;
        text-align: center;
        line-height: 190upx;
    }
    .que_btn{
        color: #999999;
        width: 150upx;
        height: 100upx;
        text-align: center;
        line-height: 100upx;
        float: right;
    }
    .comfirm_btn{
        color: #F93336;
        width: 150upx;
        height: 100upx;
        text-align: center;
        line-height: 100upx;
        float: right;
        margin-right: 20upx;
    }
	.selectSexClass{
		color: #999;
		font-size: 26upx;
		display: flex;flex-direction: row;align-items: center;justify-content: flex-end
	}	
	.selectSexClass1{
		display: flex;flex-direction: row;align-items: center;
		margin-left: 108upx
	}
	.selectSexClass2{
		display: flex;flex-direction: row;align-items: center;
	}
</style>