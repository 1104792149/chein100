<template>
    <view class="page">

        <view class="form">
            <view class="form-item">
                <view class="label">国家</view>
                <view class="form-item-control static-value">中国</view>
            </view>
            <view class="form-item">
                <view class="label">姓名</view>
                <input v-model="form.relName" class="form-item-control" placeholder="请输入姓名" placeholder-style="color: #999999" />
            </view>
            <view class="form-item" style="margin-bottom: 60upx">
                <view class="label">身份证</view>
                <input v-model="form.idCard" class="form-item-control" placeholder="请输入身份证号" placeholder-style="color: #999999" maxlength="18" />
            </view>
        </view>

        <view class="id-card-container">
            <view class="title">手持身份证照片</view>
            <view class="image-list">
                <!-- 正面 -->
                <image class="image-item" v-if="form.front" mode="aspectFill" :src="form.front" @click="choosePositiveImage"></image>
                <view class="image-item" v-else @click="choosePositiveImage">
                    <image class="add-icon" src="../../../static/mine/icon_id_card_add.png"></image>
                    <view class="text">上传身份证正面</view>
                </view>

                <!-- 反面 -->
                <image class="image-item" v-if="form.back" mode="aspectFill" :src="form.back" @click="chooseNegativeImage"></image>
                <view class="image-item" v-else @click="chooseNegativeImage">
                    <image class="add-icon" src="../../../static/mine/icon_id_card_add.png"></image>
                    <view class="text">上传身份证反面</view>
                </view>

                <!-- 手持 -->
                <image class="image-item" v-if="form.holdCode" mode="aspectFill" :src="form.holdCode" @click="chooseSpecialImage"></image>
                <view class="image-item" v-else @click="chooseSpecialImage">
                    <image class="add-icon" src="../../../static/mine/icon_id_card_add.png"></image>
                    <view class="text">手持身份证照片</view>
                </view>

                <!-- 手持 -->
                <image class="image-item" src="../../../static/mine/id_card_upload_sample.png"></image>

            </view>
            <view class="desc">
                请在白纸上写下CHAIN+当天日期+签名
                <view>手持身份证及该信息</view>
            </view>
        </view>
    </view>
</template>

<script>

    import NavigationBar from "../../../components/NavigationBar";
    const TYPE_SPECIAL = 0;
    const TYPE_POSITIVE = 1;
    const TYPE_NEGATIVE = 2;

    import oss from '@/js/oss'
    import utils from '@/js/utils.js'

    export default {

        name: "VerifyCenter",
        components: {NavigationBar},
        data () {
            return {
                form: {
                    relName: '',
                    idCard: '',
                    holdCode: '',
                    front: '',
                    back: '',
                },
            }
        },

        onLoad (option) {
            // 如果不是重新认证，则不需要获取上一次提交的认证信息
            if (!option.force) {
                this.$api.getUserAuthStatus().then(result => {
                    uni.hideLoading();
                    // 如果没有提交过信息，则跳过
                    if (!result.data) return;

                    switch (result.data.isPass) {
                        case 0: // 待审核
                            this.redirectTo('./VerifyStatus', { type: 1, ...result.data })
                            break;
                        case 1: // 通过
                            this.redirectTo('./VerifyStatus', { type: 0, ...result.data })
                            break;
                        case 2: // 不通过
                            this.redirectTo('./VerifyStatus', { type: 2 })
                            break;
                    }
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						 this.showError(error);
					}
                })
            }
        },

        onNavigationBarButtonTap (e) {
            this.submit();
        },

        methods: {
            chooseImage (type) {
                uni.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],
                    success: res => {
                        const file = res.tempFiles[0];
                        this.uploadImage(file, type);
                    }
                });
            },
            chooseSpecialImage () {
                this.chooseImage(TYPE_SPECIAL);
            },
            choosePositiveImage () {
                this.chooseImage(TYPE_POSITIVE);
            },
            chooseNegativeImage () {
                this.chooseImage(TYPE_NEGATIVE);
            },

            uploadImage (file, type) {
                this.uploadFile(file).then(url => {
                    if (type === TYPE_SPECIAL) {
                        this.form.holdCode = url;
                    } else if (type === TYPE_POSITIVE) {
                        this.form.front = url;
                    } else if (type === TYPE_NEGATIVE) {
                        this.form.back = url;
                    }
                });
            },

            submit () {
                if (!this.form.relName) return this.showToast('请输入姓名');
                if (!this.form.idCard) return this.showToast('请输入身份证号');

                const idCardValidateInfo = utils.validateIDCard(this.form.idCard)
                if (!idCardValidateInfo.status) {
                    this.showToast(idCardValidateInfo.msg)
                    return;
                }
                if (!this.form.holdCode) return this.showToast('请选择手持照片');
                if (!this.form.front) return this.showToast('请选择身份证正面照');
                if (!this.form.back) return this.showToast('请选择身份证反面照');

                uni.showLoading();
                this.$api.submitUserAuth(this.form).then(result => {
                    this.redirectTo('./VerifyStatus', { type: 1, ...result })
                    uni.hideLoading();
                }).catch(error => {
                    uni.hideLoading();
					if(error.code!='1005'){
						 this.showError(error);
					}
                });
            },
        },

    }
</script>

<style scoped lang="less">

    .page {
        padding: 0 30upx;
    }

    .form {
        padding-top: 88upx;
    }

    .form-item {
        margin-bottom: 77upx;
        display: flex;
        border-bottom: 1upx solid #F2F2F2;
        align-items: center;
        padding-bottom: 32upx;

        .label {
            display: inline-block;
            width: 110upx;
            white-space: nowrap;
            font-size:32upx;
            color: #222222;
            margin-right: 56upx;
        }
        .form-item-control {
            font-size:32upx;
            color: #222222;
        }
        .static-value {
            color:rgba(30,30,30,1);
            border-bottom: none;
        }
    }

    .id-card-container {
        .title {
            font-size:32upx;
            color:rgba(34,34,34,1);
            margin-bottom: 37upx;
        }

        .image-list {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 16upx;
        }
        .image-item {
            width: 330upx;
            height: 220upx;
            text-align: center;
            background-color: #F2F2F2;
            margin-right: 30upx;
            margin-bottom: 30upx;
            display: flex;

            flex-direction: column;
            align-items: center;
            justify-content: center;

            &:nth-child(2n) {
                margin-right: 0;
            }

            .add-icon {
                width: 72upx;
                height: 72upx;
                margin-bottom: 22upx;
            }
            .text {
                font-size:28upx;
                color:rgba(153,153,153,1);
            }
        }

        .desc {
            line-height:34upx;
            font-size:24upx;
           color:rgba(153,153,153,1);
        }
    }


</style>