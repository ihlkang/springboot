package com.lkh.springboot.repo.impl;

import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.mapper.UserMapper;
import com.lkh.springboot.model.User;
import com.lkh.springboot.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository("UserRepository")
public class UserRepositoryImpl implements UserRepository {
    private final UserMapper userMapper;

    @Autowired
    public UserRepositoryImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public User findByMobile(String mobile){
        return userMapper.findByMobile(mobile);
    }

    @Override
    public User findByMobileAndPassword(String mobile,String password) {
        return userMapper.findByMobileAndPassword(mobile,password);
    }

    @Override
    public void createUser(UserRequest userRequest) {
        userMapper.createUser(userRequest);
    }
}
