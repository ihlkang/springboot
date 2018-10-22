// 设置列表高度
function set_container_size() {
	var ch = window.innerHeight - 110;
	var cw = window.innerWidth - 275;
	$('#rulelist').css("height", ch + 'px');
}
// 规则查询
function searchField(s) {
	$.each($(".sub2").find('div'), function() {
		if (this.innerHTML.indexOf(s) == -1) {
			$(this).parent().hide();
		} else {
			$(this).parent().show();
		}
	});
}

$(function() {
	$("#container").focus(function() {
		$("#container").removeClass("flag");
	});
	/*
	 * $("#container").blur(function(){ $("#container").addClass("flag"); });
	 */
});

function add() {
	insertHTML("<input type='text' disabled />");
}

// 再加入一个全屏事件
$(window).click(
		function(e) {
			if (window.getSelection) {
				var getevent = e.srcElement ? e.srcElement : e.target;
				// console.log(getevent.id,getevent.tagName);
				if ( $(getevent).attr('isRule') || getevent.id == "container") {
					// alert(0);
					// 代表 点了插入html的按钮
					// 则不执行getFocus方法
				} else if($(getevent).attr('action')=='input'){
					var children = $(getevent).children();
					if(children.length!=0){
					}else{
						$(getevent).html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
					}
				} else if($(getevent).attr('action')=='text'){
                        //$(getevent).html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                }else {
					$("#container").addClass("flag");// 除非点了那个插入html的按钮
					// 其他时候必须要执行getFocus来更新最后失去焦点的div
				}
			}

		})

function insertHTML(html) {
	var dthis = $("#container")[0];// 要插入内容的某个div,在标准浏览器中 无需这句话
	// dthis.focus();
	var sel, range;
	console.log($(dthis).hasClass("flag"));
	if ($(dthis).hasClass("flag")) {
		$(dthis).html(dthis.innerHTML + html);
		return;
	}
	if (window.getSelection) {
		// IE9 and non-IE
		sel = window.getSelection();
		if (sel.getRangeAt && sel.rangeCount) {
			range = sel.getRangeAt(0);
			range.deleteContents();
			var el = document.createElement('span');
			el.innerHTML = html;
			var frag = document.createDocumentFragment(), node, lastNode;
			while ((node = el.firstChild)) {
				lastNode = frag.appendChild(node);
			}

			range.insertNode(frag);
			if (lastNode) {
				range = range.cloneRange();
				range.setStartAfter(lastNode);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	} else if (document.selection && document.selection.type != 'Control') {
		$(dthis).focus(); // 在非标准浏览器中 要先让你需要插入html的div 获得焦点
		ierange = document.selection.createRange();// 获取光标位置
		ierange.pasteHTML(html); // 在光标位置插入html 如果只是插入text 则就是fus.text="..."
		$(dthis).focus();

	}
}