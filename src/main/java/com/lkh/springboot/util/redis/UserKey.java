package com.lkh.springboot.util.redis;

public class UserKey extends BasePrefix{
    public static final int TOKEN_EXPIRE = 3600*1*1;
    private UserKey(int expireSeconds,String prefix){
        super(expireSeconds,prefix);
    }
    public static UserKey getByMobile = new UserKey(TOKEN_EXPIRE,"mobile");
    public static UserKey token = new UserKey(TOKEN_EXPIRE,"token");
}
