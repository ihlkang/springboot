package com.lkh.springboot.mapper;

import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.model.BlackUser;
import com.lkh.springboot.model.User;

import java.util.List;

public interface UserMapper {

    User findByMobile(String mobile);

    User findByMobileAndPassword(String mobile,String password);

    void createUser(UserRequest userRequest);

    int importBlack(List<BlackUser> list);

    List<BlackUser> queryBlack();
}
