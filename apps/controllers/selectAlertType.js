mui.init()
new Vue({
	el: '#alertType',
	data: {
		abnormals: []
	},
	mounted() {
		var _this = this;
		mui.plusReady(function() {
			mAjax(_url + 'AlertType/showAll', {}, 'post', "加载中。。。", function(success) {
				if(success.code == 200) {
					var res = [];
					var json = {};
					for(var i = 0; i < success.data.length; i++) {
						if(!json[success.data[i].alertName] && success.data[i].levelId == -1) {
							res.push({
								name: success.data[i].alertName,
								no: success.data[i].alertNo,
								id: success.data[i].alertTypeId //alertTypeId
							});
							json[success.data[i].alertName] = 1;
						}
					}
					for(var k = 0; k < res.length; k++) {
						var _arr2 = [];
						for(var i = 0; i < success.data.length; i++) {
							if(success.data[i].levelId == res[k].id) {
								if(success.data[i].remark == null || success.data[i].remark == undefined) {
									success.data[i].remark = '';
								}
								_arr2.push(success.data[i]);
								res[k].data = _arr2;
							}
						}
					}
					_this.abnormals = res
				}else{
					mui.toast(success.msg)
				}

			}, function(error) {
				mui.toast(error)
			})
		})
	},
	methods: {
		onTapSelectItem(abnormal, index) {
			setLsItem("alertBigType", JSON.stringify(abnormal));
			mui.openWindow({
				url: 'selectAlertDetails.html',
				id: 'selectAlertDetails'
			})
		}
	}
})