mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: true, //默认为false
		longtap: true, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: true, //默认为false，不监听
		release: true //默认为false，不监听
	}
})
new Vue({
	el: '#station',
	data: {
		title: "接警",
		isFirst: false,
		isSecond: false,
		isThird: false,
		isCall: false,
		isReceive: false,
		isOver: false,
		receiveVal: '',
		upQuestion: '',
		cancelVal: '',
		isActiveOne: false,
		isActiveTwo: false,
		isActiveThree: false,
		isActiveBtn: false,
		stations: [],
		userName: '',
		pwd: '',
		userName1: '',
		pwd1: '',
		userName2: '',
		pwd2: '',
		dataInfo: {},
		selectBtn: ''
	},
	mounted() {
		var _this = this;
		_this.dataInfo = JSON.parse(getLsItem("tabData")).itemData
		document.addEventListener("pause", function() {
			console.log("应用从前台切换到后台");
			mui.toast('程序在后台运行');
		}, false);
		document.addEventListener("resume", function() {
			console.log("应用从后台切换到前台");
			mui.toast('程序在前台运行');
		}, false);
		var _title = JSON.parse(getLsItem("tabData")).title;
		_this.title = _title.substring(0, _title.length - 2)
		switch(_title) {
			case '待接警清单':
				console.log(4234234)
				_this.isCall = true;
				_this.isFirst = true
				_this.isThird = true;
				_this.isActiveOne = true
				_this.isActiveBtn = true;
				_this.receiveVal = '接警'
				_this.cancelVal = '误报警'
				break;
			case '待处理清单':
				console.log(4234234)
				_this.isFirst = true
				_this.isSecond = true
				_this.isThird = true
				_this.isCall = true;
				_this.isReceive = true
				_this.isActiveBtn = true;
				_this.isActiveTwo = true;
				_this.receiveVal = '处理'
				_this.upQuestion = '上升报警'
				_this.cancelVal = '撤消'
				break;
			case '待确认清单':
				_this.isFirst = true
				_this.isThird = true
				_this.isCall = true;
				_this.isReceive = true
				_this.isOver = true
				_this.isActiveBtn = true;
				_this.isActiveThree = true;
				_this.receiveVal = '确认'
				_this.cancelVal = '撤消'
				break;
			case '已完成清单':
				console.log(4234234)
				_this.isThird = true;
				_this.isCall = true;
				_this.isReceive = true
				_this.isOver = true
				//_this.receiveVal = '接警'
				_this.cancelVal = '撤消'
				break;
			default:
				break;
		}
	},
	methods: {
		//长摁，提示
		onLongTapPopover(status) {
			mui('#showDealPopover').popover('toggle', document.getElementById(status))
		},
		//点击头像。查看这个人的个人信息，或者是这个人处理的历史记录
		onTapSelfLogo() {
			mui.toast("您点击了头像")
		},
		//第一个按钮
		onTapBtnOne() {
			var _this = this;
			_this.selectBtn = 1
			//根据按钮的文字处理不同的信息 
			if(_this.receiveVal == '接警') {
				mui('#ensure').popover('toggle')
			} else if(_this.receiveVal == '处理') {
				mui.openWindow({
					url: 'handlingDetails.html',
					id: 'handlingDetails'
				})
			} else if(_this.receiveVal == '确认') {
				mui('#ensure').popover('toggle')
			}
		},
		//第二个按钮
		onTapBtnTwo() {
			var _this = this;
			_this.selectBtn = 2
			mui('#ensure').popover('toggle')
		},
		//第三个按钮
		onTapBtnThree() {
			var _this = this;
			_this.selectBtn = 3
			if(_this.cancelVal == '误报警') {
				mui('#ensure').popover('toggle')
			} else if(_this.cancelVal == '撤消') {
				mui('#ensure').popover('toggle')
			}
		},
		//人员popover
		onTapGoAlert() {
			var _this = this;
			var _itemData = JSON.parse(getLsItem("tabData")).itemData
			if(_this.selectBtn == 1) {
				if(_this.receiveVal == '接警') {
					_this.updateDealAjax(1)
					return
				} else if(_this.receiveVal == '确认') {
					_this.updateDealAjax(3)
					return
				}
			} else if(_this.selectBtn == 2) {
				if(_this.upQuestion == '上升报警') {
					mAjax(_url + 'AlertDetail/upAlertDetail/' + parseInt(_itemData.alertDetailId), {
						"userNo": _this.userName,
						"password": _this.pwd
					}, 'post', "上升中。。。", function(success) {
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
							plus.webview.open('../main.html', 'main', {}, "slide-in-left", 1000);
							//plus.webview.open( url, id, styles, aniShow, duration, showedCB );
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
			} else if(_this.selectBtn == 3) {
				if(_this.cancelVal == '误报警') {
					mAjax(_url + 'AlertDetail/' + parseInt(_itemData.alertDetailId), {
						"userNo": _this.userName,
						"password": _this.pwd
					}, 'delete', "删除中。。。", function(success) {
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
							plus.webview.open('../main.html', 'main',{},"slide-in-left", 1000);
							curr.close();
						} else if(success.code == 204) {
							mui.toast(success.msg)
						} else {
							mui.toast(success.msg)
						}
					}, function(error) {
						mui.toast(JSON.stringify(error))
					})
					return
				} else if(_this.cancelVal == '撤消') {
					if(_itemData.status == 1) {
						_this.updateCancelAjax(0)
						return
					} else if(_itemData.status == 2) {
						_this.updateCancelAjax(1)
						return
					} else if(_itemData.status == 3) {
						_this.updateCancelAjax(2)
						return
					}

				}
			}
		},
		onTapGoAlert1() {

		},
		onTapGoAlert2() {

		},
		//快反按钮
		onTapUpQuick(index) {
			setTimeout(function() {
				mui.swipeoutClose(document.querySelectorAll(".callIndex")[index]);
			}, 0);
			mui.toast("快反")
		},
		//晨会
		onTapMorningMeeting(index) {
			setTimeout(function() {
				mui.swipeoutClose(document.querySelectorAll(".callIndex")[index]);
			}, 0);
			mui.toast("MorningMeeting")
		},
		updateDealAjax(nowStatus) {
			var _this = this;
			var _itemData = JSON.parse(getLsItem("tabData")).itemData
			mAjax(_url + 'AlertDetail/' + parseInt(_itemData.alertDetailId), {
				"userNo": _this.userName,
				"password": _this.pwd,
				"status": parseInt(nowStatus)
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
					plus.webview.open('../main.html', 'main',{},"slide-in-left", 1000);
					curr.close();
				} else if(success.code == 204) {
					mui.toast(success.msg)
				} else {
					mui.toast(success.msg)
				}
			}, function(error) {
				mui.toast(JSON.stringify(error))
			})
		},
		updateCancelAjax(nowStatus) {
			var _this = this;
			var _itemData = JSON.parse(getLsItem("tabData")).itemData
			mAjax(_url + 'AlertDetail/undoAlertDetail/' + parseInt(_itemData.alertDetailId), {
				"userNo": _this.userName,
				"password": _this.pwd,
				"status": parseInt(nowStatus)
			}, 'post', "撤消中。。。", function(success) {
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
					plus.webview.open('../main.html', 'main',{},"slide-in-left", 1000);
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