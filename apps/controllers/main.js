new Vue({
	el: '#main',
	data: {
		title: '待接警清单',
		wSearch: '',
		pSearch: '',
		cSearch: '',
		oSearch: '',
		selectIndex: 0,
		waitingLists: [],
		midWaitingLists: [],
		processLists: [],
		midProcessLists: [],
		confirmLists: [],
		midConfirmLists: [],
		overLists: [],
		midOverLists: [],
		selectItem: '',
		userName: '',
		pwd: ''
	},
	mounted() {
		var _this = this;
		mui.init({
			swipeBack: false,
			beforeback: function() {　　　
				var _isLogin = getLsItem("isLogin");
				if(_isLogin == "true") {
					mui.confirm("确定退出？", "<span style='font-style: oblique;'>ANDON</span>", ["取消", "确定"], function(e) {
						if(e.index == 1) {
							plus.runtime.quit();
						}
					}, 'div')
				}
				return false;
			}
		});
		window.addEventListener('refreshMain', function(e) { //执行刷新
			mui.toast("刷新");
			location.reload(true);
		});
		document.addEventListener("pause", function() {
			mui.toast('程序在后台运行');
		}, false);
		//加载数据
		document.addEventListener("resume", function() {

			_this.initData();
			mui.toast('程序在前台运行');
		}, false);
		mui('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		mui.plusReady(function() {
			_this.initData();
		})
	},
	methods: {
		initData() {
			var _this = this;
			var _waitingLists = [],
				_processLists = [],
				_confirmLists = [],
				_overLists = [];
			mAjax(_url + 'AlertDetail/showAll', {}, 'put', '数据加载中。。。', function(success) {
				if(success.code == 200) {
					success.data.forEach(function(item, index) {
						//待接警
						if(item.status == '0') {
							item.alertDate = FormatDateYMDHMS2(item.alertDate)
							item.overAlertTime = computeTimefunction(item.alertDate, new Date())
							_waitingLists.push(item)
						} else if(item.status == '1') {
							console.log(FormatDateYMDHMS2(item.receiveDate))
							//待处理
							item.receiveDate = FormatDateYMDHMS2(item.receiveDate)
							item.overAlertTime = computeTimefunction(item.receiveDate, new Date())
							item.overAlertTime1 = computeTimefunction(item.alertDate, item.receiveDate)
							_processLists.push(item)
						} else if(item.status == '2') {
							//待确认
							item.dealTime = FormatDateYMDHMS2(item.dealTime)
							item.overAlertTime = computeTimefunction(item.alertDate, item.receiveDate)
							item.overAlertTime1 = computeTimefunction(item.receiveDate, item.dealTime)
							item.overAlertTime2 = computeTimefunction(item.dealTime, new Date())
							_confirmLists.push(item)
						} else if(item.status == '3') {
							//已完成
							item.comfirmTime = FormatDateYMDHMS2(item.comfirmTime)
							item.overAlertTime = computeTimefunction(item.alertDate, item.receiveDate)
							item.overAlertTime1 = computeTimefunction(item.receiveDate, item.dealTime)
							item.overAlertTime2 = computeTimefunction(item.dealTime, item.comfirmTime)
							_overLists.push(item)
						}
					})
					_this.midWaitingLists = _waitingLists;
					_this.waitingLists = _waitingLists;
					_this.midProcessLists = _processLists
					_this.processLists = _processLists;
					_this.midConfirmLists = _confirmLists
					_this.confirmLists = _confirmLists;
					_this.midOverLists = _overLists
					_this.overLists = _overLists;
				} else {
					mui.toast(success.msg)
				}
			}, function(error) {
				mui.toast(error)
			})
		},

		//设置
		onTapSetting() {
			mui('.mui-popover').popover('toggle', document.getElementById("openPopover"));
		},
		//刷新
		onTapFresh() {
			window.location.reload(true)
		},
		onTapClearCache() {
			clearLs()
			var curr = plus.webview.currentWebview();
			var wvs = plus.webview.all();
			for(var i = 0, len = wvs.length; i < len; i++) {
				//关闭除setting页面外的其他页面
				if(wvs[i].getURL() == curr.getURL())
					continue;
				plus.webview.close(wvs[i]);
			}
			//打开index界面
			plus.webview.open('../../index.html');
			curr.close();
		},
		//tab切换
		onTapChangeTabbar(tabName) {
			var _this = this;
			this.title = tabName + "清单";
			switch(tabName) {
				case '待接警':
					_this.initData();
					break;
				case '待处理':
					_this.initData();
					break;
				case '待确认':
					_this.initData();
					break;
				case '已完成':
					_this.initData();
					break;
				default:
					break;
			}
		},
		//新增报警
		onTapNewAlert(tabName) {
			console.log();
			var _configData = JSON.parse(getLsItem("configData"));
			if(_configData.station == null || _configData.station == undefined) {
				mui.openWindow({
					url: "callAlerts/selectStation.html",
					id: "selectStation"
				})
			} else {
				mui.openWindow({
					url: "callAlerts/selectAlertType.html",
					id: "selectAlertType"
				})
			}

		},
		//点击待接警每一项
		onTapItem(type, wData, index) {
			var _obj = {};
			_obj.title = this.title;
			_obj.itemData = wData;
			setLsItem("tabData", JSON.stringify(_obj))
			mui.openWindow({
				url: 'dealAlerts/dealDetails.html',
				id: 'dealDetatls'
			})
		},
		//删除
		onTapDeleteItem(type, data, index) {
			var _this = this;
			_this.selectIndex = index;
			_this.selectItem = data;
			if(type == "待接警") {
				mui('#receiveAlert').popover('toggle')
				_this.waitingLists.forEach(function(item, index) {
					if(item.id == data.id) {
						document.getElementById("openOption" + item.id).style.backgroundColor = 'rgba(102, 254, 203, 1)';
					} else {
						document.getElementById("openOption" + item.id).style.backgroundColor = 'transparent'
					}
				})

				/*mui.confirm("确定删除？", "<span style='font-style: oblique;'>ANDON</span>", ["取消", "确定"], function(e) {
					if(e.index == 1) {
						_this.waitingLists.forEach(function(itemInner, index) {
							document.getElementById("openOption" + itemInner.id).style.backgroundColor = 'transparent'
						})
						_this.waitingLists.splice(index, 1);
					} else {
						document.getElementById("openOption" + data.id).style.backgroundColor = 'transparent'
					}
				}, 'div')*/
			}

		},
		//待接警查询
		onWaitingSearch() {
			var _this = this;
			if(_this.title == "待接警清单") {
				var _waitingLists = _this.midWaitingLists; //_this.users;
				var _search = _this.wSearch.trim();
				if(_search != '') {
					var _arr = _waitingLists.filter(function(item) {
						return item.alertType1Name.indexOf(_search) > -1 || item.stationName.indexOf(_search) > -1 || item.alertUserName.indexOf(_search) > -1;
					});
					//return _arr
					_this.waitingLists = _arr;
				} else {
					_this.initData()
				}
			} else if(_this.title == "待处理清单") {
				var _paitingLists = _this.midProcessLists; //_this.users;
				var _search = _this.pSearch.trim();
				if(_search != '') {
					var _arr = _paitingLists.filter(function(item) {
						return item.alertType1Name.indexOf(_search) > -1 || item.stationName.indexOf(_search) > -1 || item.receiveAlerterName.indexOf(_search) > -1 || item.receiveAlerter.indexOf(_search) > -1;
					});
					//return _arr
					_this.processLists = _arr;
				} else {
					_this.initData()
				}

			} else if(_this.title == "待确认清单") {
				var _midConfirmLists = _this.midConfirmLists; //_this.users;
				var _search = _this.cSearch.trim();
				if(_search != '') {
					var _arr = _midConfirmLists.filter(function(item) {
						return item.alertType1Name.indexOf(_search) > -1 || item.stationName.indexOf(_search) > -1 || item.dealUser.indexOf(_search) > -1 || item.receiveAlerter.indexOf(_search) > -1;
					});
					//return _arr
					_this.confirmLists = _arr;
				} else {
					_this.initData()
				}
			} else if(_this.title == "已完成清单") {
				var _midOverLists = _this.midOverLists; //_this.users;
				var _search = _this.oSearch.trim();
				if(_search != '') {
					var _arr = _midOverLists.filter(function(item) {
						return item.alertType1Name.indexOf(_search) > -1 || item.stationName.indexOf(_search) > -1 || item.comfirmer.indexOf(_search) > -1;
					});
					_this.overLists = _arr;
				} else {
					_this.initData()
				}
			}
		},
		onTapUpQuick(type, data, index) {

		},
		//跳转index界面
		onTapGoIndex() {
			removeLsItem("isLogin");
			var curr = plus.webview.currentWebview();
			var wvs = plus.webview.all();
			for(var i = 0, len = wvs.length; i < len; i++) {
				//关闭除setting页面外的其他页面
				if(wvs[i].getURL() == curr.getURL())
					continue;
				plus.webview.close(wvs[i]);
			}
			//打开index界面
			plus.webview.open('../../index.html');
			curr.close();
		},
		onTapCancelAlert() {
			var _this = this;
			mAjax(_url + 'AlertDetail/' + parseInt(_this.selectItem.alertDetailId), {
				"userNo": _this.userName,
				"password": _this.pwd
			}, 'delete', "删除中。。。", function(success) {
				if(success.code == 200) {
					_this.userName = '';
					_this.pwd = '';
					mui('#receiveAlert').popover('toggle')
					_this.waitingLists.forEach(function(itemInner, index) {
						document.getElementById("openOption" + itemInner.id).style.backgroundColor = 'transparent'
					})
					_this.initData()
				} else if(success.code == 201) {
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