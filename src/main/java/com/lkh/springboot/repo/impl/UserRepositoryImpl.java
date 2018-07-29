package com.lkh.springboot.repo.impl;

import com.lkh.springboot.mapper.UserMapper;
import com.lkh.springboot.model.User;
import com.lkh.springboot.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class UserRepositoryImpl implements UserRepository {
    private final UserMapper userMapper;

    public UserRepositoryImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Autowired

    @Override
    public User findById(int id) {
        return userMapper.findById(id);
    }

    @Override
    public User findByMobile(String mobile) {
        return userMapper.findByMobile(mobile);
    }

    @Override
    public void createUser(int id, String mobile) {
        userMapper.createUser(id,mobile);
    }
}
