<template>
    <!--转账记录-->
    <view class="page">
        <view class="user-info-container" v-if="id">
            <image class="avatar" :src="user.headImg"></image>
            <view class="user-info">{{ user.nickName }}  {{ user._mobile }}</view>
        </view>

        <view class="history-list">
            <!--<view class="month-title">11月 支出:128BTA 收入:0BTA</view>-->
             <view class="history-item" v-for="transfer in list" @click="openTransferHistoryDetail(transfer)">
                 <view class="main-info">
                     <text class="account">{{transfer.amount>0?("转入-"+transfer.fromName):("转出-"+transfer.toName)}}</text>
                     <text class="value" :class="{ plus: transfer.amount > 0 }">{{ transfer.amount>0?("+"+transfer.amount):transfer.amount }}{{ transfer.coinSymbol }}</text>
                 </view>
                 <view class="secondary-info">
                     <text>{{ transfer._date }}</text>
                     <text>交易成功</text>
                 </view>
             </view>
        </view>

        <uni-load-more :loading-type="loadingType" v-if="currentPage !== 1"></uni-load-more>

        <status-page :status="dataStatus" @retry="retry" :fixed="false"></status-page>

    </view>
</template>

<script>
    import loadMoreMixins from '@/js/mixins/loadMoreMixins';

    import NavigationBar from "../../../components/NavigationBar";
    import UniLoadMore from "../../../components/uni-load-more";
    import StatusPage from "../../../components/StatusPage";

    import store from '@/js/store';

    export default {
        name: "TransferHistory",

        components: { NavigationBar, UniLoadMore, StatusPage },

        data () {
            return {
                id: '',
                user: {},
                list: [],
            }
        },

        mixins: [loadMoreMixins],

        onLoad (option) {
            if (option.mobile) {
                option._mobile = this.hidePhone(option.mobile)
            }
            this.id = option.id;
            this.user = option;

            if (this.user.id) {
                uni.setNavigationBarTitle({
                    title: '转账记录（个人）'
                });
            }

            this.moreLoading = true;
            this.fetch();
        },

        methods: {
            fetch () {
                const action = this.user.id
                    ? this.$api.getTxnsHistoryToUser(this.user.id, this.currentPage)
                    : this.$api.getTxnsHistory(this.currentPage);

                action.then(result => {
                    if (this.currentPage === 0) {
                        this.list = [];
                    }
                    const userId = store.getUser().id;
                    result.list.forEach(item => {
                        const isFrom = userId === item.fromUid;

                        item._date = this.formatDate(item.createTime, 'YYYY-MM-DD HH:mm:ss');
                        item._nickName = isFrom ? item.toName : item.fromName;
                        item._value = isFrom ? -item.amount : item.amount;

                    })
                    this.loadMoreSuccessHandle(result.list);
                    this.list = this.list.concat(result.list);
                }).catch(error => {
                    console.log(error)
                    this.loadMoreErrorHandle(error)
                })
            },
            openTransferHistoryDetail (transfer) {
                this.navigateTo('./TransferDetail', { id: transfer.id });
            }
        },

    }
</script>

<style scoped lang="less">
    .user-info-container {
        margin-top: 28upx;
        margin-bottom: 18upx;
        text-align: center;

        .avatar {
            width: 80upx;
            height: 80upx;
            border-radius: 50%;
            margin-bottom: 24upx;
        }
        .user-info {
            font-size:24upx;
            color:rgba(153,153,153,1);
        }
    }

    .history-list {
        .history-item {
            padding: 24upx 30upx 16upx;
            border-bottom: 1upx solid #F2F2F2;

            &:active {
                background-color: #eee;
            }

            &:last-child {
                border-bottom: none;
            }

            .main-info {
                margin-bottom: 12upx;
                font-size:24upx;
                .account {
                    color:rgba(34,34,34,1);
                }
                .value {
                    float: right;
                    color: #222222;
                    font-size: 24upx;
                    &.plus {
                        color: #C9A675;
                    }
                }
            }
            .secondary-info {
                font-size:20upx;
                color:rgba(153,153,153,1);
                line-height:18upx;
                text:last-child {
                    float: right;
                }
            }
        }
    }

    .month-title {
        height:68upx;
        line-height:68upx;
        background:rgba(245,245,245,1);
        text-align: center;

        font-size:20upx;
        color:rgba(153,153,153,1);
    }


</style>