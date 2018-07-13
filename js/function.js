/**
 * 
 * @param {Object} _url					请求路径
 * @param {Object} params				参数
 * @param {Object} type					请求类型 post,get
 * @param {Object} showText				抓取或提交时的提示
 * @param {Object} successCallback		成功回调
 * @param {Object} errCallback			失败回调
 */
function mAjax(_url, params, type, showText, successCallback, errCallback) {
	mui.ajax(_url, {
		data: params,
		dataType: 'json', //服务器返回json格式数据
		type: type, //HTTP请求类型
		//timeout: 10000, //超时时间设置为10秒；
		headers: {
			'Content-Type': 'application/json'
		},
		beforeSend: function(xhr) {
			//xhr.setRequestHeader("Authorization", _token_type + " " + _accessToken);
			plus.nativeUI.showWaiting(showText);
		},
		complete: function() {
			//_this.isShow2 = false;
			plus.nativeUI.closeWaiting();
		},
		success: function(data) {
			successCallback(data)
		},
		error: function(xhr, type, errorThrown) {
			plus.nativeUI.closeWaiting();
			errCallback(xhr, type, errorThrown)
		}
	});
}
//包含
function arrContain(arr, e) {
	for(i = 0; i < arr.length; i++) {
		if(arr[i].nokFormData.itemSubId == e)
			return true;
	}
	return false;
}
/**
 * 格式化，ip
 * */
function formatHost(value) {
	if(value.length > 0 && value.substr(value.length - 1, 1) != '/')
		value += '/';
	if(value.length > 0 && !/^(http|https):\/\//i.test(value))
		value = 'http://' + value;
	return value;
}

function FormatDateYM(strtime) {
	//console.log(123456);
	var date = new Date(strtime);
	return date.getFullYear() + "-" + ((date.getMonth() < 9 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)));
}

function FormatDateYMD(strtime) {
	//console.log(strtime);
	//	if(strtime == ''){
	//	return ''
	//	}
	var date = new Date(strtime);
	return date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
}

function FormatDateYMDHMS(strtime) {
	var date = new Date(strtime);
	return date.getFullYear() + "-" + (((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1))) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "T" + (date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds());
}

function FormatDateYMDHMS2(strtime) {
	var date = new Date(strtime);
	return date.getFullYear() + "-" + (((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1))) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + " " + (date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds());
}
/**
 * 创建iframe
 * @param {Object} el
 * @param {Object} opt
 */
function createIframe(el, opt) {
	var elContainer = document.querySelector(el);
	var wrapper = document.querySelector(".mui-iframe-wrapper");
	if(!wrapper) {
		// 创建wrapper 和 iframe
		wrapper = document.createElement('div');
		wrapper.className = 'mui-iframe-wrapper';
		for(var i in opt.style) {
			wrapper.style[i] = opt.style[i];
		}
		var iframe = document.createElement('iframe');
		iframe.src = opt.url;
		iframe.id = opt.id || opt.url;
		iframe.name = opt.id || opt.url;
		wrapper.appendChild(iframe);
		elContainer.appendChild(wrapper);
	} else {
		var iframe = wrapper.querySelector('iframe');
		iframe.src = opt.url;
		iframe.id = opt.id || opt.url;
		iframe.name = iframe.id || opt.url;
	}
}
/**
 * 打开写入log日志。离线打包无效
 * 	V — Verbose (lowest priority) 对应于Log.i()系列函数
	D — Debug 对应于Log.d()系列函数
	I — Info 对应于Log.i()系列函数
	W — Warning 对应于Log.w()系列函数
	E — Error 对应于Log.e()系列函数
	F — Fatal 对应于Log.wtf()系列函数
 * adb logcat -d > d:/logcat.txt 在d盘下会有logcat.txt文本
 * 
 * console.log
 */
function openLog() {
	plus.navigator.setLogs(true);
}
/**
 * 关闭log。正式上线
 */
function closeLog() {
	plus.navigator.setLogs(false);
}
/**
 * log的唯一标识
 * e 内容
 * */
function writeLog(obj, e) {
	console.log(obj + "-----" + e);
}
// 是否为电话号码
function isMobile(value) {
	var validateReg = /0?(13|14|15|18)[0-9]{9}/;
	return validateReg.test(value);
}

// 是否为空
function isEmpty(value) {
	var validateReg = /^\S+$/;
	return validateReg.test(value);
}
/**
 * 原生拨打电话，只适用android
 */
function call(tel) {
	// 导入Activity、Intent类
	var Intent = plus.android.importClass("android.content.Intent");
	var Uri = plus.android.importClass("android.net.Uri");
	// 获取主Activity对象的实例
	var main = plus.android.runtimeMainActivity();
	// 创建Intent
	var uri = Uri.parse("tel:" + tel); // 这里可修改电话号码
	var call = new Intent("android.intent.action.CALL", uri);
	// 调用startActivity方法拨打电话
	main.startActivity(call);
	// ...
}
/**
 * 发送邮件
 * */
function sendMail() {
	var msg = plus.messaging.createMessage(plus.messaging.TYPE_EMAIL);
	msg.to = ['791456587@qq.com']; //收件人
	//msg.cc = ['test@163.com', 'test@173.com'];		//抄送人
	//msg.bcc = ['791456587@163.com',];					//暗送人
	//msg.addAttachment("_www/a.doc");					//添加附件
	msg.subject = '测试邮件';
	msg.body = 'This is Pandora example test message';
	msg.silent = true; // 设置为使用静默方式发送
	plus.messaging.sendMessage(msg
		/* function () {
				
				mui.toast("发送成功");
			}, function () {
				mui.toast( "Send failed!" );
			} */
	);
}
//短信
function smsTest() {
	var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
	msg.to = ['18611497504', '15811140520'];
	msg.body = 'This is HTML5 Plus example test message';
	plus.messaging.sendMessage(msg);
}
/**
 *  调用此属性获取设备的唯一标识号
 * */
function getUUID() {
	/*var mainActivity = plus.android.runtimeMainActivity();
    var Settings= plus.android.importClass("android.provider.Settings");
    return Settings.Secure.getString(mainActivity.getContentResolver(),Settings.Secure.ANDROID_ID);*/
	//console.log(Settings.Secure.getString(mainActivity.getContentResolver(),Settings.Secure.ANDROID_ID));
	return plus.device.uuid
}
/*-------------------------------------------*/
/**
 * NativJS获取当前网速
 * */
/**
 * 核心方法
 */
function getNetSpeed() {
	var TrafficStats; //TrafficStats类实例对象
	var total_data; //总共接收到的流量
	var traffic_data; //一定时间内接收到的流量
	var intervalId; //定时器的返回值，用于控制计时器的停止
	TrafficStats = plus.android.importClass("android.net.TrafficStats");
	total_data = TrafficStats.getTotalRxBytes();
	//intervalId = window.setInterval("getNetSpeed()", 1000);

	traffic_data = TrafficStats.getTotalRxBytes() - total_data;
	total_data = TrafficStats.getTotalRxBytes();
	return bytesToSize(traffic_data);
	//document.getElementById("net").value = bytesToSize(traffic_data);
	console.log(bytesToSize(traffic_data));
}

//将byte自动转换为其他单位
function bytesToSize(bytes) {
	if(bytes === 0) return '0 B/s';
	var k = 1000, // or 1024
		sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return(bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
/*-------------------------------------------*/

/*-----------------------------------------------------------*/
/*function getCacheSize(){
	
	plus.cache.calculate( function ( size ) {
		console.log(size);
		var _size = size;
		return _size
	});
	
}*/
/**
 * 计算初始化的缓存值
 */
function initCacheSize() {
	var formatedSize;
	var cacheCaleState = false; //缓存状态
	if(os == "Android") {
		formatedSize = formatSize(calcCache4Android());
		cacheCaleState = true;
		//cacheDomChild.innerHTML="清除缓存<span class='mui-badge '>" + formatedSize + "</span>";
	} else if(os == "iOS") {
		calcCache(function(size) {
			cacheCaleState = true;
			formatedSize = formatSize(size);
			//cacheDomChild.innerHTML="清除缓存<span class='mui-badge '>" + formatedSize + "</span>";
		});
	} else {
		mui.toast("未知的设备类型,无法计算缓存");
		cacheCaleState = false;
	}
	return formatedSize
}
/**
 * 计算缓存大小  官方提供方法，用于iOS
 */
function calcCache(callback) {
	console.log("开始计算缓存大小");
	var finalSize = -1;
	plus.cache.calculate(function(size) {
		console.log(size + "byte");
		var sizeInt = parseInt(size);
		console.log("sizeInt" + sizeInt);
		return callback(finalSize);
	});

}

function calcCache4Android() {
	var cacheSize = 0;
	console.log("start calc android");
	var sdRoot = main.getCacheDir();
	var files = plus.android.invoke(sdRoot, "listFiles");
	cacheSize += getFolderSize(files);
	console.log("android size-->" + cacheSize);
	return cacheSize;
}

function getFolderSize(files) {
	var size = 0;
	var len = files.length;
	for(var i = 0; i < len; i++) {
		// 如果下面还有文件
		if(files[i].isDirectory()) {
			size = size + getFolderSize(files[i]);
		} else if(!files[i].isHidden()) {
			size = size + files[i].length();
		}
	}
	return size;
}
/**
 * 清除缓存  
 */
function clearCache(callback) {
	plus.storage.clear();
	plus.cache.clear(function() {
		console.log("清除了~~~return");
		return callback();
	});
}

function clearAllCache4Android(main, callback) {
	console.log("清理所有缓存");
	console.log("main" + main.getCacheDir());
	var sdRoot = main.getCacheDir();
	var files = plus.android.invoke(sdRoot, "listFiles");
	deleteDir(files);
	//再次计算缓存大小
	callback(initCacheSize());
}

function deleteDir(files) {
	var len = files.length;
	console.log("len:" + len);
	for(var i = 0; i < len; i++) {
		console.log("delete file dir:" + files[i]);
		files[i].delete();
	}
}

function formatSize(size) {
	var fileSizeString;
	size = parseInt(size);
	console.log("我是size" + size);
	if(size == 0) {
		fileSizeString = "0B";
	} else if(size < 1024) {
		fileSizeString = size + "B";
	} else if(size < 1048576) {
		fileSizeString = (size / 1024).toFixed(2) + "KB";
	} else if(size < 1073741824) {
		console.log("Mb" + size);
		fileSizeString = (size / 1048576).toFixed(2) + "MB";
		console.log("/ after" + fileSizeString);
	} else {
		fileSizeString = (size / 1073741824).toFixed(2) + "GB";
	}
	return fileSizeString;
}
/*-------------------------------------------------------------------*/
function dateFormat(date, formatStr) {
	var str = formatStr;
	var Week = ['日', '一', '二', '三', '四', '五', '六'];

	str = str.replace(/yyyy|YYYY/, date.getFullYear());
	str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));

	str = str.replace(/MM/, (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
	str = str.replace(/M/g, (date.getMonth() + 1));

	str = str.replace(/w|W/g, Week[date.getDay()]);

	str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
	str = str.replace(/d|D/g, date.getDate());

	str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
	str = str.replace(/h|H/g, date.getHours());
	str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
	str = str.replace(/m/g, date.getMinutes());

	str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
	str = str.replace(/s|S/g, date.getSeconds());

	return str;
}

//获取配置信息
function getConfig() {
	return window.config;
}

//获取appTitle
function getAppName() {
	console.log();
	return getConfig().appTitle;
}

/****************************LocalStorage操作********************************/
/**
 * 获取localStorage存储的key，前面加上MES-
 * @param  {String} key 原始key
 * @return {String}     前面加了MES-的key
 */
function getLsKey(key) {
	if(key == null) return '';
	return getAppName() + '-' + key;
}
/**
 * 根据key获取localStorage的值
 * @param  {String} key 键
 * @return {String}     值
 */
function getLsItem(key) {
	return localStorage.getItem(this.getLsKey(key));
}
/**
 * 根据key获取localStorage的值
 * @param  {String} key 键
 * @param  {String} value 值
 */
function setLsItem(key, value) {
	localStorage.setItem(this.getLsKey(key), value);
}
/**
 * 根据key移除localStorage的值
 * @param  {String} key 键
 */
function removeLsItem(key) {
	localStorage.removeItem(this.getLsKey(key));
}
/**
 * 清空缓存
 */
function clearLs() {
	localStorage.clear();
}

//初始化访问地址
function initHost() {
	//判断缓存中是否存在host
	console.log(getLsItem("host"));
	var _host = getLsItem("host");
	console.log(_host);
	if(_host == null || _host == '') {
		var hosts = getConfig().initialServers;
		hosts.forEach(function(value, index, array) {
			if(value.isdemo) {
				setLsItem("host", JSON.stringify(value.host))
			}
		});
	}
	/*else{
			var hosts = getConfig().initialServers;
			hosts.forEach(function(value, index, array){
				if(value.isdemo){
					value.host = _host
				}
			});
		}*/
	//console.log(JSON.parse(getConfig().initialServers[0]));
	//return getConfig().initialServers[0].host
}

//获取单选按钮值
function getRadioRes(className) {
	var rdsObj = document.getElementsByClassName(className);
	var checkVal = null;
	for(i = 0; i < rdsObj.length; i++) {
		if(rdsObj[i].checked) {
			checkVal = rdsObj[i].value;
		}
	}
	return checkVal;
}

//右滑返回
function touClass() {
	// 公有方法
	this.touch = function(fn1, fn2) {
		this.addEventListener('touchstart', function(event) {
			var touch = event.targetTouches[0];
			// 开始坐标
			this.startx = touch.pageX;
			this.starty = touch.pageY;
		})
		this.addEventListener('touchmove', function(event) {
			var touch = event.targetTouches[0];
			// 结束坐标
			this.endx = touch.pageX;
			this.endy = touch.pageY;
			var x = this.endx - this.startx;
			var y = this.endy - this.starty;
			var w = x < 0 ? x - 1 : x; //x轴的滑动值, w为x的绝对值
			var h = y < 0 ? y - 1 : y; //y轴的滑动值
			if(w > h) { //如果是在x轴中滑动,阻止默认事件
				event.preventDefault(); // 解决微信touchmove冲突并实现上下可滑动
			}
		})
		this.addEventListener('touchend', function(event) {
			if((this.startx - this.endx) >= 100 && fn1) {
				// 执行左滑回调
				fn1();
			}
			if((this.endx - this.startx) >= 100 && fn2) {
				// 执行右滑回调
				fn2();
			}
		})
	}
}

//将图片压缩转成base64 
function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	var width = img.width;
	var height = img.height;
	// calculate the width and height, constraining the proportions 
	if(width > height) {
		if(width > 100) {
			height = Math.round(height *= 100 / width);
			width = 100;
		}
	} else {
		if(height > 100) {
			width = Math.round(width *= 100 / height);
			height = 100;
		}
	}
	canvas.width = width; /*设置新的图片的宽度*/
	canvas.height = height; /*设置新的图片的长度*/
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height); /*绘图*/
	var dataURL = canvas.toDataURL("image/png", 0.8);
	return dataURL.replace("data:image/png;base64,", "");
}

//自动检查更新
/*
 * json格式：
 * 	{
		"state": "yes",
    	"mark": "1.0.6",
    	"url": "http:\/\/192.168.3.171:9999\/middol\/H5696B796_0307145309.apk"
	}
 **/
function svn(t) {
	var xhr_svn = new plus.net.XMLHttpRequest();
	xhr_svn.onreadystatechange = function() {
		if(xhr_svn.readyState == 4) {
			if(xhr_svn.status == 200) {
				var res = JSON.parse(xhr_svn.responseText);
				if(res.state == 'yes') {
					if(res.mark != t) {
						var upr;
						plus.nativeUI.confirm("有新版本发布了，是否件更新？", function(e) {
							upr = (e.index == 0) ? "Y" : "N";
							if(upr == "Y") {
								var wt = plus.nativeUI.showWaiting('下载更新中，请勿关闭');
								var url = res.url; // 下载文件地址  
								var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
									if(status == 200) { // 下载成功 
										var path = d.filename;
										plus.runtime.install(path);
									} else { //下载失败 
										alert("Download failed: " + status);
									}
								});
								dtask.start();
							} else {

							}
						}, "EQMS系统", ["确认", "取消"]);
					} else {
						console.log('最新');
					}
				}
			} else {
				//              plus.nativeUI.toast("网络连接错误！");
				console.log("网络连接错误！");
			}
		}
	}
	xhr_svn.open("GET", "http:\/\/192.168.75.223:8080\/updateAndroid\/hst.apk"); //这里的地址是上面json文件的地址  192.168.20.88:8089
	xhr_svn.send();
}
/**
 * 字符串数据保存为xml
 * @param {Object} string	数据源
 * @param {Object} amp
 * @param {Object} lt
 * @param {Object} gt
 * @param {Object} quot
 * @param {Object} apos
 * @param {Object} cr
 */
function makeSaveXml(string, amp, lt, gt, quot, apos, cr) {
	if(string == null) return "";
	string = new String(string);
	var a = {
		_$amp: "&amp;",
		_$lt: "&lt;",
		_$gt: "&gt;",
		_$quot: "&quot;",
		_$apos: "&apos;",
		_$39: "&#39;",
		_$escapedCR: "&#x000D;",
		_RE_amp: /&/g,
		_RE_lt: /</g,
		_RE_gt: />/g,
		_RE_cr: /\r/g
	};
	// alert(string);
	String._singleQuoteRegex = new RegExp("'", "g");
	String._doubleQuoteRegex = new RegExp("\"", "g");
	if(amp != false) string = string.replace(a._RE_amp, a._$amp);
	if(lt != false) string = string.replace(a._RE_lt, a._$lt);
	if(gt != false) string = string.replace(a._RE_gt, a._$gt);
	if(quot != false) string = string.replace(String._doubleQuoteRegex, a._$quot);
	if(apos != false) string = string.replace(String._singleQuoteRegex, a._$apos);
	if(cr != false) string = string.replace(a._RE_cr, a._$escapedCR);
	return string;
}
/**
 * 数组 数据转化为xml
 * @param {Object} data	数据源
 */
function toXmlForDataFilters(data) { //.fields
	var it = this;
	var arr = [],
		str = "";
	// for (var i = 0; i < fields.length; i++) {
	// str = str + fields[i];
	// }
	var xml = "'<items>";
	for(var i = 0; i < data.length; i++) {
		var obj = data[i];
		var s = "<item>";
		for(var name in obj) {
			// if (str.match(name)) {
			var text = obj[name];
			//console.log(isc.isAn.Date(text))
			// if (isc.isAn.Date(text)) {
			// s = s + "<" + name + ">" + text.toSerializeableDate() + "</" + name + ">";
			// } else {
			if(text instanceof Date) {
				s = s + "<" + name + ">" + it.makeSaveXml(Ext.Date.format(text, "Y-m-d H:i:s")) + "</" + name + ">";
			} else {
				s = s + "<" + name + ">" + it.makeSaveXml(text) + "</" + name + ">";
			}
			// }
			// }
		}
		xml = xml + s + "</item>";
	};
	xml = xml + "</items>'";
	return(xml);
}
//获取照片方式 拍照或者文件选择
function getImgMethod(title, callback, fileName) {
	if(mui.os.plus) {
		var a = [{
			title: "拍照"
		}, {
			title: "从相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: title,
			cancel: "取消",
			buttons: a
		}, function(b) { /*actionSheet 按钮点击事件*/
			switch(b.index) {
				case 0:
					break;
				case 1:
					getImage(callback, fileName); /*拍照*/
					break;
				case 2:
					galleryImg(callback, fileName); /*打开相册*/
					break;
				default:
					break;
			}
		})
	}
}
//拍照
function getImage(callback, fileName) {
	var c = plus.camera.getCamera();
	var tpgs = c.supportedImageFormats; //摄像头支持的图片格式
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL() + "?version=" + new Date().getTime();
			callback(s); /*上传图片*/
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/" + fileName
	})
}

//本地相册选择 
function galleryImg(callback, fileName) {
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
				root.getFile(fileName, {}, function(file) {
					//文件已存在 
					file.remove(function() {
						entry.copyTo(root, fileName, function(e) {
								var e = e.toLocalURL() + "?version=" + new Date().getTime();
								callback(e); /*上传图片*/
								//变更大图预览的src 
								//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现 
							},
							function(e) {
								console.log('copy image fail:' + e.message);
							});
					}, function() {
						console.log("delete image fail:" + e.message);
					});
				}, function() {
					//文件不存在 
					entry.copyTo(root, fileName + '.png', function(e) {
							var path = e.toLocalURL() + "?version=" + new Date().getTime();
							callback(path); /*上传图片*/
						},
						function(e) {
							console.log('copy image fail:' + e.message);
						});
				});
			}, function(e) {
				console.log("get _www folder fail");
			})
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	})
}
//console.log(localStorage.getItem('learhost'));
//console.log(localStorage.getItem('learhost').substring(0,26));
//var server = localStorage.getItem('learhost')+"updateAndroid/update.json"; //获取升级描述文件服务器文件
var server = "http://172.32.25.253:8888/updateAndroid/update.json"
//自动更新的新方法
function update(code) {
	mui.getJSON(server, {
		"appid": plus.runtime.appid,
		"version": plus.runtime.version,
		"imei": plus.device.imei
	}, function(data) {
		if(code != data.mark) {
			if(data.state) {
				plus.nativeUI.confirm('EQMS', function(event) {
					if(0 == event.index) {
						//plus.runtime.openURL(data.url);
						var wt = plus.nativeUI.showWaiting('下载更新中，请勿关闭');
						var url = data.url; // 下载文件地址  
						var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
							if(status == 200) { // 下载成功 
								var path = d.filename;
								plus.runtime.install(path);
							} else { //下载失败 
								alert("Download failed: " + status);
							}
						});
						dtask.start();
					}
				}, 'EQMS', ["立即更新", "取  消"]);
			}
		}

	});
}
//日期选择
function selectDate(type, objId, value, callback) {
	var _obj = document.getElementById(objId);
	_obj.addEventListener('tap', function() {
		/*
		 * 首次显示时实例化组件
		 * 示例为了简洁，将 options 放在了按钮的 dom 上
		 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
		 */
		var picker = new mui.DtPicker({
			type: type,
			beginDate: new Date(1950, 01, 01), //设置开始日期
			endDate: new Date(2020, 12, 31), //设置结束日期
		});
		if(value != "") {
			picker.setSelectedValue(value)
		}
		picker.show(function(rs) {
			callback(rs)
			picker.dispose();
		});
	}, false);
}
/**
 * 
 * @param {Object} faultDate 开始时间
 * @param {Object} completeTime	结束时间
 */
function computeTimefunction(faultDate, completeTime) {
	var stime = Date.parse(new Date(faultDate));
	var etime = Date.parse(new Date(completeTime));
	var usedTime = etime - stime; //两个时间戳相差的毫秒数
	var days = Math.floor(usedTime / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));
	var time = days + "天" + hours + "时" + minutes + "分";
	return time;
}