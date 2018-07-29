package com.lkh.springboot.util;

import java.util.Objects;

/**
* @Description:    组合，一次传递两个参数，内容无法修改
* @Author:         lkhu
* @CreateDate:     2018/7/29 16:18
* @Version:        1.0
*/
public final class Pair<F,S> {
    private final F first;
    private final S second;

    public Pair(F first, S second) {
        this.first = first;
        this.second = second;
    }

    public static <F,S> Pair<F,S> make(F first,S second){
        return new Pair<>(first,second);
    }
    //第一个<F,S>需要和入参保持一致
    public static <F,S> Pair<S,F> swap(Pair<F,S> pair){
        return new Pair<>(pair.second,pair.first);
    }

    public static <F,S> Pair<F,S> empty(){
        return new Pair<>(null,null);
    }

    public F getFirst() {
        return first;
    }

    public S getSecond() {
        return second;
    }

    public boolean isEmpty(){
        return first==null && second==null;
    }

    @Override
    public int hashCode() {
        return Objects.hash(first,second);
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj){
            return true;
        }
        if(!(obj instanceof Pair))
            return false;
        Pair pair = (Pair) obj;
        return Objects.equals(first, pair.first) &&
                Objects.equals(second,pair.second);
    }

    @Override
    public String toString() {
        return String.format("Pair: <%s,%s>",first,second);
    }
}
