<template>
    <view class="page status">
        <view class="history-list">
            <view class="history-item" v-for="history in list ">
                <view class="title">普通提币</view>
                <view class="table">
                    <view class="column">
                        <view class="th">数量</view>
                        <view class="td">{{ history._amount }}</view>
                    </view>
                    <view class="column">
                        <view class="th">状态</view>
                        <view class="td" :class="history._class">{{ history._class}}</view>
                    </view>
                    <view class="column">
                        <view class="th">时间</view>
                        <view class="td">{{ history._date }}</view>
                    </view>
                </view>
            </view>
        </view>

        <uni-load-more :loading-type="loadingType"></uni-load-more>

        <status-page :status="dataStatus" @retry="retry"></status-page>

    </view>
</template>

<script>
    import loadMoreMixins from '@/js/mixins/loadMoreMixins';

    import UniLoadMore from "../../../components/uni-load-more";
    import StatusPage from "../../../components/StatusPage";

    const STATUS_MAP = {

    }

    export default {
        name: "Withdraw",

        components: { UniLoadMore, StatusPage },

        data () {
            return {
                list: [],
            }
        },

        mixins: [loadMoreMixins],

        mounted () {
            this.moreLoading = true;
            this.fetch();
        },

        methods: {
            fetch () {
                this.$api.getWithdrawHistory(this.currentPage).then(result => {
                    if (this.currentPage === 0) {
                        this.list = [];
                    }
                    result.list.forEach(item => {
                        item._date = this.formatDate(item.createTime, 'YYYY-MM-DD HH:mm:ss');
                        item._amount = item.amount.toFixed(2);
                        item._status = STATUS_MAP[item.status];
                        item._class = item.statusDisplay;
                    })
                    this.loadMoreSuccessHandle(result.list);
                    this.list = this.list.concat(result.list);
                }).catch(error => {
                    this.loadMoreErrorHandle(error)
                })
            }
        },

    }
</script>

<style scoped lang="less">

    .history-list {
        padding: 0 30upx;
        margin-top: -55upx;
    }

    .history-item {
        padding: 16upx 0;
        border-bottom: 1upx solid #F2F2F2;

        .title {
            font-size:24upx;
            color:rgba(34,34,34,1);
            margin-bottom: 26upx;
        }

        .table {
            display: flex;
            .column {
                flex: 1;
            }
            .th {
                font-size:20upx;
                color:rgba(153,153,153,1);
                line-height: 20upx;
            }
            .td {
                font-size:20upx;
                color:rgba(34,34,34,1);
                line-height: 20upx;
                white-space: nowrap;
                margin-top: 16upx;
            }
            .status0, .status1 {
                color: #C9A675;
            }
            .status2 {
                color: #222222;
            }
            .status3 {
                color: #999999;
            }
        }

    }



</style>