package com.lkh.springboot.repo.impl;

import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.mapper.UserMapper;
import com.lkh.springboot.model.BlackUser;
import com.lkh.springboot.model.User;
import com.lkh.springboot.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    @Override
    public int importBlack(List<BlackUser> blackLists) {
        return userMapper.importBlack(blackLists);
    }

    @Override
    public List<BlackUser> queryBlack() {
        return userMapper.queryBlack();
    }
}
