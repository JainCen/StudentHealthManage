<!-- 用户注册 邯郸-前端-秦少卫 -->
<template>
	<view>
		<view class="container">
			<view class="title">
				<text>{{school}}学生健康报备系统</text>
			</view>
			<wuc-tab textFlex :tab-list="tabList" :tabCur.sync="userType" tab-class="text-center text-black bg-white swiper-title" select-class="text-blue" />
			<swiper :current="userType" class="swiper" duration="300" :circular="true" indicator-color="rgba(255,255,255,0)"
			 indicator-active-color="rgba(255,255,255,0)">
				<!-- 老师 -->
				<swiper-item key="teacher">
					<view class="desc">
						<view>老师登录，查看自己班级的学生健康数据统计</view>
					</view>
				</swiper-item>
				
				<!-- 学生 -->
				<swiper-item key="students">
					<view class="desc ">
						<view>学生注册后可关联自己的班级上报健康状况</view>
					</view>
				</swiper-item>
		
				
				<!-- 管理员 -->
				<swiper-item key="admin">
					<view class="desc">
						<view>管理员模式,管理班级等信息</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="login-form margin-top">
				<input type="text" value="" placeholder="请输入用户名" v-model="username" />
				<input type="text" value="" placeholder="请输入密码" password="true" v-model="password" />
				<input type="text" value="" placeholder="请再次确认密码" password="true" v-model="repeatPassword" />
				<div class="buttonGroup">
					<button type="primary" @click="signUp">注册</button>
				</div>
				<navigator url="/pages/login/login" class="linkBtn" >
					<text>已有账号？点击登录 </text>
				</navigator>
				<!-- #ifdef MP-WEIXIN -->
				<div class="weixinBtn">
					<div>其他方式注册</div>
					<navigator url="/pages/weixinRegister/weixinRegister" >
						<uni-icons type="weixin" color="#007AFF" size="30"></uni-icons>
					</navigator>
				</div>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>
<script>
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	import uniIcons from "@/components/uni-icons/uni-icons.vue"

	export default {
		data() {
			return {
				username: '',
				password: '',
				repeatPassword:'',
				tabList: [{
						name: '老师',
						icon: 'cuIcon-comment'
					},
					{
						name: '学生',
						icon: 'cuIcon-dianhua'
					},
					// {
					// 	name: '家长',
					// 	icon: 'cuIcon-wifi'
					// },
					{
						name: '管理员',
						icon: 'cuIcon-wifi'
					}
				],
				userType: 1,
				school:''
			};
		},
		components: {
			WucTab,
			uniIcons,
		},
		computed: {},
		onLoad() {
			this.school = uni.getStorageSync('school')
		},
		methods: {
			tabChange(index) {
				this.userType = index;
			},
			signUp() {
				
				//for(var i = 0;i<3;i++){
				// this.username = 'hhh'+i.toString();
				// this.password = '123456';
				// this.userType = 1;
				//window.alert(username);
				const {
					username,
					password,
					repeatPassword,
					userType,
				} = this
				if(repeatPassword !== password){
					uni.showModal({
						content: '两次密码不一致',
						showCancel: false
					})
					return 
				}
				if(username.indexOf('ls') && this.userType == 0){
					uni.showModal({
						content: '老师的注册方式请咨询管理员',
						showCancel: false
					})
					return 
				}
				if(username.indexOf('admin')  && this.userType == 2){
					uni.showModal({
						content: '您不是管理，请离开',
						showCancel: false
					})
					return 
				}
				console.log(userType);
				uni.showLoading({
					title: '注册中...'
				})
				
				//for(int i = 0; i < 10; 1++ ){
					
					
				
				uniCloud.callFunction({
					name: 'signUp',
					data: {
						username,
						password,
						userType,
					},
				}).then((res) => {
					uni.hideLoading()
					if (res.result.status !== 0) {
						return Promise.reject(new Error(res.result.msg))
					}
					uni.setStorageSync('token', res.result.token)
                    
                    uni.showToast({
                        icon:"none",
                        title:"注册成功，请重新登录",
                        success() {
                            uni.redirectTo({
                                url:"../login/login"
                            })
                        }
                    })
                    
                    
				}).catch((err) => {
					console.log(err);
					uni.hideLoading()
					uni.showModal({
						content: '注册失败，' + err.message,
						showCancel: false
					})
				})
				//}//循环
			},
			validateToken() {
				uni.showLoading({
					title: '加载中...'
				});
				uniCloud.callFunction({
					name: 'validateToken',
					data: {
						token: uni.getStorageSync('token')
					}
				}).then((res) => {
					console.log(res);
					uni.hideLoading()
					uni.showModal({
						content: res.result.msg,
						showCancel: false
					})
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: '请求云函数发生错误，' + err.message,
						showCancel: false
					})
				})
			},
		},
		onReady() {}
	};
</script>

<style>
	.weixinBtn{ color: #007AFF; text-align: center; font-size: 22upx; border-top: 1upx #333333 solid; margin-top: 50upx; padding-top: 50upx;}
	.weixinBtn div{ color: #333333; margin-bottom: 20upx;}
	.linkBtn{ color: #007AFF; text-align: right; font-size: 22upx;}
	.swiper{ height: 100upx;}
	.buttonGroup{ display: flex;}
	.swiper-title{ font-size: 30upx;}
	.buttonGroup button:nth-child(1){margin-right: 20upx;}
	.container {
		padding: 30px;
	}

	.title {
		text-align: center;
		font-size: 20px;
		font-weight: bold;
		padding: 20px 0px;
	}

	.desc {
		padding: 10px 0px;
		font-size: 14px;
		line-height: 22px;
		color: #999999;
	}

	.login-form input {
		height: 40px;
		border: solid 1px #DDDDDD;
		text-indent: 10px;
	}

	.login-form input,
	.login-form button {
		width: 100%;
		margin-bottom: 10px;
	}
</style>
