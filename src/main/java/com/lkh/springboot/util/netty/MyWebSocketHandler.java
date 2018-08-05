package com.lkh.springboot.util.netty;


import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.handler.codec.http.websocketx.*;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Date;

/**
* @Description:    接受/处理/响应客户端websocket请求的核心业务处理类
* @Author:         lkhu
* @CreateDate:     2018/8/5 11:12
* @Version:        1.0
*/
public class MyWebSocketHandler extends SimpleChannelInboundHandler<Object> {

    private static final Logger logger = LoggerFactory.getLogger(MyWebSocketHandler.class);
    private WebSocketServerHandshaker handshaker;
    private static final String WEB_SOCKET_URL = "ws://localhost:8888/websocket";

    //客户端与服务端创建连接时调用
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        NettyConfig.group.add(ctx.channel());
        logger.debug("客户端与服务端连接开启...");
    }
    //客户端与服务端断开连接时调用
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        NettyConfig.group.remove(ctx.channel());
        logger.debug("客户端与服务端连接关闭...");
    }
    //服务端接收客户端发送过来的数据结束之后调用
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
    }
    //工程出现异常时调用
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }

    //服务端处理客户端请求的核心方法
    @Override
    protected void messageReceived(ChannelHandlerContext context, Object msg) throws Exception {
        //处理客户端向服务端发起http握手请求的业务
        if(msg instanceof FullHttpRequest){
            handHttpRequest(context,(FullHttpRequest) msg);
        }else if(msg instanceof WebSocketFrame){//处理websocket连接业务
            handWebSocketFrame(context,(WebSocketFrame) msg);
        }
    }

    /**
     * 处理客户端和服务端之间的webscoket业务
     * @param ctx
     */
    private void handWebSocketFrame(ChannelHandlerContext ctx,WebSocketFrame frame){
        //判断是否是关闭websocket的指令
        if(frame instanceof CloseWebSocketFrame){
            handshaker.close(ctx.channel(),(CloseWebSocketFrame)frame.retain());
        }
        //判断是否是ping消息
        if(frame instanceof PingWebSocketFrame){
            ctx.channel().write(new PongWebSocketFrame(frame.content().retain()));
            return;
        }
        //判断是否是二进制消息，若是，抛出异常
        if(!(frame instanceof TextWebSocketFrame)){
            logger.debug("不支持二进制消息");
            throw new RuntimeException("["+this.getClass().getName()+"]不支持消息");
        }
        //返回应答消息
        //返回客户端向服务端发送的消息
        String request = ((TextWebSocketFrame)frame).text();
        logger.debug("服务端接受到的消息"+request);
        WebSocketFrame webSocketFrame = new TextWebSocketFrame(new Date().toString()
                                                                +ctx.channel().id()
                                                                +"===>>>"
                                                                +request);
        //群发，服务端向每个连接上的客户端群发消息
        NettyConfig.group.writeAndFlush(webSocketFrame);
    }
    /**
     * 处理客户端想服务端发起http握手请求的业务
     * @param ctx
     * @param request
     */
    private void handHttpRequest(ChannelHandlerContext ctx,FullHttpRequest request){
        if(!request.getDecoderResult().isSuccess() || !"websocket".equals(request.headers().get("Upgrade"))){
            sendHttpResponse(ctx,request,new DefaultFullHttpResponse(HttpVersion.HTTP_1_1,HttpResponseStatus.BAD_REQUEST));
            return;
        }
        WebSocketServerHandshakerFactory handshakerFactory = new WebSocketServerHandshakerFactory(WEB_SOCKET_URL,
                null,false);
        handshaker = handshakerFactory.newHandshaker(request);
        if(handshaker == null){
            WebSocketServerHandshakerFactory.sendUnsupportedWebSocketVersionResponse(ctx.channel());
        }else{
            handshaker.handshake(ctx.channel(),request);
        }
    }

    /**
     * 服务端向客户端响应消息
     * @param ctx
     * @param request
     * @param response
     */
    private void sendHttpResponse(ChannelHandlerContext ctx, FullHttpRequest request, DefaultFullHttpResponse response){
        if(response.getStatus().code()!=200){
            ByteBuf byteBuf = Unpooled.copiedBuffer(response.getStatus().toString(),CharsetUtil.UTF_8);
            request.content().writeBytes(byteBuf);
            byteBuf.release();
        }
        //服务端向客户端发送数据
        ChannelFuture channelFuture = ctx.channel().writeAndFlush(response);
        if(response.getStatus().code()!=200){
            channelFuture.addListener(ChannelFutureListener.CLOSE);
        }
    }
}
