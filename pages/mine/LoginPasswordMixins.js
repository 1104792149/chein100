import store from '@/js/store';

const COUNT_DOWN_S = 60;

export default {

    data () {
        return {
            isSend: false,
            isCanSend: true,
            countDown: COUNT_DOWN_S,
            countDownIntervalId: 0,
            showPassword: false,
            showConfirmPassword: false,

            form: {
                verifyCode: '',
                password: '',
                confirmPassword: '',
            },

            mp: {
                "password": "",
                "verifyCode": ""
            },

            phone: '',
        }
    },

    onLoad (option) {
        this.phone = option.phone;
    },

    onNavigationBarButtonTap (e) {
        this.submit();
    },

    computed: {
        isLoginReset () {
            return false;
        }
    },

    mounted () {
        if (!this.isLoginReset) {
            const user = store.get('user');
            this.phone = user.mobile;
        }
        // this.mp.userName = user.userName;
    },

    methods: {
        sendVerifyCode () {
            if (!this.phone) {
                this.showToast('请输入手机');
                return;
            }
            if (!this.phone.match(/^(13\d|14[014-9]|15[0-35-9]|16[67]|17[0-8]|18\d|19[189])\d{8}$/)) {
                this.showToast('请输入正确的手机号码');
                return;
            }
            uni.showLoading({ title: '请求发送中' });
            this.$api.sendMsg(this.phone).then(result => {
                this.isSend = true;
                this.isCanSend = false;
                uni.hideLoading();
                this.startCountDown();
            }).catch(error => {
                uni.hideLoading();
				if(error.code!='1005'){
						 this.showError(error);
					}
            })
        },

        startCountDown () {
            this.countDown = COUNT_DOWN_S;
            this.countDownIntervalId = setInterval(() => {
                this.countDown -= 1;
                if (this.countDown === 0) {
                    clearInterval(this.countDownIntervalId);
                    this.isCanSend = true;
                }
            }, 1000)
        },

        submit () {
            if (!this.phone) {
                this.showToast('请输入手机');
                return;
            }
            if (!this.phone.match(/^(13\d|14[014-9]|15[0-35-9]|16[67]|17[0-8]|18\d|19[189])\d{8}$/)) {
                this.showToast('请输入正确的手机号码');
                return;
            }
            if (!this.form.verifyCode) {
                this.showToast('请输入验证码');
                return;
            }
            if (!this.form.password) {
                this.showToast('请输入新密码');
                return;
            }
            if (!this.form.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/)) {
                this.showToast('密码必须是6-18位数字与字母组合');
                return;
            }
            if (this.form.password !== this.form.confirmPassword) {
                this.showToast('密码不一致');
                return;
            }

            uni.showLoading({ title: '加载中' });
            this.mp.password = this.form.password;
            this.mp.verifyCode = this.form.verifyCode;
            this.mp.mobile = this.phone;
            this.$api.modifyPassword(this.mp).then(result => {
                uni.hideLoading();
                this.redirectTo('./SuccessPage', {
                    title: '修改登录密码',
                    message: '密码已修改成功'
                });
                if (this.isLoginReset) {
                    uni.setStorageSync('loginPasswordReset', true);
                }
            }).catch(error => {
                uni.hideLoading();
                if(error.code!='1005'){
					this.showError(error);
				}
            })
        },
    },

}