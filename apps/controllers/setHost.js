var _app = new Vue({
	el: '#setting',
	data: {
		hosts: [{
			id: 1,
			ip: 'http://172.32.25.253:8888/TNserverone/',
			isdemo: false
		}],
		newIp: ''
	},
	mounted: function() {
		var _this = this;
		mui.init({
			beforeback: function() {　　　　 //获得父页面的webview
				var list = plus.webview.currentWebview().opener();　　　　 //触发父页面的自定义事件(refresh),从而进行刷新
				mui.fire(list, 'refreshNew');
				//返回true,继续页面关闭逻辑
				return true;
			}
		})
		if(localStorage.getItem('learhosts') == null || localStorage.getItem('learhosts') == '') {
			for(var i = 0; i < _this.hosts.length; i++) {
				if(_this.hosts[i].ip == localStorage.getItem('learhost')) {
					_this.hosts[i].isdemo = true;
				}
			}
		} else {
			_this.hosts = JSON.parse(localStorage.getItem('learhosts'));
			for(var i = 0; i < _this.hosts.length; i++) {
				if(_this.hosts[i].ip == localStorage.getItem('learhost')) {
					_this.hosts[i].isdemo = true;
				}
			}
		}

	},
	methods: {
		changeHost: function(host) {
			localStorage.setItem("learhost", host);
		},
		onTapSetting: function() {
			mui.back();
		},
		onTapPlus: function() {
			var _this = this;
			var btnArray = ['确定', '取消'];
			mui.prompt(' ', 'http://10.71.96.236:8080', '请输入IP', btnArray, function(e) {
				if(e.index == 0) {
					_this.hosts.push({
						id: (_this.hosts.length + 1),
						ip: _this.formatHost(e.value)
					});
					localStorage.setItem("learhosts", JSON.stringify(_this.hosts));
				} else {

				}
			})
		},
		updateHost: function(host, index) {
			var _this = this;
			var btnArray = ['确定', '取消'];
			mui.prompt(' ', 'http://101.227.66.87:8080/EQMS', '访问地址', btnArray, function(e) {
				if(e.index == 0) {
					if(e.value == '' || e.value == null) {
						mui.toast("请输入有效访问地址");
					} else {
						setTimeout(function() {
							mui.swipeoutClose(document.getElementById('slider' + host.id));
						}, 0);
						_this.hosts[index].ip = e.value;
						if(host.isdemo) {
							localStorage.setItem("learhost", e.value);
						}

						localStorage.setItem("learhosts", JSON.stringify(_this.hosts));
					}
				} else {
					setTimeout(function() {
						mui.swipeoutClose(document.getElementById('slider' + host.id));
					}, 0);
					mui.toast('您取消了输入');
				}
			}, 'div');
			console.log(document.querySelector('.mui-popup-input input'));
			document.querySelector('.mui-popup-input input').value = host.ip;
		},
		deletItem: function(host, index) {
			var _this = this;
			setTimeout(function() {
				//mui.swipeoutClose(document.getElementById('slider' + host.id));
				mui.swipeoutClose(document.querySelectorAll(".classTem")[index]);
			}, 0);
			var _arr = _this.hosts.splice(index, 1);
			console.log(_this.hosts);

			if(host.isdemo) {
				_this.hosts.forEach(function(item, index) {
					item.isdemo = false;
				})
			}
			localStorage.setItem("learhosts", JSON.stringify(_this.hosts));

		},
		formatHost: function(value) {
			if(value.length > 0 && value.substr(value.length - 1, 1) != '/')
				value += '/';
			if(value.length > 0 && !/^(http|https):\/\//i.test(value))
				value = 'http://' + value;
			return value;
		}
	}
})