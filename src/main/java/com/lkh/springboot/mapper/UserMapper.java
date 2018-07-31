package com.lkh.springboot.mapper;

import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.model.User;

public interface UserMapper {
    User findByMobile(String mobile);

    User findByMobileAndPassword(String mobile,String password);

    void createUser(UserRequest userRequest);

}
