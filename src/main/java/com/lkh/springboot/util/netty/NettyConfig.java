package com.lkh.springboot.util.netty;

import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;
/**
* @Description:    存储Netty的全局配置
* @Author:         lkhu
* @CreateDate:     2018/8/5 11:10
* @Version:        1.0
*/
public class NettyConfig {
    /*
     * 存储
     */
    public static ChannelGroup group = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
}
