package com.ckawls.learnboot.study;

import java.util.concurrent.Callable;

public class CallableThread implements Callable{
    private int sum = 0;
    @Override
    public Object call() throws Exception {
        for (int i = 0; i < 100; i++) {
            if(i % 2 == 0){
                sum += 1;
                System.out.println(Thread.currentThread().getName() + ":" + i);
            }
        }
        return sum;
    }
}
