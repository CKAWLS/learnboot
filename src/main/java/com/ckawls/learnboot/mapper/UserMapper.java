package com.ckawls.learnboot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ckawls.learnboot.model.User;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    
}
