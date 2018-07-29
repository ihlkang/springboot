package com.lkh.springboot.mapper;

import com.lkh.springboot.model.User;

public interface UserMapper {
    User findById(int id);

    User findByMobile(String mobile);

    void createUser(int id, String mobile);

}
