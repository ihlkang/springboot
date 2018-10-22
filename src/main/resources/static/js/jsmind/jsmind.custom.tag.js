/*
 * Released under BSD License
 * Copyright (c) 2014-2015 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function($w){
    'use strict';
    var $d = $w.document;
    var __name__ = 'jsMind';
    var jsMind = $w[__name__];
    if(!jsMind){return;}
    if(typeof jsMind.customTag != 'undefined'){return;}

    var jdom = jsMind.util.dom;

    jsMind.customTag = function(jm){
        this.jm = jm;
    };


    jsMind.customTag.prototype = {
        init:function(){
            this._event_bind();
        },

        _event_bind:function(){

            var jd = this;
            var container = this.jm.view.container;


            jdom.add_event(container,'dblclick',function(e){

                var nodeText = e.target.innerHTML;
                var jmnode;
                var nodeid;
                if(e.target.tagName.toLowerCase()=='jmnode'){
                    nodeText = e.target.innerHTML;
                    jmnode = e.target;
                    nodeid = $(jmnode).attr("nodeid");
                }

                if(e.target!=null&&(e.target.id=='customTagInput'||e.target.id=='customTagIco')){
                    return;
                }
                $('#customTagDiv').remove();
                if(e.target!=null&&e.target.tagName!='JMNODE'){
                    return;
                }
                if(e.target.innerHTML=='开始'){
                    return;
                }
                var input=document.createElement("input");
                input.size=10
                var div=document.createElement("div");
                var ico=document.createElement("li");
                var table=document.createElement("table");
                var tr=document.createElement("tr");
                var td1=document.createElement("td");
                var td2=document.createElement("td");
                ico.setAttribute('class','icon-pencil');
                $(ico).css('font-size','20px');
                $(ico).css('list-style-type','none');
                input.id="customTagInput";
                input.maxLength=20;
                div.id="customTagDiv";
                ico.id="customTagIco";
                div.style.left=e.target.style.left;
                div.style.top=($(e.target)[0].offsetTop+e.target.clientHeight+5)+"px";
                div.style.position="absolute";
                $(div).append($(table));
                $(table).append($(tr));
                $(tr).append($(td1));
                $(tr).append($(td2));
                $(td1).append($(ico));
                $(td2).append($(input));
                $("jmnodes").append($(div));


                var nodeTextarr = nodeText.toString().split("<br>标签：");
                if(nodeTextarr.length >=2)
                    $("#customTagInput").val(""+nodeTextarr[1]);

                $("#customTagInput").trigger("focus");

                var tagBlurKeyFlag = 1;
                $("#customTagInput").blur( function() {
                    /*debugger;*/
                    tagBlurKeyFlag = 2;
                    if(tagBlurKeyFlag == 2){
                        var tagValue = $("#customTagInput").val();

                        //已加过标签的。对原有标签进行修改操作。
                        var nodeTextarr = nodeText.toString().split("<br>标签：");
                        if(nodeTextarr.length >= 2){ //修改
                            if(tagValue.trim()===""){
                                nodeText = nodeTextarr[0];
                            }else{
                                nodeText = nodeTextarr[0] + "<br/>标签：" + tagValue;
                            }
                        }else {//添加
                            if(tagValue.trim()===""){
                                nodeText = nodeTextarr[0];
                            }else{
                                nodeText += "<br/>标签：" + tagValue;
                            }
                        }
                        jmnode.innerHTML = nodeText;
                        jsMind.current.update_node($(jmnode).attr("nodeid"),nodeText);
                        $("#customTagInput").innerHTML="";
                        $("#customTagDiv").hide();

                        tagBlurKeyFlag = 1;
                    }

                });

                $("#customTagInput").bind('keypress',function(event){
                    if(event.keyCode == "13")
                    {
                        $("#customTagInput").blur();
                        $('#customTagDiv').remove();
                    }
                });

            });
        }

    };

    var customTag_plugin = new jsMind.plugin('customTag',function(jm){
        var jd = new jsMind.customTag(jm);
        jd.init();
        // jm.add_event_listener(function(type,data){
        //     jd.jm_event_handle.call(jd,type,data);
        // });
    });

    jsMind.register_plugin(customTag_plugin);

})(window);