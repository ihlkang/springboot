package com.lkh.springboot.util.redis;

import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.Objects;

@Service
public class RedisService {

    @Autowired
    JedisPool jedisPool;

    public <T> T get(KeyPrefix prefix,String key,Class<T> clazz){
        Jedis jedis = jedisPool.getResource();
        String reallyKey = prefix.getPrefix()+key;
        String str = jedis.get(reallyKey);
        T t = stringToBean(str,clazz);
        return t;
    }

    public <T> boolean set(KeyPrefix prefix,String key,T value){
        Jedis jedis = null;
        try{
            jedis = jedisPool.getResource();
            String str = beanToString(value);
            if(Objects.isNull(str) || str.length()<=0){
                return false;
            }
            String realKey = prefix.getPrefix()+key;
            int seconds = prefix.expireSeconds();
            if(seconds<=0){
                jedis.set(realKey,str);
            }else{
                jedis.setex(realKey,seconds,str);
            }
            return true;
        }finally {
            returnToPool(jedis);
        }
    }

    private void returnToPool(Jedis jedis) {
        if(Objects.nonNull(jedis)){
            jedis.close();
        }
    }

    private <T> String beanToString(T value) {
        if(Objects.isNull(value)){
            return null;
        }
        Class<?> clazz = value.getClass();
        if(clazz == int.class || clazz == Integer.class){
            return value+"";
        }else if(clazz == String.class){
            return (String) value;
        }else if(clazz == long.class || clazz == Long.class){
            return ""+value;
        }else{
            return JSON.toJSONString(value);
        }
    }

    private <T> T stringToBean(String str, Class<T> clazz) {
        if(str == null || str.length()<=0 || clazz == null){
            return null;
        }
        if(clazz == int.class || clazz == Integer.class){
            return (T)Integer.valueOf(str);
        }else if(clazz == String.class){
            return (T)str;
        }else if(clazz == long.class || clazz == Long.class){
            return (T)Long.valueOf(str);
        }else{
            return JSON.toJavaObject(JSON.parseObject(str),clazz);
        }
    }

}
