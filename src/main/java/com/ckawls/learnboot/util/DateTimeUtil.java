package com.ckawls.learnboot.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateTimeUtil {
    public static SimpleDateFormat smp = new SimpleDateFormat("yyyy-MM-dd");
    public static void main(String[] args) throws ParseException {
		System.out.println(DateTimeUtil.getDateAfterNDays("2021-06-01", 280));
        System.out.println(DateTimeUtil.getPastDays("2021-06-01"));
	}

	/**
	 * 获取给定日期N天后的日期
	 */
	public static String getDateAfterNDays(String dateTime, int days) {
		Calendar calendar = Calendar.getInstance();
		String[] dateTimeArray = dateTime.split("-");
		int year = Integer.parseInt(dateTimeArray[0]);
		int month = Integer.parseInt(dateTimeArray[1]);
		int day = Integer.parseInt(dateTimeArray[2]);
		calendar.set(year, month - 1, day);

        calendar.add(Calendar.DATE, days);

        return smp.format(calendar.getTime());
	}

    public static long getPastDays(String dateTime) throws ParseException{
        Date date = smp.parse(dateTime);
        long Diff = new Date().getTime() - date.getTime();
        return (Diff/1000/60/60/24);
    }
}