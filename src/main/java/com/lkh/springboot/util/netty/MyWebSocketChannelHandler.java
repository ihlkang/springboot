package com.lkh.springboot.util.netty;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.stream.ChunkedWriteHandler;

/**
* @Description:    初始化连接时候的各个组件
* @Author:         lkhu
* @CreateDate:     2018/8/5 12:38
* @Version:        1.0
*/
public class MyWebSocketChannelHandler extends ChannelInitializer<SocketChannel> {
    @Override
    protected void initChannel(SocketChannel channel) throws Exception {
        channel.pipeline().addLast("http-codec",new HttpServerCodec());
        channel.pipeline().addLast("aggregator",new HttpObjectAggregator(65536));
        channel.pipeline().addLast("http-chunked",new ChunkedWriteHandler());
        channel.pipeline().addLast("handler",new MyWebSocketHandler());
    }
}
