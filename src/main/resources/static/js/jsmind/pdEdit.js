//防止右边出现重复属性框
array=new Array();

//最小化属性框
function maxMin(id){
    if ($('#subdiv_'+id).css("display") == "none") {
        $('#subdiv_'+id).css("display", "inline");
        $('#sign_'+id).text("-");
    } else {
        $('#subdiv_'+id).css("display", "none");
        $('#sign_'+id).text("+");
    }
}
//移除属性框
function remove(left){
    if(confirm("确认删除？")) {
        array.splice($.inArray(left, array), 1);
        $('#div_' + left).remove();
        $('#testtr_'+left).hide();
    }
}

//添加属性框
function add(row){
    if($.inArray(row.left, array)==-1){
        if(fieldTypeJson[row.left]==null){
            alert('后台程序不支持'+row.left+"属性");
            return;
        }
        //定义属性框div
        propDiv=document.createElement("div");
        propDiv.setAttribute("id", "div_" + row.left);
        propDiv.setAttribute("class", "box");
        propDiv.setAttribute("title",row.alias);
        $('#rules').append(propDiv);
        //添加属性框div内标题栏
        $(propDiv).append("<table width='100%'><tr><td width='90%'>"+row.alias+"&nbsp;&nbsp;&nbsp;【系数:<input size='5' id='pd_"+row.left+"' value='"+(row.pd==null?"1.0":row.pd)+"'>】</td>" +
            "<td><div align=\"right\" ><a href=\"javascript:maxMin('"+row.left+"')\" id=\"sign_"+row.left+"\">_</a>\n" +
            "<a href=\"javascript:remove('"+row.left+"')\">x</a>&nbsp;</div></td></tr></table>\n");
        //定义属性编辑div
        propRowDiv=document.createElement("div");
        propRowDiv.setAttribute("id","subdiv_"+row.left);
        $(propDiv).append(propRowDiv);
        propRowDivOl=document.createElement("ol");
        $(propRowDiv).append(propRowDivOl);
        propRowDivOlDiv=document.createElement("div");
        propRowDivOlDiv.setAttribute("class","subrow");
        propRowDivOlDiv.setAttribute("value",row.alias);
        $(propRowDivOl).append(propRowDivOlDiv);
        addRow(row,propRowDivOlDiv);
        $(propRowDivOl).append("<button onclick=\'appendRow($(this),\""+row.left+"\",\""+row.alias+"\",\"\",\"\",\"\");\' class='btn btn-info'>增加</button>");
        array.push(row.left);
        $('#testtr_'+row.left).show();
        $('#testtr_alias_'+row.left).html(row.alias);
    }
}
function addRow(row){
    $(propRowDivOlDiv).append("符号:<select class='editInput' name='"+row.left+"'>" +
        "<option "+((row.operator=="==")?"selected":"")+" value='=='>=</option>" +
        "<option "+((row.operator=="!=")?"selected":"")+" value='!='>!=</option>" +
        (fieldTypeJson[row.left]!="boolean"?
        "<option "+((row.operator=="in")?"selected":"")+" value='in'>in</option>"+
        "<option "+((row.operator=="not in")?"selected":"")+" value='not in'>not in</option>"+
        (fieldTypeJson[row.left]!="string"?
        "<option "+((row.operator=="<")?"selected":"")+" value='&lt;'>&lt;</option>" +
        "<option "+((row.operator=="<=")?"selected":"")+" value='&lt;='>&lt;=</option>" +
        "<option "+((row.operator==">")?"selected":"")+" value='&gt;'>&gt;</option>" +
        "<option "+((row.operator==">=")?"selected":"")+" value='&gt;='>&gt;=</option>" +
        "<option "+((row.operator=="(,)")?"selected":"")+" value='(,)'>(,)</option>"+
        "<option "+((row.operator=="[,]")?"selected":"")+" value='[,]'>[,]</option>"+
        "<option "+((row.operator=="(,]")?"selected":"")+" value='(,]'>(,]</option>"+
        "<option "+((row.operator=="[,)")?"selected":"")+" value='[,)'>[,)</option>":""):"") +
        "</select>&nbsp;&nbsp;&nbsp;值:");
    if(fieldTypeJson[row.left]!="boolean"){
        if(fieldDictJson[row.left]!=null){
            propRowDivOlDivDictMultiple=document.createElement("select");
            propRowDivOlDivDictMultiple.setAttribute("prop",row.left);
            propRowDivOlDivDictMultiple.setAttribute("multiple","multiple");
            propRowDivOlDivDictMultiple.setAttribute("class","editInput");
            $(propRowDivOlDiv).append(propRowDivOlDivDictMultiple);
            bindDictMultiple($(propRowDivOlDivDictMultiple),row.left,false);
            setDictMultiple($(propRowDivOlDivDictMultiple),row.right);
        }else{
            $(propRowDivOlDiv).append("<input name='"+row.left+"' value=\""+row.right+"\" class='editInput'>");
        }
    }else{
        $(propRowDivOlDiv).append("<select class='editInput'  name='"+row.left+"' value=\""+row.right+"\">" +
            "<option value='true' "+(row.right=="true"?"selected":"")+">是</option>" +
            "<option value='false' "+(row.right=="false"?"selected":"")+">否</option></select>");
    }
    $(propRowDivOlDiv).append("&nbsp;&nbsp;分数:");
    $(propRowDivOlDiv).append("<input class='editInput' name='score_"+row.left+"' value=\""+row.score+"\">\n");
}
//属性框内继续增加一行属性
function appendRow(btn,left,alias,right,operator,score){
    propRowDivOlDiv=document.createElement("div");
    propRowDivOlDiv.setAttribute("class","subrow");
    propRowDivOlDiv.setAttribute("value",alias);
    btn.before(propRowDivOlDiv);
    addRow({"alias":""+alias+"","left":""+left+"","operator":""+operator+"","right":""+right+"","score":score},propRowDivOlDiv);
    $(propRowDivOlDiv).append("&nbsp;&nbsp;<button class='btn btn-info' onclick='$(this).parent().remove()'>删除</button>");
}
var dmp = new diff_match_patch();
function showDiff(){
    jQuery('#modal-diff').modal('show', {backdrop: 'static'});
    var old="";
    $.each(oldJsonRule,function(){
        if(fieldDictJson[this.left]==null) {
            old += "条件["+this.alias + " " + this.operator + " " + this.right + "] 分[" + this.score + "] 系数[" + this.pd + "]\n";
        }else{
            var crule=this;
            var dictstr=[];
            var rights;
            if(this.operator.indexOf(",")||this.operator.indexOf("in")){
                rights=this.right.split(",");
            }else{
                rights=[this.right];
            }
            $.each(rights,function(){
                var item;
                var cright=this;
                var dicts=dictsJson[fieldDictJson[crule.left]];
                $.each(dicts,function(){
                    if(this.value==cright){
                        if(fieldDictJson[crule.left]==1) {
                            dictstr.push((this.label.indexOf(" ")==-1?this.label:this.label.substring(this.label.indexOf(" "),this.label.length)) );
                        }else{
                            dictstr.push(this.label);
                        }
                    }
                });
            });
            old += "条件["+this.alias + " " + this.operator + " " + dictstr+ "] 分[" + this.score + "] 系数[" + this.pd + "]\n";
        }
    });
    var new_="";
    $.each(getDroolsJson(),function(){
        if(fieldDictJson[this.left]==null) {
            new_ += "条件["+this.alias + " " + this.operator + " " + this.right + "] 分[" + this.score + "] 系数[" + this.pd + "]\n";
        }else{
            var crule=this;
            var dictstr=[];
            var rights;
            if(this.operator.indexOf(",")||this.operator.indexOf("in")){
                rights=this.right.split(",");
            }else{
                rights=[this.right];
            }
            $.each(rights,function(){
                var item;
                var cright=this;
                var dicts=dictsJson[fieldDictJson[crule.left]];
                $.each(dicts,function(){
                    if(this.value==cright){
                        if(fieldDictJson[crule.left]==1) {
                            dictstr.push((this.label.indexOf(" ")==-1?this.label:this.label.substring(this.label.indexOf(" "),this.label.length)) );
                        }else{
                            dictstr.push(this.label);
                        }
                    }
                });
            });
            new_ += "条件["+this.alias + " " + this.operator + " " + dictstr+ "] 分[" + this.score + "] 系数[" + this.pd + "]\n";
        }
    });
    var d = dmp.diff_main(old, new_);
    var ds = dmp.diff_prettyHtml(d);
    document.getElementById('diffDiv').innerHTML = ds;
}
//保存规则
function save(){
    //非空 和类型校验
    if(checkDroolsJson()){
        showDiff();
    }
}
function savePdEvalClick() {
    if(confirm('保存公式前请先测试，是否已测试？')){
        $.ajax({
            type: "POST",
            url: basePath + "web/"+appPath+"/drools/savePdEval",
            data: JSON.stringify({
                pdEval : $('#pdEval').val()
            }),
            contentType: 'application/json',
            success: function (response) {
                if (response.success) {
                    alert('保存成功');
                } else {
                    alert(response.data);
                }
            }, error: function () {
                alert('系统异常');
            }
        });
    }
}
function doSave(){
    if(confirm("保存前请先使用测试是否正确，是否已测试？")) {
        $('.page-loading-overlay').removeClass('loaded');
        $.ajax({
            type: "POST",
            url: basePath + "web/"+appPath+"/drools/doPdEdit",
            data: JSON.stringify({
                droolsFile: JSON.stringify(getDroolsJson()),
                ruleCode: ruleCode,
                id: packId,
                pdEval : $('#pdEval').val(),
                ruleBiztypeId:ruleBiztypeId,
                customVersion:$('#confirmVersion').val(),
                remark:$('#confirmRemark').val(),
                approveReason:$('#approveReason').val(),
                isUrgent:$('.isUrgent:checked').val(),
                ruleVersion:$('#ruleVersion').val()
            }),
            contentType: 'application/json',
            success: function (response) {
                if (response.success) {
                    $('.page-loading-overlay').addClass('loaded');
                    alert('保存成功');
                    jQuery('#modal-diff').modal('hide');
                    window.location.reload();
                } else {
                    $('.page-loading-overlay').addClass('loaded');
                    alert(response.data);
                }
            }, error: function () {
                $('.page-loading-overlay').addClass('loaded');
                alert('系统异常');
            }
        });
    }
}
//检查提交数据
function checkDroolsJson(){
    ck=true;
    $('#rules').find(".subrow").each(function(){
        if(!ck)return;
        //属性中文名
        propName=$(this).attr("value");
        //属性名
        checkType=$(this).find('.editInput')[0].name;
        if ($('#pd_'+checkType).val()==""||isNaN($('#pd_'+checkType).val())) {
            alert(propName+' 概率 请输入数值');
            ck = false;
            return;
        }
        //操作符
        checkOperator=$(this).find('.editInput')[0].value;
        //值
        if($($(this).find('.editInput')[1]).val() instanceof Array){
            checkValue=$($(this).find('.editInput')[1]).val().join(",");
        }else{
            checkValue=$($(this).find('.editInput')[1]).val()
        }
        //分
        checkScore=$(this).find('.editInput')[2].value;
        if(checkValue==""||checkValue==null){
            alert('请输'+propName+'入值');
            ck= false;return;
        }
        if(fieldTypeJson[checkType]==null){
            alert('后台程序不支持'+propName+"属性");
            ck= false;return;
        }
        if(fieldTypeJson[checkType]=="boolean"&&checkValue!="true"&&checkValue!="false"){
            alert(propName+"属性请输入true或false");
            ck= false;return;
        }
        if (checkScore==""||isNaN(checkScore)) {
            alert('分数请输入数字');
            ck = false;
            return;
        }
        if(checkOperator.indexOf("in")!=-1||checkOperator.indexOf(",")!=-1){
            checkValues=checkValue.split(",");
            if(checkValues.length!=2&&checkOperator.indexOf(",")!=-1){
                alert(propName + "属性请输入区间值");
                ck = false;
                return;
            }
        }else{
            checkValues=[checkValue];
        }
        $.each(checkValues, function() {
            if (fieldTypeJson[checkType] == "int" && (isNaN(this) || this.indexOf(".") != -1)) {
                alert(propName + "属性请输入整数值");
                ck = false;
                return;
            }
            if (fieldTypeJson[checkType] == "double" && isNaN(this)) {
                alert(propName + "属性请输入数值");
                ck = false;
                return;
            }
        });
    });
    return ck;
}
//测试规则
function test(){
    if(checkTest()&&checkDroolsJson()) {
        propJson = getPropJson();
        propJson["droolsJson"] = JSON.stringify(getDroolsJson());
        propJson["ruleBiztypeId"] = ruleBiztypeId;
        propJson["pdEval"] = $('#pdEval').val();
        $('.page-loading-overlay').removeClass('loaded');
        $.ajax({
            type: "POST",
            url: basePath + "web/"+appPath+"/drools/doPdEditTest",
            data: JSON.stringify(propJson),
            contentType: 'application/json',
            success: function (response) {
                if (response.success) {
                    $('.page-loading-overlay').addClass('loaded');
                    resuleJson = eval("(" + response.data + ")");
                    $('.testResult').html('');
                    $.each(resuleJson.list, function () {
                        $('.testResult').append("<tr><td width='20%'>" + this.itemName + "</td><td>" + this.itemScore + "</td></tr>");
                    });
                    $('.testResult').append("<tr><td colspan='2'><b>违约率：" + resuleJson.score + "</b></td></tr>");
                } else {
                    $('.page-loading-overlay').addClass('loaded');
                    alert(response.data);
                }
            }, error: function () {
                $('.page-loading-overlay').addClass('loaded');
                alert('系统异常');
            }
        });
    }
}
//检查提交数据
function checkTest(){
    ck=true;
    $("input[name='testProp'],select[name='testProp']").each(function(){
        if($(this).val() instanceof Array){
            testval=$(this).val().join(",")
        }else{
            testval=$(this).val();
        }
        if(testval!=""){
            if(fieldTypeJson[$(this).attr("prop")]=="int"&&(isNaN(testval)||testval.indexOf(".")!=-1)){
                alert($(this).attr("prop")+"属性请输入整数值");
                ck= false;return;
            }
            if(fieldTypeJson[$(this).attr("prop")]=="double"&&isNaN(testval)){
                alert($(this).attr("prop")+"属性请输入数值");
                ck= false;return;
            }
            if(fieldTypeJson[$(this).attr("prop")]=="boolean"&&testval!="true"&&testval!="false"){
                alert($(this).attr("prop")+"属性请输入true或false");
                ck= false;return;
            }
        }
    });
    return ck;
}
//将页面编辑的规则转成json格式
function getDroolsJson(){
    jsonarray=[];
    $('#rules').find(".subrow").each(function(){
        if($($(this).find('.editInput')[1]).val() instanceof Array){
            jsonarray.push({"alias":$(this).attr("value"),
                "left":$(this).children()[0].name,
                "operator":$(this).find('.editInput')[0].value,
                "right":$($(this).find('.editInput')[1]).val().join(","),
                "score":$(this).find('.editInput')[2].value,
                "pd":$('#pd_'+$(this).children()[0].name).val()});
        }else{
            jsonarray.push({"alias":$(this).attr("value"),
                "left":$(this).children()[0].name,
                "operator":$(this).find('.editInput')[0].value,
                "right":$($(this).find('.editInput')[1]).val(),
                "score":$(this).find('.editInput')[2].value,
                "pd":$('#pd_'+$(this).children()[0].name).val()});
        }

    });
    return jsonarray;
}
//将测试字段转成json格式
function getPropJson(){
    propJson_={};
    $("input[name='testProp'],select[name='testProp']").each(function(){
        if($(this).val()!=null&&$(this).val()!=""){
            if($(this).val() instanceof Array){
                propJson_[$(this).attr("prop")]=$(this).val().join(",");
            }else{
                propJson_[$(this).attr("prop")]=$(this).val();
            }
        }
    });
    return propJson_;
}
testMultipleId=0;
//初始化编辑页面
$(function(){
    $.each(fieldTypeJson, function(key,value) {
        testMultipleId++;
        $('.test').append("<tr id='testtr_"+key+"' style='display: none;'>" +
            "   <td id='testtr_alias_"+key+"'></td>\n" +
            "   <td>"+value+"</td>\n" +
            "   <td width='35%'>\n" +
            (value != "boolean"
                    ?
                (fieldDictJson[key]==null?"<input class='editInput' name='testProp' prop='"+key+"' id=\"test_" +key+ "\">\n":
                "<select class='editInput' name='testProp' prop='"+key+"' id='testMultipleId"+testMultipleId+"'></select>")
                    :
                "<select name='testProp' prop='"+key+"' id=\"test_"+key+"\">\n" +
                "   <option value=\"true\">是</option>\n" +
                "   <option value=\"false\">否</option>\n" +
                "</select>\n"
            )
            +
            "   </td>\n" +
            " </tr>"
        );
        if(fieldDictJson[key]!=null) {
            bindDictMultiple($('#testMultipleId' + testMultipleId),key,true);
        }
    });
    $.each(droolsJson, function() {
        eachRow=this;
        if(eachRow.whens.length==1){
            init_item_operator=eachRow.whens[0].operator;
            init_item_right=eachRow.whens[0].right;
        }else{
            init_item_operator=parseOperator(eachRow.whens[0].operator)+","+parseOperator(eachRow.whens[1].operator);
            init_item_right=eachRow.whens[0].right+","+eachRow.whens[1].right;
        }
        if ($.inArray(eachRow.whens[0].left, array) == -1) {
            add({
                "alias": eachRow.alias,
                "left": eachRow.whens[0].left,
                "operator": init_item_operator,
                "right": init_item_right,
                "score": eachRow.score,
                "id": eachRow.id,
                "pd": eachRow.pd
            });
        } else {
            appendRow(
                $("#div_" + eachRow.whens[0].left).find("button:contains('增加')"),
                eachRow.whens[0].left,
                eachRow.alias,
                init_item_right,
                init_item_operator,
                eachRow.score);
        }
    });
    $('.left').resize(function(){$('.right').height($('.left').height());});
    $('.right').resize(function(){$('.left').height($('.right').height());});
    //记录未改动规则 提交时做比较
    oldJsonRule=getDroolsJson();
});

/**
 * 绑定字典下拉框
 * @param propRowDivOlDivMultiple
 */
intzindex=999;
function bindDictMultiple(propRowDivOlDivMultiple,key,isTest){
    //对城市特殊处理
    if(fieldDictJson[key]==1){
        includeSelectAllOption_=true;
        enableFiltering_=true;
    }else{
        includeSelectAllOption_=false;
        enableFiltering_=false;
    }
    if(isTest) {
        propRowDivOlDivMultiple.multiselect({
            buttonWidth: '120px',
            includeSelectAllOption: includeSelectAllOption_,
            enableFiltering: enableFiltering_
        });
    }else{
        propRowDivOlDivMultiple.multiselect({
            buttonWidth: '120px',
            includeSelectAllOption: includeSelectAllOption_,
            enableFiltering: enableFiltering_,
            onDropdownShow: function (event) {
                cuttentMu = this.$select;
                if(fieldDictJson[$(cuttentMu).attr("prop")]==1){
                    includeSelectAllOption_=true;
                    enableFiltering_=true;
                    templatesUl='<ul class="multiselect-container dropdown-menu mydropdown-menu"></ul>';
                }else{
                    includeSelectAllOption_=false;
                    enableFiltering_=false;
                    templatesUl='<ul class="multiselect-container dropdown-menu"></ul>';
                }
                containerTop = cuttentMu.offset().top;
                containerLeft = cuttentMu.offset().left;
                $('body').append("<select id=\"hiddenSelect\" style=\"display: none\" multiple=\"multiple\"></select>");
                $('#hiddenSelect').multiselect({
                    buttonWidth: '120px',
                    includeSelectAllOption: includeSelectAllOption_,
                    enableFiltering: enableFiltering_,
                    enableClickableOptGroups: true,
                    onDropdownHide: function (event) {
                        cuttentMu.multiselect('dataprovider', dictsJson[fieldDictJson[$(cuttentMu).attr("prop")]]);
                        cuttentMu.multiselect('select', $('#hiddenSelect').val(), true);
                        $('#hiddenSelect').multiselect('destroy');
                        $('#hiddenSelect').remove();
                    },
                    templates: {
                        ul:templatesUl
                    }
                });
                //处理城市 group
                if(includeSelectAllOption_){
                    $('#hiddenSelect').multiselect('dataprovider', toGroup(dictsJson[fieldDictJson[$(cuttentMu).attr("prop")]]));
                    lirow=0;
                    $.each($($('#hiddenSelect').next().children()[1]).find('li'),function() {

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
                }else{
                    $('#hiddenSelect').multiselect('dataprovider', dictsJson[fieldDictJson[$(cuttentMu).attr("prop")]]);
                }
                $('#hiddenSelect').multiselect('select', cuttentMu.val(), true);
                $('#hiddenSelect').parent().css({
                    position: "absolute",
                    'top': containerTop - 34,
                    'left': containerLeft - 57,
                    'z-index': ++intzindex
                });
                $('#hiddenSelect').next().children()[0].click();
                cuttentMu.multiselect('dataprovider', []);
            }
        });
    }
    if(fieldDictJson[key]==1) {
        propRowDivOlDivMultiple.multiselect('dataprovider', toGroup(dictsJson[fieldDictJson[key]]));
    }else{
        propRowDivOlDivMultiple.multiselect('dataprovider', dictsJson[fieldDictJson[key]]);
    }
}

function setDictMultiple(propRowDivOlDivMultiple,value){
    propRowDivOlDivMultiple.multiselect('select', value.split(","), true);
}
function parseOperator(operator){
    if(operator==">"){
        return "(";
    }else if(operator==">="){
        return "[";
    }else if(operator=="<"){
        return ")";
    }else if(operator=="<="){
        return "]";
    }
}
function showTest(){
    if(checkDroolsJson()){jQuery('#modal-test').modal('show', {backdrop: 'static'});}
}
function toGroup(city){
    var group=[];
    var subgroup={};
    var tmpgrouname=''
    $.each(city, function() {
        subtext=this.label.substring(0,this.label.indexOf(" "));
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