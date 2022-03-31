package com.ckawls.learnboot.controller;

import java.util.Date;
import com.ckawls.learnboot.annotation.ResponseResult;
import com.ckawls.learnboot.model.Book;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@ResponseResult
public class HelloController {
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Book hello(@PathVariable("id") Integer id) {
        Book book = new Book();
        book.setPrice(Math.random()*10);
        book.setDate(new Date());
        book.setId(id);
        book.setAuthor("JK");
        return book;
    }

    @GetMapping("/exception")
    public int testException(){
        int[] a = new int[4];
        return a[4];
    }
}
