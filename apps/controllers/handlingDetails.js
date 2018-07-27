new Vue({
	el: '#details',
	data: {
		details: [],
		actionMeasure: '',
		checkTime: '',
		userName: '',
		pwd: ''
	},
	mounted() {
		mui.init()
		this.initData()
	},
	methods: {
		//初始化数据
		initData: function() {
			var _this = this;
			/**
			 * {} 年月日时分
			 * date 年月日
			 * time 时间
			 */
			selectDate('{}', 'checkTime', '', function(data) {
				_this.checkTime = data.y.value + "-" + data.m.value + "-" + data.d.value + " " + data.h.value + ":" + data.i.value;
			});
		},
		onTapSelectItem(abnormal, index) {

		},
		onTapAlertPopover() {
			mui('#ensure').popover('toggle')
		},
		onTapGoAlert() {
			var _this = this;
			var _itemData = JSON.parse(getLsItem("tabData")).itemData
			mAjax(_url + 'AlertDetail/' + parseInt(_itemData.alertDetailId), {
				"userNo": _this.userName,
				"password": _this.pwd,
				"status": parseInt(2),
				"dealAction": _this.actionMeasure
			}, 'put', "处理中。。。", function(success) {
				if(success.code == 200) {
					mui('#ensure').popover('toggle')
					var curr = plus.webview.currentWebview();
					var wvs = plus.webview.all();
					for(var i = 0, len = wvs.length; i < len; i++) {
						//关闭除setting页面外的其他页面
						if(wvs[i].getURL() == curr.getURL())
							continue;
						plus.webview.close(wvs[i]);
					}
					//打开index界面
					plus.webview.open('../main.html', 'main', '', 'slide-in-right', 200, function() {});
					curr.close();
				} else if(success.code == 204) {
					mui.toast(success.msg)
				} else {
					mui.toast(success.msg)
				}
			}, function(error) {
				mui.toast(JSON.stringify(error))
			})
		}
	}
})