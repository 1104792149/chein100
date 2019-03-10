<template>
    <view class="page">
        <view class="form-item">
            <text>对方账户</text>
            <input placeholder="手机号码" placeholder-style="color:rgba(153,153,153,1);" v-model="phone" maxlength="11" type="number" class="phoneinput"/>
        </view>

        <view class="desc">BTA将实时转入对方账户，无法退款</view>
        <button class="button btn-primary" :disabled="!isValid" @click="next">
            下一步
        </button>

        <alert-dialog ref="dialog"></alert-dialog>

        <!--&lt;!&ndash; 敬请期待 &ndash;&gt;-->
        <!--<status-page status="noOpen"></status-page>-->

    </view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";
    import StatusPage from "../../../components/StatusPage";
    import AlertDialog from "../../../components/AlertDialog";

    export default {
        name: "Transfer",

        components: {AlertDialog, StatusPage, NavigationBar},

        data () {
            return {
                phone: '',
                userPhone: '',
            }
        },

        computed: {
            isValid () {
                return !!this.phone.match(/\d{11}/);
            }
        },

        mounted () {
            this.userPhone = this.getCurrentUser().mobile;
            // this.openTransferHistory();
        },

        onNavigationBarButtonTap (e) {
            this.openTransferHistory();
        },

        methods: {
            next () {
                if (this.phone === this.getCurrentUser().mobile) {
                    this.showError('不能给自己转账');
                    return;
                }
                uni.showLoading();
                this.$api.getUserByMobile(this.phone).then(result => {
                    uni.hideLoading();
                    if (!result) {
                        this.$refs.dialog.show({
                            title: '提示',
                            message: '用户不存在',
                            cancelButtonText: '',
                            confirmButtonText: '确认',
                        })
                        return;
                    }
                    this.navigateTo('./TransferInputValue', result)
                }).catch(error => {
					 uni.hideLoading();
					if(error.code!='1005'){
						 this.showError(error);
					}
                })
            },

            openTransferHistory () {
                this.navigateTo('./TransferHistory');
            }

        },
    }
</script>

<style scoped lang="less">

    .page {
        background-color: #F5F5F5;
        min-height: 100vh;
        padding-top: 16upx;
    }

    .form-item {
        background:rgba(255,255,255,1);
        padding: 0 32upx;
        display: flex;
        align-items: center;
        margin-bottom: 24upx;
        font-size:30upx;

        text {
            height:94upx;
            line-height:94upx;
            margin-right: 30upx;
            color:rgba(34,34,34,1);
            white-space: nowrap;
        }
        input {
            /*height:64upx;*/
            /*line-height:64upx;*/
            /*margin-top: 15upx;*/
            color: #222222;
        }
        .phoneinput{
            height: 40upx!important;
            /*line-height:60upx!important;*/
            padding: 15upx 0;
            margin-top: 0upx!important;
            float: left;
        }
    }
    .desc {
        margin-left: 34upx;
        font-size:24upx;
        color:rgba(153,153,153,1);
        margin-bottom: 70upx;
    }
    .button {
        height: 110upx;
        line-height: 110upx;
        margin: 0 70upx;

        font-size:36upx;
        border-radius:55px;
    }

</style>