<template>
    <!--转账详情-->
    <view class="page">
        <view class="user-info" @click="openTransfer">
            <image class="avatar"  :src="transfer.amount>0?transfer.fromAvatar:transfer.toAvatar"></image>
            <text class="username">{{transfer.amount>0?transfer.fromName:transfer.toName}}</text>
            <image class="icon-right" src="../../../static/mine/wallet/icon_right.png"></image>
        </view>

        <view class="transfer-value">
            <text>{{ transfer.amount>0?('+'+transfer.amount):transfer.amount }}</text>
            <text class="unit">{{ transfer.coinSymbol }}</text>
        </view>
        <view class="transfer-status">交易成功</view>

        <view class="detail">
            <view class="row">
                <view class="label">对方账户</view>
                <view class="value">{{ transfer.amount>0?transfer.fromName:transfer.toName }} {{ transfer.amount>0?transfer.fromMobile:transfer.toMobile }}</view>
            </view>
            <view class="row">
                <view class="label">创建时间</view>
                <view class="value">{{ transfer._date }}</view>
            </view>
            <view class="row">
                <view class="label">订单号</view>
                <view class="value">{{ transfer.id }}</view>
            </view>
        </view>

    </view>
</template>

<script>
    import NavigationBar from "../../../components/NavigationBar";
    import store from '@/js/store'

    export default {
        name: "TransferDetail",

        components: {NavigationBar},

        data () {
            return {
                transfer: {},
            }
        },

        onLoad (option) {
            const id = option.id;
            const userId = store.getUser().id;
			console.info(option)

            uni.showLoading();
            this.$api.getTxnsDetail(id).then(result => {
				console.info(result)
                const isFrom = userId === result.fromUid;

                result._mobile = isFrom ? result.toMobile : result.fromMobile
                result._hideMobile = this.hidePhone(result._mobile)
                result._nickName = isFrom ? result.toName : result.fromName;
                result._avatar = isFrom ? result.toAvatar : result.fromAvatar;
                result._date = this.formatDate(result.createTime, 'YYYY-MM-DD HH:mm:ss')
                result._amount = isFrom ? `-${result.amount}` : `+${result.amount}`;
                result._id = isFrom ? result.toUid : result.fromUid

                this.transfer = result;
                uni.hideLoading();
            }).catch(error => {
                uni.hideLoading();
				if(error.code!='1005'){
					 this.showError(error);
				}
            })
        },

        methods: {
            openTransfer () {
                if (!this.transfer._id) {
                    return;
                }
                this.navigateTo('./TransferInputValue', {
                    id: this.transfer._id,
                    headImg: this.transfer._avatar,
                    nickName: this.transfer._nickName,
                    mobile: this.transfer._mobile,
                })
            },
            hidePhone (phone) {
                if (!phone) return ''
                return phone.substring(0, 3) + '****' + phone.substring(7, 11)
            },
        },

    }
</script>

<style scoped lang="less">

    .user-info {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 50upx;
        margin-bottom: 40upx;

        .avatar {
            width: 66upx;
            height: 66upx;
            margin-right: 20upx;
            border-radius: 50%;
        }
        .username {
            font-size:36upx;
            color:rgba(30,30,30,1);
            margin-right: 26upx;
        }
        .icon-right {
            width: 14upx;
            height: 24upx;
        }
    }

    .transfer-value {
        font-size:72upx;
        color:rgba(34,34,34,1);
        line-height:58upx;
        text-align: center;
        margin-bottom: 30upx;
        .unit {
            font-size:30upx;
            color:rgba(34,34,34,1);
            margin-left: 13upx;
        }
    }
    .transfer-status {
        font-size:28upx;
        color:rgba(153,153,153,1);
        line-height:28px;
        text-align: center;
        margin-bottom: 50upx;
    }

    .detail {
        padding: 0 30upx;
        font-size:28upx;
        color:rgba(34,34,34,1);

        .row {
            display: flex;
            padding: 32upx 0;
            border-bottom: 1upx solid #E2E2E2;

            .label {
            }
            .value {
                flex: 1;
                text-align: right;
            }
        }
    }

</style>