package com.lkh.springboot.controller.response.type;

import com.google.common.base.Strings;

import javax.annotation.Nonnull;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

public interface ResponseType {
    int getCode();
    String getMsg();
    static <E extends ResponseType> E fromCode(E[] enums,int code){
        for(E e:enums){
            if(e.getCode() == code){
                return e;
            }
        }
        throw new AssertionError("未设置异常提示");
    }

    @Nonnull
    default Map<String,Object> toResponseBody(String msg,Map<String,?> data){
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("code",this.getCode());
        result.put("msg", Strings.isNullOrEmpty(msg)?this.getMsg():msg);
        if(Objects.nonNull(data)){
            result.put("data",data);
        }
        return result;
    }

    @Nonnull
    default Map<String,Object> toResponseBody(@Nonnull Map<String,?> data){
        return toResponseBody(null,data);
    }

    @Nonnull
    default Map<String,Object> toResponseBody(){
        return toResponseBody(null,(Map<String,?>) null);
    }
}
