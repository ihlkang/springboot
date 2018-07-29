package com.lkh.springboot.service;

import com.lkh.springboot.model.User;
import com.lkh.springboot.util.Pair;

public interface UserService {

    Pair<String,User> loginUserByMobile(String mobile, String password);
}
