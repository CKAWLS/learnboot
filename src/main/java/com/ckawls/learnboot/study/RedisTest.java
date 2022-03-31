package com.ckawls.learnboot.study;

import java.util.Date;
import com.ckawls.learnboot.model.Book;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import redis.clients.jedis.Jedis;

public class RedisTest {
    public static final String KEY_NAME = "book";

    public static void main(String[] args) {
        // try (Jedis jedis = new Jedis("localhost", 6379)) {
        // ObjectMapper objectMapper = new ObjectMapper();
        // Book book = new Book();
        // book.setId(1);
        // book.setPrice(20);
        // book.setDate(new Date());
        // book.setAuthor("超可爱王老师");
        // try {
        // jedis.append(KEY_NAME, objectMapper.writeValueAsString(book));
        // } catch (JsonProcessingException e) {
        // e.printStackTrace();
        // } finally {
        // jedis.close();
        // }
        // }

        Jedis jedis = new Jedis("localhost", 6379);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Book book = objectMapper.readValue(jedis.get(KEY_NAME), Book.class);
            Book book2 = new Book();
            book2.setAuthor("超可爱王老师");
            System.out.println(objectMapper.writeValueAsString(book2));
            System.out.println(book.toString());
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } finally {
            jedis.close();
        }
    }
}