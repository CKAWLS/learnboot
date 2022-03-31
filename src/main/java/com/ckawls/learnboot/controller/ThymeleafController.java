package com.ckawls.learnboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/*
  如果只是使用@RestController注解Controller，则Controller中的方法无法返回jsp页面，或者html，配置的视图解析器InternalResourceViewResolver不起作用，返回的内容就是Return 里的内容。
*/
@Controller
@RequestMapping("/thymeleaf")
public class ThymeleafController {
    @GetMapping("/index")
    public String Index(Model model){
        return "index";
    }
}
