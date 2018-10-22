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
    if(typeof jsMind.copy != 'undefined'){return;}

    var jdom = jsMind.util.dom;

    jsMind.copy = function(jm){
        this.jm = jm;
        this.copy_node;
    };

    jsMind.copy.prototype = {
        init:function(){
            this._event_bind();
        },
        get_selected_node:function(){
            return this.jm.get_selected_node();
        },
        _event_bind:function(){
            jdom.add_event($d,'keydown',function(e){
                var evt = e || event;
                if (evt.ctrlKey==1)
                {
                    if(evt.keyCode==86){
                        if(document.activeElement.tagName.toLowerCase()=="input"){
                            this.copy_node=null;
                        }
                        if(this.copy_node!=null){
                            var copy_to=this.jm.get_selected_node();
                            if(copy_to==this.copy_node){
                                copy_to=this.copy_node.parent
                            }
                            if(copy_to!=null&&!copy_to.topic.startsWith("通过")&&!copy_to.topic.startsWith("转人工审核")){
                                var copy_node2 = deepCopy(this.copy_node);
                                if(this.copy_node.parent.data.left!=copy_to.data.left){
                                    copy_node2.data.operation="[{\"left\":\""+copy_to.data.left+"\"}]";
                                }
                                this.jm.copy_node(copy_to,copy_node2,true);
                            }
                        }
                        this.copy_node=null;
                    }
                    if(evt.keyCode==67){
                        this.copy_node=this.jm.get_selected_node();
                    }
                }
            }.bind(this));
        },

    };
    function deepCopy(obj){
        var newobj = {};
        newobj.topic=obj.topic;
        newobj.data={"left":obj.data.left,"operation":obj.data.operation,"right":obj.data.right};
        newobj.children=[];
        for(var i=0;i<obj.children.length;i++){
            newobj.children.push(deepCopy(obj.children[i]))
        }
        return newobj;
    }
    var copy_plugin = new jsMind.plugin('copy',function(jm){
        var jd = new jsMind.copy(jm);
        jd.init();
    });

    jsMind.register_plugin(copy_plugin);
})(window);
