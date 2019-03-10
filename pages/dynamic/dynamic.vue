<template>
	<view class="page">

		<view v-for="(data, index1) in dataList" :key="data.title">
			<view class="dynamic-list">
				<view class="date-section-title">{{ data.title }}</view>
				<view class="dynamic-item" v-for="(item, index2) in data.data" :key="item.id">
					<view class="dynamic-time">{{ item.showDate }}</view>
					<view class="dynamic-title">{{ item.title }}</view>
					<view class="dynamic-content" style="word-break: break-all;" >
						<rich-text :nodes="item.content"></rich-text>
					</view>
				</view>
			</view>
		</view>

		<uni-load-more :loading-type="loadingType"></uni-load-more>

		<status-page :status="dataStatus" @retry="retry"></status-page>

		<view class="tabbar-shadow"></view>
	</view>
</template>

<script>

	import differenceInDays from 'date-fns/difference_in_days';
	import zh_cn from 'date-fns/locale/zh_cn'
	import format from 'date-fns/format'
	import loadMoreMixins from '@/js/mixins/loadMoreMixins';
	import UniLoadMore from "../../components/uni-load-more";
	import StatusPage from "../../components/StatusPage";

	export default {
		components: {StatusPage, UniLoadMore},
		data() {
			return {
				dataList: [],
				currentTitle: 0,
				currentIndex: 0,

				mockData: [
					{ id: 1, title: '标题1', content: '内容1', createTime: 1544683796169 },
					{ id: 2, title: '标题2', content: '内容2', createTime: 1544683012169 },
					{ id: 3, title: '标题3', content: '内容3', createTime: 1544544000000 },
					{ id: 4, title: '标题4', content: '内容4', createTime: 1544284800000 },
					{ id: 5, title: '标题5', content: '内容5', createTime: 1541999796169 },
				],

				list: [],
			}
		},

		mixins: [loadMoreMixins],

		mounted () {
			this.moreLoading = true;
			this.fetch();
		},

		methods: {
			// 复制事件 @longtap="setClipboardDataTap(item.content)"
			setClipboardDataTap(value){
				uni.setClipboardData({
				data: value.replace(/&nbsp;/g,''),
				success: function () {
					uni.showToast({
					title: '复制成功',
					duration: 2000
					});
				}
				});
			},
			fetch () {
				this.$api.getNewsList(this.currentPage).then(result => {
					if (this.currentPage === 0) {
						this.currentTitle = 0;
						this.currentIndex = 0;
						this.dataList = [];
					}
					this.processData(result.list);
					this.loadMoreSuccessHandle(result.list);
				}).catch(error => {
					this.loadMoreErrorHandle(error)
				})
			},

			processData (list) {
				if (list.length === 0) return;
				if (this.currentTitle === 0) {
					this.currentTitle = this.getTimeTitle(list[0].createTime);
					this.dataList.push({
						title: this.currentTitle,
						data: [],
					});
				}
				for (const item of list) {
					item.showDate = this.formatDate(item.createTime, 'HH:mm');
					// 如果不是同一天
					const title = this.getTimeTitle(item.createTime);
					if (this.currentTitle !== title) {
						this.currentTitle = title;
						this.dataList.push({
							title: title,
							data: [],
						});
						this.currentIndex += 1;
					}
					this.dataList[this.currentIndex].data.push(item);
				}
			},

			getTimeTitle (time) {
				const diffDay = differenceInDays(new Date(), new Date(time));
				const formatDate = format(time, 'MM月DD日 dddd', { locale: zh_cn });
				let suffix = '';
				if (diffDay == 0) {
					suffix = '今天';
				} else if (diffDay == 1) {
					suffix = '昨天'
				} else if (diffDay > 1 && diffDay <= 7) {
					suffix = `${diffDay}天前`
				}

				if (suffix) {
					return suffix + " " + formatDate
				}
				return formatDate
			}

		},

	}
</script>

<style lang="less">

	.page {
		padding-top: 36upx;
		padding-right: 50upx;
		padding-left: 35upx;
	}

	.date-section-title {
		font-size:24upx;
		color:rgba(153,153,153,1);
		line-height:31upx;
		margin-bottom: 50upx;
		position: relative;

		&:before {
			content: "";
			width:12upx;
			height:12upx;
			background:rgba(201,166,117,1);
			border-radius:50%;
			position: absolute;
			top: 50%;
			left: -23upx;
			transform: translateY(-50%) translateX(-50%);
			z-index: 9;
		}

		&:after {
			content: "";
			width:0upx;
			height:60%;
			border: 4upx solid #fff;
			position: absolute;
			left: -23upx;
			top: -25%;
			transform: translateX(-50%);
		}

	}
	.dynamic-list {
		padding-left: 23upx;
		border-left: 1px dashed #CCCCCC;
	}
	.dynamic-item {
		margin-bottom: 100upx;
		position: relative;

		&:last-child {

			&:after {
				content: "";
				width:0upx;
				height:100%;
				border: 4upx solid #fff;
				position: absolute;
				top: 10upx;
				z-index: 5;
				left: -23upx;
				transform: translateX(-50%);
			}
		}

		.dynamic-time {
			font-size:24upx;
			font-weight:bold;
			color:rgba(201,166,117,1);
			line-height:31upx;
			margin-bottom: 23upx;
			position: relative;

			&:before {
				content: "";
				width:12upx;
				height:12upx;
				border: 2upx solid rgba(201,166,117,1);
				box-sizing: border-box;
				background-color: #ffffff;
				border-radius:50%;
				position: absolute;
				top: 50%;
				left: -33upx;
				transform: translateY(-50%) translateX(50%);
				z-index: 9;
			}

		}

		.dynamic-title {
			font-size:32upx;
			color:rgba(34,34,34,1);
			line-height:42upx;
			margin-bottom: 28upx;
		}
		.dynamic-content {
			font-size:32upx;
			color:rgba(153,153,153,1);
			line-height:48upx;
		}
	}

</style>
