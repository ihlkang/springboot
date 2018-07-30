package com.lkh.springboot.util.redis;

public interface KeyPrefix {
    public int expireSeconds();
    public String getPrefix();
}
