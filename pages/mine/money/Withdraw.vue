<!--提币页-->
<template>
    <view class="page ">
        <view class="page-content">
            <view class="form">
                <view class="form-item">
                    <view class="label">币种</view>
                    <view class="form-item-control static-value">BTA</view>
                </view>
                <view class="form-item">
                    <view class="label">提币地址</view>
                    <input v-model="form.toAddress" class="form-item-control" placeholder="请输入或长按粘贴地址" placeholder-style="color: #999999" />
                </view>
                <view class="form-item">
                    <view class="label">数量</view>
                    <view class="form-item-control">
                        <input v-model="form.withdrawValue" placeholder="最低提币数量50.00BTA" placeholder-style="color: #999999" type="number" />
                        <view class="footer">
                            <view class="unit">BTA</view>
                            <view class="all" @click="setTotal">全部</view>
                        </view>
                    </view>
                    <view class="desc" v-if="isEnough">可用 {{ totalShow }} BTA</view>
                    <view class="desc error" v-else>账户余额不足</view>
                </view>
                <view class="form-item">
                    <view class="label">手续费</view>
                    <input disabled :value="fee" class="form-item-control"/>
                </view>
            </view>

            <view class="expected">
                <view class="label">预计到账</view>
                <view class="value">{{ expectValue }} BTA</view>
            </view>

            <button class="btn-primary" :disabled="!isValid" @click="confirm">确定</button>
        </view>

        <!--敬请期待-->
        <!-- <status-page status="noOpen"></status-page> -->

    </view>
</template>

<script>

    import StatusPage from "../../../components/StatusPage";
    import NavigationBar from "../../../components/NavigationBar";

    export default {
        name: "Withdraw",

        components: {StatusPage, NavigationBar},

        data () {
            return {
                total: 0,
                form: {
                    toAddress: '',
                    withdrawValue: '',
                }
            }
        },

        onNavigationBarButtonTap (e) {
            this.openWithdrawHistory();
        },

        mounted () {
            uni.showLoading();
            this.$api.getMyWallet(this.currentPage).then(result => {
                this.total = Number(result.BTA)
                uni.hideLoading();
            }).catch(error => {
                uni.hideLoading();
				if(error.code!='1005'){
						 this.showError(error);
					}
            })
        },

        computed: {
            isValid () {
                return this.form.toAddress && this.form.withdrawValue >= 50 && this.isEnough;  //最小提币数量限制
            },
            isEnough () {
                return this.total >= this.form.withdrawValue
            },
            fee () {
                const value = Number(this.form.withdrawValue);
                if (isNaN(value) || value <= 0) return '0.00 BTA';
                return '0.00 BTA';
            },
            expectValue () {
                const value = Number(this.form.withdrawValue);
                if (isNaN(value) || value <= 0) return '0.00';

                // return Math.max((value - 5), 0).toFixed(2);    //暂无手续费,此处打开后为手续费为5
                return Math.max((value ), 0).toFixed(2);
            },
            totalShow () {
                return this.total.toFixed(2)
            }
        },

        methods: {
            openWithdrawHistory () {
                this.navigateTo('./WithdrawHistory')
            },
            setTotal () {
                this.form.withdrawValue = this.total;
            },
            confirm () {
                this.navigateTo('./WithdrawConfirm', {
                    amount: this.form.withdrawValue,
                    toAddress: this.form.toAddress,
                })
            }

        },

    }
</script>

<style scoped lang="less">

    .page {
        box-sizing: border-box;
    }
    .page-content {
        padding: 0 30upx;
    }

    .form {
        padding-top: 66upx;
    }

    .form-item {
        margin-bottom: 88upx;
        .label {
            font-size:28upx;
            color:rgba(34,34,34,1);
            margin-bottom: 32upx;
        }
        .form-item-control {
            font-size:36upx;
            color:#999999;
            padding-bottom: 22upx;
            border-bottom: 1upx solid #F2F2F2;
            position: relative;
        }
        .static-value {
            color:rgba(30,30,30,1);
            font-weight: bold;
            border-bottom: none;
        }
        .footer {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size:30upx;
            display: flex;
            z-index: 9;

            .unit {
                color:rgba(153,153,153,1);
                padding-right: 10upx;
                border-right: 1upx solid #DBDBDB;
            }

            .all {
                margin-left: 10upx;
                color:rgba(34,34,34,1);
            }
        }
        .desc {
            font-size:20upx;
            color:rgba(201,166,117,1);
            margin-top: 12upx;
            &.error {
                color: #F93336;
            }
        }
    }

    .expected {
        display: flex;
        align-items: center;
        margin-top: 122upx;
        margin-bottom: 43upx;
        .label {
            font-size:28upx;
            color:rgba(153,153,153,1);
            flex: 1;
        }
        .value {
            font-size:28upx;
            color:rgba(34,34,34,1);
        }
    }

    .btn-primary {
        height: 110upx;
        line-height: 110upx;
        font-size:38upx;
        margin: 0 40upx;
        margin-bottom: 67upx;
        border-radius:55upx;
    }

</style>