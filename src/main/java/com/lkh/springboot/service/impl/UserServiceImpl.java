package com.lkh.springboot.service.impl;

import com.google.common.base.Strings;
import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.model.User;
import com.lkh.springboot.repo.UserRepository;
import com.lkh.springboot.service.UserService;
import com.lkh.springboot.service.except.UserException;
import com.lkh.springboot.util.Pair;
import com.lkh.springboot.util.TokenUtil;
import com.lkh.springboot.util.redis.RedisService;
import com.lkh.springboot.util.redis.UserKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service("UserService")
public class UserServiceImpl implements UserService {
    public static final String COOKI_NAME_TOKEN = "token";
    private final UserRepository userRepository;
    private final RedisService redisService;
    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           RedisService redisService) {
        this.userRepository = userRepository;
        this.redisService = redisService;
    }

    @Override
    public Pair<String, User> loginUserByMobile(String mobile, String password) {
        //判断手机号是否存在
        User user = tryToFindUser(mobile,password);
        String token = tryToPutUserInRedis(user);
        if(!Strings.isNullOrEmpty(token)){
            return Pair.make(token,user);
        }else{
            throw new UserException(UserException.ErrorType.UNMODIFIABLE_SESSION);
        }
    }

    @Override
    public void addUser(UserRequest userRequest) {
        setSaltToUser(userRequest);
        createUser(userRequest);
    }

    private void createUser(UserRequest userRequest) {
        userRepository.createUser(userRequest);
    }

    private void setSaltToUser(UserRequest userRequest) {
        String salt = TokenUtil.generate(128,"",128);
        userRequest.setPasswordSalt(salt);
    }

    private String tryToPutUserInRedis(User user) {
        String token = TokenUtil.generate();
        redisService.set(UserKey.token,token,user);
        return token;
    }

    private User tryToFindUser(String mobile,String password){
        User user = userRepository.findByMobileAndPassword(mobile,password);
        if(Objects.isNull(user)){
            user = userRepository.findByMobile(mobile);
            if(Objects.isNull(user)){
                throw new UserException(UserException.ErrorType.NONEXISTENT_MOBILE);
            }else{
                throw new UserException(UserException.ErrorType.PASSWORD_MISMATCH);
            }
        }
        return user;
    }

}
