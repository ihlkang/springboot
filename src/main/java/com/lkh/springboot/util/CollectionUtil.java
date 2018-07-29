package com.lkh.springboot.util;

import javax.annotation.Nonnull;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class CollectionUtil {
    private CollectionUtil(){
        throw new AssertionError("不可被实例化");
    }

    @SafeVarargs
    @Nonnull
    public static <F,Object> Map<F,Object> toMap(Pair<F,Object> first, Pair<F,Object>...others){
        Map<F,Object> result = new HashMap<>();
        result.put(first.getFirst(),first.getSecond());
        Arrays.stream(others)
                .forEach(p -> result.put(p.getFirst(),p.getSecond()));
        return result;
    }
}
