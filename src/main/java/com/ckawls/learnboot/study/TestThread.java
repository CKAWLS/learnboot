package com.ckawls.learnboot.study;

import java.util.concurrent.FutureTask;

public class TestThread {
    public static void main(String[] args) {
        LearnThread thread1 = new LearnThread("thread1");
        LearnThread thread2 = new LearnThread("thread2");

        Thread t1 = new Thread(thread1);
        Thread t2 = new Thread(thread2);

        t1.start();
        t2.start();

        CallableThread callableThread = new CallableThread();
        FutureTask futureTask = new FutureTask<Integer>(callableThread);

        
    }
}
