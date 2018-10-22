(function ($w) {
    "use strict"
    var $d = $w.document;
    var $g = function (id) {
        return $d.getElementById(id)
    };
    var $header = $d.getElementsByTagName('header')[0];
    var $container = $g('jsmind_container');

    var jsMind = $w.jsMind;
    var _jm = null;

    $("#loading").css("width","100%");
    function page_load() {
        init_jsMind();
        set_container_size();
        load_mind();
        register_event();
        loadTest();
    }

    $('#testSubmit').click(function (){
        var testJson={};
        $("input[name='testProp'],select[name='testProp']").each(function(){
            if($(this).val()!=null&&$(this).val()!=""){
                if($(this).val() instanceof Array){
                    testJson[$(this).attr("prop")]=$(this).val().join(",");
                }else{
                    testJson[$(this).attr("prop")]=$(this).val();
                }
            }
        });
        var mind_data = _jm.get_data();
        var mind_string = jsMind.util.json.json2string(mind_data);
        var propJson={};
        propJson["jsmind"] = mind_string;
        propJson["ruleBiztypeId"] = ruleBiztypeId;
        propJson["version"] = $('#confirmVersion').val();
        propJson["remark"] = $('#confirmRemark').val();
        propJson["testJson"] = jsMind.util.json.json2string(testJson);
        $.ajax({
            type: "POST",
            url: basePath + "web/blackfish/drools/doRulePackEditTest",
            data: JSON.stringify(propJson),
            contentType: 'application/json',
            success: function (response) {
                if (response.success) {
                    $('.testResult').html('');
                    if(response.data.indexOf("result\":\"PASS")!=-1) {
                        $('.testResult').append("<tr><td colspan='3' style='font-size: 15px'><b>结果：</b><font color='green'>通过</font></td></tr>");
                    }else if(response.data.indexOf("result\":\"REVIEW")!=-1) {
                        $('.testResult').append("<tr><td colspan='3' style='font-size: 15px'><b>结果：</b><font color='green'>转人工审核</font></td></tr>");
                    }else{
                        $('.testResult').append("<tr><td colspan='3' style='font-size: 15px'><b>结果：</b><font color='red'>"+ response.data.substring(response.data.indexOf("reason\":\"")+9,response.data.indexOf("\",\"result"))+"</font></td></tr>");
                    }
                } else {
                    $("#loading").hide();
                    alert(response.data);
                }
            }, error: function () {
                $("#loading").hide();
                alert('系统异常');
            }
        });

    });

    function init_jsMind() {
        var options = {
            editable: true,
            container: 'jsmind_container',
            theme: 'greensea'
        };
        _jm = new jsMind(options);
        _jm.add_event_listener(function(type,data){
            if(type==3&&!!data.node){
                if(data.evt=='add_node'||data.evt=='move_node'){
                    if(_jm.get_node(data.node).parent.id!='root'){
                        if(_jm.get_node(data.node)._data.view.operation.innerHTML=="-"){
                            var element = _jm.get_node(data.node);
                            showMode(element);
                        }
                    }
                }
            }
            if (data.evt=='remove_node'||data.evt=='add_node'){
                loadTest();
            }
        });
        _jm.init();
    }

    function register_event() {
        jsMind.util.dom.add_event($w, 'resize', reset_container_size);
        jsMind.util.dom.add_event($g('jsmind_tools'),'click',tools_handler);
        jsMind.util.dom.add_event($d, 'click', dblclick);
        jsMind.util.dom.add_event($d,'click',hide_setting_visible);
    }
    var tools_handlers={
        toggle  : toggle_setting_visible,
        save    : if_test_or_not,
        screenshot : take_screenshot,
        plus : zoomIn,
        minus : zoomOut,
        test:showTest
    };
    function showTest(e){
       $('#modal-test').modal('show', {backdrop: 'static'});
    }
    var _setting_visible = false;
    function toggle_setting_visible(e){
        var tools = $g('jsmind_tools');
        if(_setting_visible){
            _setting_visible = false;
            tools.className = tools.className.replace(/\s*jsmind-tools-active/ig,'');
        }else{
            _setting_visible = true;
            tools.className += ' jsmind-tools-active'
        }
    }
    function hide_setting_visible(e){
        if(!_setting_visible){ return; }
        var e_src = e.target || event.srcElement;

        if(e_src != null && (e_src.getAttribute('action') === 'plus'||e_src.getAttribute('action') === 'minus')){ return; }
        if(e_src != null && e_src.getAttribute('action') === 'toggle'){ return; }

        var tools = $g('jsmind_tools');
        _setting_visible = false;
        tools.className = tools.className.replace(/\s*jsmind-tools-active/ig,'');
    }

    function take_screenshot(e){
        _jm.screenshot.shootDownload();
    }

    function if_test_or_not(e){
        var mind_data = _jm.get_data();
        var result = validateData(mind_data);
        if(undefined != result.msg){
            return;
        }
        $('#modal-save-div').show();
        $('#modal-save').modal('show', {backdrop: 'static'});
    }

    function doSave(e){
        var mind_data = _jm.get_data();
        var mind_string = jsMind.util.json.json2string(mind_data);
        var customVersion = $('#confirmVersion').val();
        var remark = $('#confirmRemark').val();
        if (customVersion == null || customVersion == "" || remark == null || remark == "") {
            alert("必填参数不能为空!");
            return;
        }
        var propJson={};
        propJson["jsmind"] = mind_string;
        propJson["ruleBiztypeId"] = ruleBiztypeId;
        propJson["version"] = $('#confirmVersion').val();
        propJson["remark"] = $('#confirmRemark').val();
        propJson["isUrgent"] = $('.urgentRadio:checked').val();
        propJson["approveReason"] = $('#approveReason').val();
        propJson["ruleVersion"] = $('#ruleVersion').val();
        propJson["takeArrStr"] = takeArrStr;
        propJson["approveEffectTime"] = $('#approveEffectTime').val();
        $("#loading").css("width","100%");
        $("#loading").show();
        $.ajax({
            type: "POST",
            url: basePath + "web/blackfish/drools/doRulePackEdit3",
            data: JSON.stringify(propJson),
            contentType: 'application/json',
            success: function (response) {
                if (response.success) {
                    $("#loading").hide();
                    alert('保存成功');
                    jQuery('#modal-confirm').modal('hide');
                    window.location.reload();
                } else {
                    $("#loading").hide();
                    alert(response.data);
                }
            }, error: function () {
                $("#loading").hide();
                alert('系统异常');
            }
        });
    }
    function tools_handler(e){
        var ele = e.target || event.srcElement;
        var action = ele.getAttribute('action');
        if(action in tools_handlers){
            tools_handlers[action](e);
        }
    }

    function zoomIn() {
        if (_jm.view.zoomIn()) {
            zoomOutButton.disabled = false;
        } else {
            zoomInButton.disabled = true;
        };
    };

    function zoomOut() {
        if (_jm.view.zoomOut()) {
            zoomInButton.disabled = false;
        } else {
            zoomOutButton.disabled = true;
        };
    };

    function load_mind() {
        if(droolsJson!=null&&droolsJson!=undefined){
            if(droolsJson.meta==null){
                droolsJson=null;
            }
        }
        _jm.show(droolsJson);
        $w.setTimeout(function(){
            _jm.view._center_root();
            $("#loading").hide();
        }.bind(this),0);

    }

    var testRowDist=new Array();
    function addTestRow(prop){
        if($.inArray(prop, testRowDist)!=-1){
            return ;
        }
        testRowDist.push(prop);
        var type=fieldTypeJson[prop];
        $('.test').append("<tr id='testtr_"+prop+"' class='testtr'>" +
            "   <td>"+fieldAliasJson[prop]+"</td>\n" +
            "   <td>"+type+"</td>\n" +
            "   <td width='35%' id='testtd_"+prop+"'>\n" +
            (type != "boolean"
                    ?
                    (fieldDictJson[prop]==null
                        ?"<input class='editInput' style='height:35px;font-size:13px;width: 150px; ' name='testProp' prop='"+prop+"' id=\"test_" +prop+ "\">\n":
                        "")
                    :
                "<select name='testProp' prop='"+prop+"' id=\"test_"+prop+"\">\n" +
                "   <option value=\"true\">是</option>\n" +
                "   <option value=\"false\">否</option>\n" +
                "</select>\n"
            )
            +
            "   </td>\n" +
            " </tr>"
        );
        if(type == "boolean"){
            $('#test_'+prop).multiselect({
                buttonWidth: "150px"
            });
        }
        if(fieldDictJson[prop]!=null) {
            addMultiselect($('#testtd_'+prop),"test_"+prop,false,prop,true);
        }
    }
    function loadTest(){
        testRowDist=new Array();
        $('.test').empty();
        //初始化测试项
        $.each(_jm.mind.nodes, function(key,value) {
            if(value.topic.startsWith("开始")||value.topic.startsWith("通过")||value.topic.startsWith("转人工审核")||value.topic.startsWith("预警")||value.topic.startsWith("冻结")){
                return;
            }
            var prop=value.data.left;
            addTestRow(prop);
        });
    }


    var _resize_timeout_id = -1;

    function reset_container_size() {
        if (_resize_timeout_id != -1) {
            clearTimeout(_resize_timeout_id);
        }
        _resize_timeout_id = setTimeout(function () {
            _resize_timeout_id = -1;
            set_container_size();
            _jm.resize();
        }, 300);
    }

    function dblclick(e) {
        var element = e.target || event.srcElement;
        if (element.tagName.toLowerCase() == "jmoperation") {
            //连接线表达式点击事件
            showMode(element.node);
        }
    }


    function set_container_size() {
        var ch = $w.innerHeight ;
        var cw = $w.innerWidth - 275;
        $container.style.height = ch + 'px';
        $container.style.width = cw + 'px';
        $('.left').css("height", ch + 'px');
    }


    //显示扭转条件mode
    function showMode(element){
        $('#operation_td').empty();
        $('#right_td').empty();
        $('#operation_td2').empty();
        $('#right_td2').empty();
        //$('#alarm_type_td').empty();
       // $('#alarm_address_td').empty();
       // $('#alarm_content_td').empty();
       // $('#freeze_content_td').empty();
       // $('#modal-conn-title').html("条件");
        var operation=eval("("+element.data.operation+")");
        $('#left_td').html(fieldAliasJson[operation[0].left]);
        $('#jsId').val(element.id);
        $('#jsleft').val(operation[0].left);
        viewConnOperation(operation[0],"");
        viewValue(operation[0],"");
        if(operation[1]!=null){
            viewConnOperation(operation[1],"2");
            viewValue(operation[1],"2");
            $('#or_tr').show();
            $('#del_or_btn').show();
            $('#add_or_btn').hide();
        }else{
            viewConnOperation({"left":operation[0].left},"2");
            viewValue({"left":operation[0].left},"2");
            $('#or_tr').hide();
            $('#del_or_btn').hide();
            $('#add_or_btn').show();
        }
     /*   if(element.topic=='预警'){
            viewAlarm(element);
        }else if(element.topic=='冻结'){
            viewFreeze(element);
       }*/
        $('#modal-conn-div').show();
        $('#modal-conn').modal('show', {backdrop: 'static'});
    }
 /*
 function viewAlarm(element){
        $('#modal-conn-title').html("预警条件");
        $('#alarm_type_td').append(
            "<input type='radio' name='alarm_td_radio' id='alarm_td_radio_email' value='email' "+(element.data.alarmType=='email'?"checked":"")+"><label for='alarm_td_radio_email'>邮件</label> &nbsp;&nbsp;&nbsp;" +
            "<input type='radio' name='alarm_td_radio' id='alarm_td_radio_sms' value='sms' "+(element.data.alarmType=='sms'?"checked":"")+"><label for='alarm_td_radio_sms'>短信</label> &nbsp;&nbsp;&nbsp;" +
            "<input type='radio' name='alarm_td_radio' id='alarm_td_radio_wechat' value='wechat' "+(element.data.alarmType=='wechat'?"checked":"")+"><label for='alarm_td_radio_wechat'>微信</label> ");
        $('#alarm_address_td').append("预警接收人：<textarea id='alarm_td_address' style='font-size: 14px' cols='60' rows='2'>"+(element.data.alarmAddress==null?"":element.data.alarmAddress)+"</textarea>(分号分隔)");
        $('#alarm_content_td').append("预 警 内 容 ：<textarea id='alarm_td_content' style='font-size: 14px' cols='60' rows='5'>"+(element.data.alarmContent==null?"":element.data.alarmContent)+"</textarea>" +
            "占位符：" +
            "<button onclick='textareaAppend(\" {userName} \")'>姓名</button> " +
            "<button onclick='textareaAppend(\" {memberId} \")'>会员id</button> "+
            "<button onclick='textareaAppend(\" {dateTime} \")'>日期时间</button> " +
            "<button onclick='textareaAppend(\" {itemValue} \")'>规则项值</button>");
    }

    function viewFreeze(element){
        $('#modal-conn-title').html("冻结条件");
        $('#freeze_content_td').append("备注 ：<textarea id='freeze_td_content' style='font-size: 14px' cols='60' rows='5'>"+(element.data.freezeContent==null?"":element.data.freezeContent)+"</textarea>");
    }
*/
    function viewValue(operation_,tdindex){
        var left=operation_.left;
        var operation=operation_.operation;
        var right=operation_.right;
        //值
        if(fieldTypeJson[left]=="boolean"){
            $('#right_td'+tdindex).append("<select id='connRihgt"+tdindex+"'><option value='true'>是</option><option value='false'>否</option></select>");
            $('#connRihgt'+tdindex).multiselect({
                buttonWidth: "150px"
            });
            $('#connRihgt'+tdindex).multiselect('deselect','true');
            $('#connRihgt'+tdindex).multiselect("select",right,true);
        }else if(fieldDictJson[left]==null){
            $('#right_td'+tdindex).append("<input id='connRihgt"+tdindex+"' style='width:300px;height: 35px; font-size: 26px'/>");
            if(right!=null){
                $('#connRihgt'+tdindex).val(right);
            }
        }else{
            addMultiselect($('#right_td'+tdindex),"connRihgt"+tdindex,true,left,false)
            if(right!=null){
                $('#connRihgt'+tdindex).multiselect("select",right.split(","),true);
            }
        }
    }
    function viewConnOperation(operation_,tdindex){
        var left=operation_.left;
        var operation=operation_.operation;
        var right=operation_.right;
        //操作符
        $('#operation_td'+tdindex).append("<select id='connOperation"+tdindex+"'></select>");
        $('#connOperation'+tdindex).multiselect({buttonWidth: '120px',
                templates: {
                    button: '<button type="button" class="multiselect dropdown-toggle" style="font-size: 26px;height: 30px;padding:0px 0px 35px 0px;" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>'
                }
            }
        );
        if(fieldTypeJson[left]=="boolean"){
            $('#connOperation'+tdindex).multiselect('dataprovider',[{"label":"=","title":"=","value":"=="}]);
        }else if(fieldTypeJson[left]=="string"){
            $('#connOperation'+tdindex).multiselect('dataprovider',[
                {"label":"=","title":"=","value":"=="},
                {"label":"in","title":"in","value":"in"},
                {"label":"not in","title":"not in","value":"not in"},
                {"label":"未命中","title":"未命中","value":"!∩"},
                {"label":"正则","title":"正则","value":"matches"}
            ]);
        }else{
            $('#connOperation'+tdindex).multiselect('dataprovider',[
                {"label":"=","title":"=","value":"=="},
                {"label":"in","title":"in","value":"in"},
                {"label":"not in","title":"not in","value":"not in"},
                {"label":"<","title":"<","value":"<"},
                {"label":"<=","title":"<=","value":"<="},
                {"label":">","title":">=","value":">"},
                {"label":">=","title":">=","value":">="},
                {"label":"(,)","title":"(,)","value":"(,)"},
                {"label":"[,]","title":"[,]","value":"[,]"},
                {"label":"(,]","title":"(,]","value":"(,]"},
                {"label":"[,)","title":"[,)","value":"[,)"},
                {"label":"未命中","title":"未命中","value":"!∩"},
                {"label":"正则","title":"正则","value":"matches"}
            ]);
        }
        if(operation!=null){
            $('#connOperation'+tdindex).multiselect('deselect','==');
            $('#connOperation'+tdindex).multiselect("select",operation,true);
        }
    }
    $('#setconn').click(function () {
        var node=_jm.get_node($('#jsId').val());
    /*
    if(node.topic=='预警'){
            if(!$('#alarm_td_radio_email')[0].checked&&!$('#alarm_td_radio_sms')[0].checked&&!$('#alarm_td_radio_wechat')[0].checked){
                alert("请选择预警类型");
                return;
            }
            if($('#alarm_td_address').val()==''){
                alert("请填写预警接收人");
                return;
            }
            if($('#alarm_td_content').val()==''){
                alert("请填写预警内容");
                return;
            }
        }else if(node.topic=='冻结'){
        }
	*/
        if($('#del_or_btn').css("display")=="none"){
            if($('#connRihgt').val() instanceof Array&&$('#connRihgt').val().length>1&&$('#connOperation').val()=="=="){
                alert("等于符号不支持多选");
                return;
            }
            if(typeof($('#connRihgt').val())=="string"){
                $('#connRihgt').val($('#connRihgt').val().replace(new RegExp("，","gm"),','));
            }
            node.data.operation="[{\"left\":\""+$('#jsleft').val()+"\",\"operation\":\""+$('#connOperation').val()+"\",\"right\":\""+$('#connRihgt').val()+"\"}]";
        }else{
            if($('#connRihgt').val() instanceof Array&&$('#connRihgt').val().length>1&&$('#connOperation').val()=="=="){
                alert("等于符号不支持多选");
                return;
            }
            if($('#connRihgt2').val() instanceof Array&&$('#connRihgt2').val().length>1&&$('#connOperation2').val()=="=="){
                alert("等于符号不支持多选");
                return;
            }
            if(typeof($('#connRihgt').val())=="string") {
                $('#connRihgt').val($('#connRihgt').val().replace(new RegExp("，", "gm"), ','));
            }
            if(typeof($('#connRihgt2').val())=="string") {
                $('#connRihgt2').val($('#connRihgt2').val().replace(new RegExp("，", "gm"), ','));
            }
            node.data.operation="[{\"left\":\""+$('#jsleft').val()+"\",\"operation\":\""+$('#connOperation').val()+"\",\"right\":\""+$('#connRihgt').val()+"\"}," +
                "{\"left\":\""+$('#jsleft').val()+"\",\"operation\":\""+$('#connOperation2').val()+"\",\"right\":\""+$('#connRihgt2').val()+"\"}]";
        }
       /*
        if(node.topic=='预警'){
            if($('#alarm_td_radio_email')[0].checked){
                node.data.alarmType='email';
            }else if($('#alarm_td_radio_sms')[0].checked){
                node.data.alarmType='sms';
            }else if($('#alarm_td_radio_wechat')[0].checked){
                node.data.alarmType='wechat';
            }
            node.data.alarmAddress=$('#alarm_td_address').val();
            node.data.alarmContent=$('#alarm_td_content').val();
        }else if(node.topic=='冻结'){
            node.data.freezeContent=$('#freeze_td_content').val();
        }
	*/
        _jm.view.reset_nodes_operation(node);
        $('#modal-conn').modal('hide');
    });

    $('#saveWithoutTest').click(function () {
        $('#modal-save').modal('hide');
        //open_save_dialog();
    });
    $('#testAndSave').click(function () {
        if ($('#approveReason').val().trim() == '') {
            alert('审批理由不能为空');
            return false;
        }
        if($('#approveEffectTime').val().trim() == ''){
            alert('生效时间不能为空');
            return false;
        }
        if ($('#confirmVersion').val().trim() == '') {
            alert('自定义版本号不能为空');
            return false;
        }
        if ($('#confirmRemark').val().trim() == '') {
            alert('备注不能为空');
            return false;
        }
        // $('#modal-save').modal('hide');
        doSave();
    });
    function addMultiselect(td,id,multiple,left,istest){
        var lirow=0;
        var buttonWidth="150px";
        td.append("<select "+(istest?"name='testProp' prop='"+left+"'":"")+" id='"+id+"' "+(multiple?"multiple='multiple'":"")+"></select>");
        if(fieldDictJson[left]==1){
            $('#'+id).multiselect({
                buttonWidth: buttonWidth,
                includeSelectAllOption: true,
                enableFiltering: true,
                enableClickableOptGroups: true,
                templates: {
                    ul:'<ul class="multiselect-container dropdown-menu mydropdown-menu"></ul>'
                }
            });
            $('#'+id).multiselect('dataprovider', toGroup(dictsJson[fieldDictJson[left]]));
            lirow=0;
            $.each($($('#'+id).next().children()[1]).find('li'),function() {
                if($(this).hasClass("multiselect-all")){
                    $(this).css("width","110px");
                    $(this).before("<br>");
                    $(this).after("<br>");
                }
                if(!$(this).hasClass("multiselect-filter")
                    &&!$(this).hasClass("multiselect-item multiselect-all")){
                    $(this).css("width","110px");
                    lirow++;
                    if($(this).hasClass("multiselect-group")){
                        if(lirow%8==1) {
                            $(this).before("<br>");
                        }else{
                            $(this).before("<br><br>");
                        }
                        $(this).after("<br>");
                        lirow=0;
                    }else if(lirow%8==0){
                        $(this).after("<br>");
                    }
                }
            });
        }else if(fieldDictJson[left]==9){
            $('#'+id).multiselect({
                buttonWidth: buttonWidth,
                enableClickableOptGroups: true,
                templates: {
                    ul:'<ul class="multiselect-container dropdown-menu mydropdown-menu"></ul>'
                }
            });
            $('#'+id).multiselect('dataprovider', dictsJson[fieldDictJson[left]]);
            lirow=0;
            $($('#'+id).next().children()[1]).css("height",'200px')
            $.each($($('#'+id).next().children()[1]).find('li'),function() {
                $(this).css("width","110px");
                $(this).find("label").css("height","0");
                lirow++;
                if($(this).hasClass("multiselect-group")){
                    if(lirow%8==1) {
                        $(this).before("<br>");
                    }else{
                        $(this).before("<br><br>");
                    }
                    $(this).after("<br>");
                    lirow=0;
                }else if(lirow%8==0){
                    $(this).after("<br>");
                }
            });
        }else {
            $('#'+id).multiselect({buttonWidth: '220px'});
            $('#'+id).multiselect('dataprovider', dictsJson[fieldDictJson[left]]);
        }
    }

    function toGroup(city){
        var group=[];
        var subgroup={};
        var tmpgrouname=''
        $.each(city, function() {
            var subtext=this.label.substring(0,this.label.indexOf(" "));
            if(subtext==""){
                subtext=this.label;
            }
            if(subtext!=tmpgrouname){
                subgroup={label: subtext, children:[]}
                group.push(subgroup);
            }
            if(this.label.indexOf(" ")!=-1){
                subgroup.children.push({"label":this.label.substring(this.label.indexOf(" "),this.label.length),"title":this.title,"value":this.value});
            }else{
                subgroup.children.push({"label":this.label,"title":this.title,"value":this.value});
            }
            tmpgrouname=subtext;
        });
        return group;
    }

    page_load();
})(window);

function searchField(s) {
    $.each($(".sub2").find('div'),function() {
        if(this.innerHTML.indexOf(s)==-1){
            $(this).parent().hide();
        }else{
            $(this).parent().show();
        }
    });
}
window.onload=function () {
    $('#or_tr').hide();
    $('#del_or_btn').hide();
        }
function setLineRight(div,left,operation,right){
    if(operation==null){
        return;
    }
    if(operation.indexOf("in")!=-1 || operation.indexOf("!∩")!=-1){
        if(fieldDictJson[left]!=null) {
            var title = "";
            $.each(right.split(","),function (i,_va) {
                $.each(dictsJson[fieldDictJson[left]],function () {
                    if(_va==this.value){
                        title += this.label + ",";
                    }
                });
            });
            $(div).html(operation+" (...)");
            $(div).attr("title",operation+" ("+title.substring(0,title.length-1)+")");
        }else{
            $(div).html(operation + " (...)");
            $(div).attr("title",operation + " ("+right+")");
        }
    }
    else if(operation.indexOf(",")!=-1){
        $(div).html(operation.replace(",",right));
        $(div).attr("title", operation.replace(",",right));
    }else{
        if(fieldTypeJson[left] == "boolean"){
            $(div).html("" + (right=="true"?"是":"否"));
            $(div).attr("title", "" + (right=="true"?"是":"否"));
        }else if(fieldDictJson[left]!=null) {
            $.each(dictsJson[fieldDictJson[left]],function () {
                if(right==this.value){
                    $(div).html(operation + " " + this.label);
                    $(div).attr("title", operation + " " + this.label);
                }
            });
        }else{
            $(div).html(operation + " " + right);
            $(div).attr("title", operation + " " + right);
        }
    }
}
function setLineRight2(div,left,operation,right,operation2,right2){
    if(operation!=null) {
        if (operation.indexOf("in") != -1 || operation.indexOf("!∩")!=-1) {
            if (fieldDictJson[left] != null) {
                var title = "";
                $.each(right.split(","), function (i, _va) {
                    $.each(dictsJson[fieldDictJson[left]], function () {
                        if (_va == this.value) {
                            title += this.label + ",";
                        }
                    });
                });
                $(div).html(operation + " (...)");
                $(div).attr("title", operation + " (" + title.substring(0, title.length - 1) + ")");
            } else {
                $(div).html(operation + " (...)");
                $(div).attr("title", operation + " (" + right + ")");
            }
        }
        else if (operation.indexOf(",") != -1) {
            $(div).html(operation.replace(",",right));
            $(div).attr("title", operation.replace(",",right));
        }
        else {
            if (fieldTypeJson[left] == "boolean") {
                $(div).html("" + (right == "true" ? "是" : "否"));
                $(div).attr("title", "" + (right == "true" ? "是" : "否"));
            } else if (fieldDictJson[left] != null) {
                $.each(dictsJson[fieldDictJson[left]], function () {
                    if (right == this.value) {
                        $(div).html(operation + " " + this.label);
                        $(div).attr("title", operation + " " + this.label);
                    }
                });
            } else {
                $(div).html(operation + " " + right);
                $(div).attr("title", operation + " " + right);
            }
        }
    }
    if(operation2!=null){
        if(operation2.indexOf("in")!=-1){
            if(fieldDictJson[left]!=null) {
                var title = "";
                $.each(right2.split(","),function (i,_va) {
                    $.each(dictsJson[fieldDictJson[left]],function () {
                        if(_va==this.value){
                            title += this.label + ",";
                        }
                    });
                });
                $(div).html($(div).html()+" 或 "+operation2+" (...)");
                $(div).attr("title",$(div).attr("title")+" 或 "+operation2+" ("+title.substring(0,title.length-1)+")");
            }else{
                $(div).html($(div).html()+" 或 "+operation2 + " (...)");
                $(div).attr("title",$(div).attr("title")+" 或 "+operation2 + " ("+right2+")");
            }
        }
        else if(operation2.indexOf(",")!=-1){
            $(div).html($(div).html()+" 或 "+operation2.replace(",",right2));
            $(div).attr("title",$(div).attr("title")+" 或 "+operation2.replace(",",right2));
        }
        else{
            if(fieldTypeJson[left] == "boolean"){
                $(div).html($(div).html()+" 或 "+ (right2=="true"?"是":"否"));
                $(div).attr("title",$(div).attr("title")+" 或 " + (right2=="true"?"是":"否"));
            }else if(fieldDictJson[left]!=null) {
                $.each(dictsJson[fieldDictJson[left]],function () {
                    if(right2==this.value){
                        $(div).html($(div).html()+" 或 "+operation2 + " " + this.label);
                        $(div).attr("title",$(div).attr("title")+" 或 "+operation2 + " " + this.label);
                    }
                });
            }else{
                $(div).html($(div).html()+" 或 "+operation2 + " " + right2);
                $(div).attr("title",$(div).attr("title")+" 或 "+operation2 + " " + right2);
            }
        }
    }
}

function validateData(mind_data) {
	var result = {}
	var root = mind_data.data;
	if (undefined == root) {
		return result;
	} else {
		//if ("开始" == root.topic) {
			//ret["isStart"] = true;
		//}
		if (undefined == root.children) {
			//ret["isEnd"] = false;
			result["msg"] = "缺少通过规则项！";
			alert(result.msg);
		} else {
			$.each(root.children, function() {
				validateParameter(this);
				result = validateInverse(this, result);
				if (undefined != result.msg) {
					return false;
				}
			});
		}
		return result;
	}
}

function validateInverse(root, result) {
    var ck = true;
    ret = result;
    if ((root.topic.startsWith("通过") ||root.topic.startsWith("转人工审核") ||"预警" == root.topic||"冻结" == root.topic) && undefined == root.children) {
        ret["isEnd"] = true;
    } else {
        if (root.children == undefined && !root.topic.startsWith("通过")&& !root.topic.startsWith("转人工审核")) {
            ret["isEnd"] = false;
            ret["End"] = root;
            ret["msg"] = fieldAliasJson[root.left] + "后面缺少通过规则项！";
            alert(fieldAliasJson[root.left] + "后面缺少通过规则项！");
            return ret;
        }
        $.each(root.children, function() {
            ck = validateParameter(this);
            if(ck){
                validateInverse(this, ret);
            }else{
                ret["msg"] = "数据格式有误！";
                return false;
            }
        });
    }
    return ret;
}

function validateParameter(node) {
    var ck = true;
    var leftOperation = JSON.parse(node.operation, function(key, value) {
        return key.indexOf('date') >= 0 ? new Date(value) : value;
    });
    $.each(leftOperation, function() {
        ck = validateParameterSingle(this.left, this.operation, this.right);
        if(false == ck){
            return false;
        }
    });
    return ck;
}

function validateParameterSingle(left, operation, right) {
    var ck = true;
    if ("droolsstart_m" ==  left || "droolspass_m" == left || "droolsreview_m" == left) {
        return true;
    }
    if(undefined == right || "null" == right || "" == right.trim()){
        alert("请填写【" + fieldAliasJson[left] + "】属性，不能为空！");
        return false;
    }
    if (operation.indexOf("in") != -1) {
        $.each(right.split(","), function() {
            if ( ck && fieldTypeJson[left] == "int"
                && (isNaN(this) || this.indexOf(".") != -1)) {
                alert(fieldAliasJson[left] + "属性请输入整数值");
                ck= false;
                return false;
            }
            if ( ck && fieldTypeJson[left] == "double" && isNaN(this)) {
                alert(fieldAliasJson[left] + "属性请输入数值");
                ck= false;
                return false;
            }
        });
    } else if (operation.indexOf(",") != -1){
        if (right.split(",").length != 2) {
            alert(fieldAliasJson[left] + " 值格式不正确，请用逗号分割");
            return false;
        }
        $.each(right.split(","), function() {
            if ( ck &&  fieldTypeJson[left] == "int"
                && (isNaN(this) || this.indexOf(".") != -1)) {
                alert(fieldAliasJson[left] + "属性请输入整数值");
                ck= false;
                return false;
            }
            if ( ck &&  fieldTypeJson[left] == "double" && isNaN(this)) {
                alert(fieldAliasJson[left] + "属性请输入数值");
                ck= false;
                return false;
            }
        });
    } else {
        if ( fieldTypeJson[left] == "int"
            && (isNaN(right) || right.indexOf(".") != -1)) {
            alert(fieldAliasJson[left] + " 请输入整数值");
            return false;
        }
        if (fieldTypeJson[left] == "double" && isNaN(right)) {
            alert(fieldAliasJson[left] +" 请输入数值" );
            return false;
        }
    }
    return ck;
}
/*
function textareaAppend(text){
    $("#alarm_td_content").val($("#alarm_td_content").val()+text);
}*/

