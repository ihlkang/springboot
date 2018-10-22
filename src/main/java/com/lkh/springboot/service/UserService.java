package com.lkh.springboot.service;

import com.lkh.springboot.controller.request.UserRequest;
import com.lkh.springboot.model.BlackUser;
import com.lkh.springboot.model.User;
import com.lkh.springboot.util.Pair;

import java.util.List;

public interface UserService {

    Pair<String,User> loginUserByMobile(String mobile, String password);

    void addUser(UserRequest userRequest);

    int importBlack(List<BlackUser> blackLists);

    List<BlackUser> queryBlack();
}
