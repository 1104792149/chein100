
<script>

    import config from '@/js/config'
	 import store from '@/js/store';
	export default {

        data () {
            return {
                isForce: false,
                versionContent: '',
            }
        },

        onLaunch () {
            if(process.env.NODE_ENV === 'development'){
                console.log('开发环境')
            }else{
                //#ifdef APP-PLUS
                var req = { //升级检测数据
                    "appid": plus.runtime.appid,
                    "version": plus.runtime.version
                };
                this.$api.getAppVersionCode(req).then(result => {
                    if (result.version !== plus.runtime.version) {
                        this.isForce = result.isUp == 1;
                        this.versionContent = result.versionContent;
                        this.showModal();
                    }
                })
                //#endif
            }

            this.$api.getActivityCountDown().then(result => {
                config.START_TIME = result;
            });
        },

		onShow: function () {
        },

		onHide: function () {
		},

        methods: {
            showModal () {
                uni.showModal({ //提醒用户更新
                    title: "更新提示",
                    showCancel: !this.isForce,
                    content: this.versionContent,
                    confirmText: '更新',
                    success: (res) => {
                        if (this.isForce) {
                            this.showModal();
                        }
                        if (res.confirm) {
							//去除更新状态
							uni.removeStorageSync('announcement');
                            plus.runtime.openURL(config.UPDATE_URL);
                        }
                    }
                })
            },
        },

	}
</script>

<style>
	/*每个页面公共css */
</style>
