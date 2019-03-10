<template>
    <view class="announcement-bar-container" v-if="back" >
        <view class="announcement-bar" @click="announcementItemTap" ></view>
		<view class="announcement-center">
			<image class="title-img"  src="/static/announcement2x.png"></image>
			<image @click="announcementItemTap" class="no-img" src="/static/noIcon2x.png"></image>
			<view class="title-text">更新公告</view>
			<scroll-view  scroll-y="true" class="scroll-Y" >
				<text>{{newText}}</text>
			</scroll-view>
		</view>
		
    </view>
</template>

<script>
    export default {
        name: "UpdateTheAnnouncement",
        props: ['back','text'],
        methods: {
          announcementItemTap(){
			  this.$emit('announcement')
		  }
        },
		computed:{
			newText(){
				return this.text.replace(/\\n/gm, '\n');
			}
		}

    }
</script>

<style scoped lang="less">
.announcement-bar-container{
	z-index: 99;
	width: 100vw;
	height:100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0;
	left: 0;
	padding-top: 65upx;
	}
.announcement-bar {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height:100vh;
	background:rgba(34,34,34,0.5);
	z-index: 98;
	padding-top: 80upx;
    } 
.announcement-center{
	background: #fff;
	z-index: 98;
	width: 90%;
	margin:0 32upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	}
.title-text{
	padding-top: 46upx;
	text-align: center;
	font-size: 38upx;
	color: #222;
	}
.title-img{
	width: 100%;
	height: 290upx;
	padding: 0;
	margin: 0;
	}
.scroll-Y{
	padding: 30upx 0 80upx 0;
	height: 290upx;
	width: 90%;
	color: #999;
	text-align: left;
	font-size: 32upx;
	}
.no-img{
	height: 60upx;
	width: 60upx;
	position: absolute;
	top: -88upx;
	right: 0upx;
	}
</style>