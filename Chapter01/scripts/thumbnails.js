// 设置为一旦用户浏览器加载这个页面就运行initPage()
window.onload = initPage;
function initPage() {
	// find the thumbnails on the page
	thumbs = document.getElementById("thumbnailPane").getElementByTagName("img");
	// set the handler for each image  
	for (var i=0; i<thumbs.length; i++) {
		image = thumbs[i];

		// create the onclick function
		image.onclick = function() {
			// find the full-size image name
			// itmei.png to itemi-details
			// 点击一个缩略图时，利用该图像标题来得出详细图像的URL
			detailsURL = 'images/' + this.title + '-details.jpg';
			// 点击一个缩略图会改变详细图像的src属性，然后浏览器会系那是这个新图像。
			document.getElementById("itemDetails").src = detailsURL;
			getDetails(this.title);
		}
	}
}

// 第二步，新建一个createRequest()函数。
// 用户点击一个商品的图像时，还需要向服务器发送一个请求，要求得到商品的详细信息。
// 在向服务器发送请求之前，需要先创建请求对象。
function createRequest() {
	try {
		// 创建一个新的请求对象。
		// XMLHttpRequest是大多数浏览器对请求对象的叫法，可以把它发送到服务器并从服务器得到响应而无需加载整个页面。
		request = new XMLHttpRequest();

	} catch (tryMS) {
		try {
			// 第一种方法失败，所以尝试另一种不同类型的请求对象。 
			// ActiveXOject是Mircrosoft特定的一中编程对象。它有两个不同的版本，由不同浏览器分别支持。
			// 正因为如此（2个版本），所有才有两段不同代码块分别尝试创建一个不同版本的ActiveXObject。
			request = new ActiveXOject("MSxml2.XMLHTTP");
		} catch (otherMS) {
			try {
				// 第二种方法也失败，所以再尝试另一种类型的请求对象。 
				request = new ActiveXOject("Microsoft.XMLHTTP");
			} catch (failed) {
				// 所有类型均不合适，返回一个null。
				request = null;
			}
		}
	}
	// 返回一个请求对象request。
	return request;
}

// 第三步，新建一个setDetails()函数，其中的代码可以使用第二步中新建的createRequest()函数返回的一个请求对象request。
// 设置请求对象request中的多种属性，如：需连接的URL、使用GET还是POST方法等。需要在向服务器发出请求前完成这些设置。
// 告诉请求对象request当服务器响应时做什么。
// 服务器响应时：浏览器会查看请求对象request中的onreadystatechange属性。这个属性允许我们只是那个一个回调函数，服务器对请求做出响应时就要运行这个回调函数。 
function getDetails(itemName) {
	// ① 得到一个请求对象。得到请求对象的一个实例，并把它赋值到变量”request“中。
	request = createRequest();
	// 作以下检查，以确保请求对象request不为null，由此可以知道创建对象时是否有问题。 
	if(request == null) {
		createRequest()无法得到一个请求对象时，它会返回一个null。如果进入此部，就说明出了问题，将为用户先一个一个错误的提示窗口，并退出这个函数。
		alert("Unable to create request");
		return;
	}

	// ② 配置请求。即设置请求对象request中的各种属性。
	// 告诉请求对象request要调用的URL。
	// escape()函数负责处理请求URL字符串中可能有问题的字符。 其中的参数itemName表示商品名称。
	var url = "getDetails.php?ImageID=" + escape(itemName);
	// open()方法中：1、以GET方式连接服务器传送数据；2、请求作出响应的服务器端脚本的URL；3、”true"说明请求应当是异步的，即在等待服务器做出响应期间，浏览器中的代码可以继续执行。
	request.open("GET", url, true);

	// ③ 设置回调函数。
	request.onreadystatechange = displayDetails;
	// ④ 发送请求。
	// null说明没有随请求发送额外的数据。
	request.send(null);
}