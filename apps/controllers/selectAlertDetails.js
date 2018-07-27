mui.init()
new Vue({
	el: '#details',
	data: {
		details: [],
		actionMeasure: '',
		smallType: '',
		userName: '',
		pwd: ''
	},
	mounted() {
		mui.plusReady(function() {})
		console.log(getLsItem('alertBigType'))
		this.details = JSON.parse(getLsItem('alertBigType')).data;
	},
	methods: {
		onTapSelectItem(detail, index) {
			var _this = this;
			_this.smallType = detail;
			_this.details.forEach(function(item, index) {
				if(item.id == detail.id) {
					document.getElementById("openOption" + item.id).style.backgroundColor = 'rgba(102, 254, 203, 1)';
				} else {
					document.getElementById("openOption" + item.id).style.backgroundColor = 'rgba(0, 30, 68, 1)';
				}
			})
		},
		onTapAlertPopover() {
			if(this.smallType == '') {
				mui.toast("请选择报警小类")
				return
			}
			mui('#ensure').popover('toggle')
		},
		onTapGoAlert() {
			var _this = this;
			var _configData = JSON.parse(getLsItem("configData"))
			var _selectStation = _configData.station == undefined ? JSON.parse(getLsItem("selectStation")) : _configData.station
			var _alertBigType = JSON.parse(getLsItem("alertBigType"))

			mAjax(_url + 'AlertDetail/save', {
				"userNo": _this.userName,
				"password": _this.pwd,
				"factoryId": parseInt(_configData.workshop.factoryId),
				"lineId": parseInt(_configData.line.lineId),
				"stationId": parseInt(_selectStation.stationId),
				"alertUser": _this.userName,
				"alertType1Id": parseInt(_alertBigType.id),
				"alertType2Id": parseInt(_this.smallType.alertTypeId),
				"description": _this.actionMeasure,
				"status": parseInt(0)
			}, 'post', "提交中。。。", function(success) {
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
			}, function(error) {
				console.log(JSON.stringify(error))
				mui.toast(JSON.stringify(error))
			})
			mui('#ensure').popover('toggle')
		}
	}
})