mui.init({
	swipeBack: false, //启用右滑关闭功能
	beforeback: function() {　　　
		mui.confirm("确定退出？", "<span style='font-style: oblique;'>ANDON</span>", ["取消", "确定"], function(e) {
			if(e.index == 1) {
				plus.runtime.quit();
			}
		}, 'div')
		return false;
	}
});
window.addEventListener('refreshNew', function(e) { //执行刷新
	mui.toast("刷新");
	location.reload(true);
});
new Vue({
	el: '#index',
	data: {
		workshopName: '',
		lineName: '',
		stationName: '',
		configObj: {},
		learIp: localStorage.getItem('learhost'),
		workshops: [],
		lines: [],
		stations: [],
		tempData: '',
	},
	mounted() {
		mui('.mui-scroll-wrapper').scroll({
			indicators: true
		})
		var _this = this;
		mui.plusReady(function() {
			var _isLogin = getLsItem("isLogin");
			var _isConfig = getLsItem("configData");
			if(_isLogin == null || _isLogin == undefined) {

			} else {
				mui.openWindow({
					url: 'apps/htmls/main.html',
					id: 'main'
				})
			}
			if(_isConfig == null || _isConfig == undefined || _isConfig == '{}') {

			} else {
				_this.configObj = JSON.parse(_isConfig);
				_this.workshopName = JSON.parse(_isConfig).workshop.factoryName
				_this.lineName = JSON.parse(_isConfig).line.lineName
				_this.stationName = JSON.parse(_isConfig).station == undefined ? '' : JSON.parse(_isConfig).station.stationName
			}
			_this.initData()
		})
	},
	methods: {
		initData() {
			var _this = this;
			if(this.learIp == null || this.learIp == '') {
				mui.toast("请设置账套！！！")
				return
			}
			mAjax(_url + 'Factory/showAll', {}, 'post', '数据加载中。。。', function(success) {
				if(success.code == 200) {
					_this.workshops = success.data
				} else {
					mui.toast(success.msg)
				}
			}, function(error) {
				mui.toast(error)
			})

		},
		//进入主界面
		onTapGoMain() {
			var _this = this;
			if(_this.learIp == null || _this.learIp == '') {
				var btnArray = ['设置账套', '取消'];
				mui.confirm(' ', '请设置账套', btnArray, function(e) {
					if(e.index == 0) {
						mui.openWindow({
							url: 'apps/htmls/setHost.html',
							id: 'setHost'
						});
					} else {}
				})
			} else {
				setLsItem("configData", JSON.stringify(_this.configObj))
				setLsItem("isLogin", 'true')
				mui.openWindow({
					url: 'apps/htmls/main.html',
					id: 'main'
				})
			}

		},
		//设置账套
		onTapGoSetHost() {
			mui.openWindow({
				url: 'apps/htmls/setHost.html',
				id: 'setHost'
			})
		},
		//选择
		onTapSelectPopover(type) {
			var _this = this;
			var _tempData = _this.tempData,
				_tempArr = [];
			mui('#' + type).popover('toggle')
			if(type == 'line') {
				_tempData = _this.tempData == '' ? _this.configObj.workshop : _this.tempData
				mAjax(_url + 'Line/showAll', {}, 'post', '数据加载中。。。', function(success) {
					if(success.code == 200) {
						success.data.forEach(function(item, index) {
							if(item.factoryId == _tempData.factoryNo) {
								_tempArr.push(item)
							}
						})
						_this.lines = _tempArr
					} else {
						mui.toast(success.msg)
					}
				}, function(error) {
					mui.toast(error)
				})
			}
			if(type == 'station') {
				_tempData = _this.tempData == '' ? _this.configObj.line : _this.tempData
				mAjax(_url + 'Station/showAll', {}, 'post', '数据加载中。。。', function(success) {
					if(success.code == 200) {
						success.data.forEach(function(item, index) {
							if(item.lineId == _tempData.lineNo) {
								_tempArr.push(item)
							}
						})
						_this.stations = _tempArr
					} else {
						mui.toast(success.msg)
					}
				}, function(error) {
					mui.toast(error)
				})
			}
		},
		//选择哪一个车间
		onItemSelectWorkshop(type, item, index) {
			this.configObj.workshop = item;
			this.tempData = item;
			this.workshopName = item.factoryName
			mui('#' + type).popover('toggle');

		},
		//选择哪一个产线
		onItemSelectLine(type, item, index) {
			this.configObj.line = item;
			this.tempData = item;
			this.lineName = item.lineName
			mui('#' + type).popover('toggle')
		},
		//选择哪一个工位
		onItemSelectStation(type, item, index) {
			this.configObj.station = item;
			this.stationName = item.name
			this.stationName = item.stationName
			mui('#' + type).popover('toggle')
		}
	}
})