<template>
    <view class="history-list-container" :class="{ hide: !show }">
        <!--<view style="height: 16upx"></view>-->
        <view class="history-list">
            <view class="history-item" v-for="item in list">
                <view class="type">{{ item.title }}</view>
                <view class="date">{{ item.date }}</view>
                <view class="value" :class="{ income: item.income }">{{ item.amount }}</view>
            </view>
        </view>

        <uni-load-more :loading-type="loadingType" v-if="currentPage !== 1"></uni-load-more>


         <status-page :status="isOpen ? dataStatus : 'empty'" @retry="retry" :fixed="false"></status-page>

    </view>
</template>

<script>
    import loadMoreMixins from '@/js/mixins/loadMoreMixins';
    import UniLoadMore from "@/components/uni-load-more";
    import StatusPage from "@/components/StatusPage";

    const BTA_MAP = {
        0: '打赏',
        1: '核心节点任务',
        2: '辅助节点任务',
        3: '普通用户任务',
        8: 'BTA任务',
        4: '充币',
        5: '内部转入',
        6: '提币',
        7: '内部转出',
        9: '冻结',
        10: '解冻',
        11: '转盘',
    };

    const INTEGRAL_MAP = {
        0: '签到',
        1: '转盘',
    }

    export default {
        name: "HistoryList",

        components: { StatusPage, UniLoadMore },

        data () {
            return {
                active: false,
                list: [],
            }
        },

        props: {
            type: Number,
            current: Number,
            show: Boolean,
        },

        computed: {
            isOpen () {
                return this.type !== 8;
            }
        },

        watch: {
            current (current) {
                if (current === this.type && !this.active) {
                    this.active = true;
                    this.activeCallback();
                }
            }
        },

        mixins: [loadMoreMixins],

        mounted () {
            if (this.type === 0 && !this.active) {
                this.active = true;
                this.activeCallback();
            }
        },

        methods: {
            fetch () {

                const userId = this.getCurrentUser().id;
                const id = this.currentTab;
                this.getAction().then(result => {
                    if (this.currentPage === 0) {
                        this.list = [];
                    }
                    const resultList = result.list.map(item => {
                        let data = {
                            date: this.formatDate(item.createTime, 'YYYY-MM-DD HH:mm:ss'),
                        }
                        // BTA
                        if (this.type === 0) {
                            data.title = item.sourceDisplay
                            data.income = item.type == 1
                            data.amount = data.income ? `+${item.amount}BTA` : `${item.amount}BTA`;
                        }
                        // 积分
                        if (this.type === 1) {
                            data.title = INTEGRAL_MAP[item.source];
                            data.income = true
                            data.amount = data.income ? `+${item.score}积分` : `-${item.score}积分`;
                        }
                        // 提币
                        if (this.type === 2) {
                            data.title = '普通提币';
                            data.amount = data.income ? `+${item.amount}BTA` : `${item.amount}BTA`;
                        }
                        // 转账
                        if (this.type === 3) {
                            console.log(item.amount);
                            data.income = item.amount > 0;
                            const title = item.amount>0?"转入-":"转出-";
                            const nickName = item.amount>0?item.fromName:item.toName;
                            const value = item.amount>0?('+'+item.amount):item.amount;
                            data.title = title + nickName;
                            data.amount = value +"BTA";
                        }

                        return data;
                    })
                    console.log(resultList)

                    this.loadMoreSuccessHandle(resultList);
                    this.list = this.list.concat(resultList);
                }).catch(error => {
                    this.loadMoreErrorHandle(error)
                })
            },

            getAction () {
                const page = this.currentPage;
                if (this.type === 0) return this.$api.getCoinHistory(page);
                if (this.type === 1) return this.$api.getIntegralHistory(page);
                if (this.type === 2) return this.$api.getWithdrawHistory(page);
                if (this.type === 3) return this.$api.getTxnsHistory(page);
            },

            activeCallback () {
                this.moreLoading = true;
                this.fetch();
                console.log('active: ' + this.type)
            },

            loadMore () {
                if (this.moreLoading || this.noMore) return;
                this.moreLoading = true;
                this.fetch();
            },

            refresh () {
                this.loading = true;
                this.reset();
                this.fetch();
            },

        },

    }
</script>

<style scoped lang="less">

    .history-list {
        padding: 0 30upx;
        overflow-y: auto;

        .history-item {
            padding: 30upx 0;
            border-bottom: 1upx solid #F2F2F2;
            position: relative;

            .type {
                font-size:26upx;
                color:rgba(34,34,34,1);
                line-height: 23upx;
                margin-bottom: 16upx;
            }
            .date {
                font-size:22upx;
                color:rgba(153,153,153,1);
                line-height:17px;
            }
            .value {
                font-size:26upx;
                color: #222222;
                line-height:26upx;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 0;

                &.income {
                    color: #C9A675;
                }

            }
        }
    }

    .hide {
        position: absolute;
        transform: scale(0);
    }


</style>