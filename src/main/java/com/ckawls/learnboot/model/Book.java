package com.ckawls.learnboot.model;

import java.io.Serializable;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class Book implements Serializable{
    private static final long serialVersionUID = -43434343434343434L;

    private String author;
    private double price;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Shanghai")
    private Date date;
    private Integer id;
}
