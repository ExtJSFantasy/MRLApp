mui.init({
	beforeback: function() {　　　　 //获得父页面的webview
		var list = plus.webview.currentWebview().opener();　　　　 //触发父页面的自定义事件(refresh),从而进行刷新
		mui.fire(list, 'refreshMain');
		//返回true,继续页面关闭逻辑
		return true;
	}
})
new Vue({
	el: '#station',
	data: {
		stations: []
	},
	mounted() {
		var _this = this;
		var _tempArr = [],
			_tempData = {};
		_tempData = JSON.parse(getLsItem("configData")).line;
		mui.plusReady(function() {
			mAjax(_url + 'Station/showAll', {}, 'post', '数据加载中。。。', function(success) {
				if(success.code == 200) {
					success.data.forEach(function(item, index) {
						if(item.lineId == _tempData.lineNo) {
							_tempArr.push(item)
						}
					})
					_this.stations = _tempArr
				} else {
					mui.toast(success)
				}
			}, function(error) {
				mui.toast(error)
			})
		})
	},
	methods: {
		onTapSelectItem(station, index) {
			setLsItem("selectStation", JSON.stringify(station))
			mui.openWindow({
				url: 'selectAlertType.html',
				id: 'selectAlertType'
			})
		}
	}
})