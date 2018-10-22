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
    if(typeof jsMind.tree_draggable != 'undefined'){return;}

    var jdom = jsMind.util.dom;
    var jcanvas = jsMind.util.canvas;

    var clear_selection = 'getSelection' in $w ? function(){
        $w.getSelection().removeAllRanges();
    } : function(){
        $d.selection.empty();
    };

    var options = {
        line_width : 5,
        lookup_delay : 500,
        lookup_interval : 80
    };

    jsMind.tree_draggable = function(jm){
        this.jm = jm;
        this.e_canvas = null;
        this.canvas_ctx = null;
        this.shadow = null;
        this.shadow_w = 0;
        this.shadow_h = 0;
        this.active_node = null;
        this.target_node = null;
        this.target_direct = null;
        this.client_w = 0;
        this.client_h = 0;
        this.offset_x = 0;
        this.offset_y = 0;
        this.hlookup_delay = 0;
        this.hlookup_timer = 0;
        this.capture = false;
        this.moved = false;
    };

    jsMind.tree_draggable.prototype = {
        init:function(){
            this._create_canvas();
            this._create_shadow();
            this._event_bind();
        },

        resize:function(){
            $d.body.appendChild(this.shadow);
            this.e_canvas.width=0;
            this.e_canvas.height=0;
        },

        _create_canvas:function(){
            var c = $d.createElement('canvas');
            this.jm.view.e_panel.appendChild(c);
            var ctx = c.getContext('2d');
            this.e_canvas = c;
            this.canvas_ctx = ctx;
        },

        _create_shadow:function(){
            var s = $d.createElement('jmnode');
            s.style.visibility = 'hidden';
            s.style.zIndex = '3';
            s.style.cursor = 'move';
            s.style.opacity= '0.7';
            this.shadow = s;
        },

        reset_shadow:function(el){
            var s = this.shadow.style;
            this.shadow.id=jsMind.util.uuid.newid();;
            this.shadow.left_=$(el).attr("left_");
            this.shadow.innerHTML = el.innerHTML;
            s.left = el.style.left;
            s.top = el.style.top;
            s.width = el.style.width;
            s.height = el.style.height;
            s.backgroundImage = el.style.backgroundImage;
            s.backgroundSize = el.style.backgroundSize;
            s.transform = el.style.transform;
            this.shadow_w = this.shadow.clientWidth;
            this.shadow_h = this.shadow.clientHeight;
            if(el.innerHTML.startsWith("通过")||el.innerHTML.startsWith("转人工审核")) {
                s.backgroundColor= "#fa6721";
            }else if(el.innerHTML=='预警'){
                s.backgroundColor= "#ff0000";
            }else if(el.innerHTML=='冻结'){
                s.backgroundColor= "#4b646f";
            }else{
                s.backgroundColor="#4778c7";
            }
        },

        show_shadow:function(){
            if(!this.moved){
                this.shadow.style.visibility = 'visible';
            }
        },

        hide_shadow:function(){
            this.shadow.style.visibility = 'hidden';
        },

        clear_lines:function(){
        },

        _magnet_shadow:function(node){
            if(!!node&&!node.node.topic.startsWith('通过')&&!!node&&!node.node.topic.startsWith('转人工审核')){
                this.e_canvas.style.left=(node.sp.x>node.np.x?node.np.x:node.sp.x)+"px";
                this.e_canvas.style.top=(node.sp.y>node.np.y?node.np.y:node.sp.y)+"px";
                this.e_canvas.width=200;
                this.e_canvas.height=200;
                var ctx = this.e_canvas.getContext('2d');
                ctx.lineWidth = options.line_width;
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.lineCap = 'round';
                jcanvas.clear(ctx, 0, 0, 999, 999);
                jcanvas.lineto(ctx,
                    node.sp.x-(node.sp.x>node.np.x?node.np.x:node.sp.x),
                    node.sp.y-(node.sp.y>node.np.y?node.np.y:node.sp.y),
                    node.np.x-(node.sp.x>node.np.x?node.np.x:node.sp.x),
                    node.np.y-(node.sp.y>node.np.y?node.np.y:node.sp.y));
            }
        },

        _lookup_close_node:function(){
            var root = this.jm.get_root();
            var root_location = root.get_location();
            var root_size = root.get_size();
            var root_x = root_location.x + root_size.w/2;

            var sw = this.shadow_w;
            var sh = this.shadow_h;
            var sx = this.shadow.offsetLeft-$('.left').width()+$('.jsmind-inner').scrollLeft();
            var sy = this.shadow.offsetTop+$('.jsmind-inner').scrollTop();

            var ns,nl;

            var direct = (sx + sw/2)>=root_x ?
                jsMind.direction.right : jsMind.direction.left;
            var nodes = this.jm.mind.nodes;
            var node = null;
            var min_distance = Number.MAX_VALUE;
            var distance = 0;
            var closest_node = null;
            var closest_p = null;
            var shadow_p = null;
            for(var nodeid in nodes){
                var np,sp;
                node = nodes[nodeid];
                if(node.isroot || node.direction == direct){
                    if(node.id == this.active_node.id){
                        continue;
                    }
                    ns = node.get_size();
                    nl = node.get_location();
                    if(direct == jsMind.direction.right){
                        if(sx-nl.x-ns.w<=0){continue;}
                        distance = Math.abs(sx-nl.x-ns.w) + Math.abs(sy+sh/2-nl.y-ns.h/2);
                        np = {x:nl.x+ns.w-options.line_width,y:nl.y+ns.h/2};
                        sp = {x:sx+options.line_width,y:sy+sh/2};
                    }else{
                        if(nl.x-sx-sw<=0){continue;}
                        distance = Math.abs(sx+sw-nl.x) + Math.abs(sy+sh/2-nl.y-ns.h/2);
                        np = {x:nl.x+options.line_width,y:nl.y+ns.h/2};
                        sp = {x:sx+sw-options.line_width,y:sy+sh/2};
                    }
                    if(distance < min_distance){
                        closest_node = node;
                        closest_p = np;
                        shadow_p = sp;
                        min_distance = distance;
                    }
                }
            }
            var result_node = null;
            if(!!closest_node){
                result_node = {
                    node:closest_node,
                    direction:direct,
                    sp:shadow_p,
                    np:closest_p
                };
            }
            return result_node;
        },

        lookup_close_node:function(){
            var node_data = this._lookup_close_node();
            if(!!node_data){
                this._magnet_shadow(node_data);
                this.target_node = node_data.node;
                this.target_direct = node_data.direction;
            }else{
                this.clear_lines();
                this.target_node = null;
                this.target_direct = null;
            }
        },

        _event_bind:function(){
            var jd = this;
            $('.forClone').each(function() {
                jdom.add_event(this, 'mousedown', function (e) {
                    var evt = e || event;
                    jd.dragstart.call(jd, evt);
                });
            });
            jdom.add_event(document, 'mousemove', function (e) {
                var evt = e || event;
                jd.drag.call(jd, evt);
            });
            jdom.add_event(document, 'mouseup', function (e) {
                var evt = e || event;
                jd.dragend.call(jd, evt);
            });
        },

        dragstart:function(e){
            if(!this.jm.get_editable()){return;}
            if(this.capture){return;}
            this.active_node = null;

            var jview = this.jm.view;
            var el = e.target || event.srcElement;
            this.reset_shadow(el);
            this.active_node = this.shadow;
            this.offset_x = (e.clientX || e.touches[0].clientX) - el.offsetLeft;
            this.offset_y = (e.clientY || e.touches[0].clientY) - el.offsetTop;
            this.client_hw = Math.floor(el.clientWidth/2);
            this.client_hh = Math.floor(el.clientHeight/2);
            if(this.hlookup_delay != 0){
                $w.clearTimeout(this.hlookup_delay);
            }
            if(this.hlookup_timer != 0){
                $w.clearInterval(this.hlookup_timer);
            }
            var jd = this;
            this.hlookup_delay = $w.setTimeout(function(){
                jd.hlookup_delay = 0;
                jd.hlookup_timer = $w.setInterval(function(){
                    jd.lookup_close_node.call(jd);
                },options.lookup_interval);
            },options.lookup_delay);
            this.capture = true;
        },

        drag:function(e){
            if(!this.jm.get_editable()){return;}
            if(this.capture){
                e.preventDefault();
                this.show_shadow();
                this.moved = true;
                clear_selection();
                var px = (e.clientX || e.touches[0].clientX) ;
                var py = (e.clientY || e.touches[0].clientY) ;
                var cx = px + this.client_hw;
                var cy = py + this.client_hh;
                this.shadow.style.left = px + 'px';
                this.shadow.style.top = py + 'px';
                clear_selection();
            }
        },

        dragend:function(e){
            if(!this.jm.get_editable()){return;}
            if(this.capture){
                if(this.hlookup_delay != 0){
                    $w.clearTimeout(this.hlookup_delay);
                    this.hlookup_delay = 0;
                    this.clear_lines();
                }
                if(this.hlookup_timer != 0){
                    $w.clearInterval(this.hlookup_timer);
                    this.hlookup_timer = 0;
                    this.clear_lines();
                }
                if(this.moved){
                    var src_node = this.active_node;
                    var target_node = this.target_node;
                    var target_direct = this.target_direct;
                    if(!!target_node&&!target_node.topic.startsWith("通过")&&!target_node.topic.startsWith("转人工审核")) {
                        this.move_node(src_node, target_node, target_direct);
                    }
                }
                this.hide_shadow();
            }
            this.moved = false;
            this.capture = false;
        },

        move_node:function(src_node,target_node,target_direct){
            var shadow_h = this.shadow.offsetTop;
            if(!!target_node && !!src_node && !jsMind.node.inherited(src_node, target_node)){
                // lookup before_node
                var sibling_nodes = target_node.children;
                var sc = sibling_nodes.length;
                var node = null;
                var delta_y = Number.MAX_VALUE;
                var node_before = null;
                var beforeid = '_last_';
                while(sc--){
                    node = sibling_nodes[sc];
                    if(node.direction == target_direct && node.id != src_node.id){
                        var dy = node.get_location().y - shadow_h;
                        if(dy > 0 && dy < delta_y){
                            delta_y = dy;
                            node_before = node;
                            beforeid = '_first_';
                        }
                    }
                }
                if(!!node_before){beforeid = node_before.id;}
                this.jm.add_move_node(target_node,src_node.id, src_node.innerHTML,{"left":src_node.left_},beforeid,target_direct);

            }
            this.active_node = null;
            this.target_node = null;
            this.target_direct = null;
        },

        jm_event_handle:function(type,data){
            if(type === jsMind.event_type.resize){
                this.resize();
            }
        }
    };

    var tree_draggable_plugin = new jsMind.plugin('tree_draggable',function(jm){
        var jd = new jsMind.tree_draggable(jm);
        jd.init();
        jm.add_event_listener(function(type,data){
            jd.jm_event_handle.call(jd,type,data);
        });
    });

    jsMind.register_plugin(tree_draggable_plugin);

})(window);
