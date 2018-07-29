package com.lkh.springboot.repo;

import com.lkh.springboot.model.User;

public interface UserRepository {
    User findById(int id);
    
    User findByMobile(String mobile);
    
    void createUser(int id,String mobile);
}
