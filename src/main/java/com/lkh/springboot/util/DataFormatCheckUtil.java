package com.lkh.springboot.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.Period;
import java.util.Objects;
import java.util.regex.Pattern;

public class DataFormatCheckUtil {
    //身份证前17位每位加权因子
    private static final int[] power = {7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};
    //身份证第18位校检码
    private static final String[] refNumber = {"1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"};

    public static boolean checkAge(String certNo) {
        if (checkCertNo(certNo)) {
            String birthdayStr = certNo.substring(6, 14);
            LocalDate birthday = TimeUtil.formatStringToDateWithoutSeparation(birthdayStr);
            int year = Period.between(birthday, LocalDate.now()).getYears();
            return year > 20 && year < 55;
        }
        return true;
    }
    //校验手机号
    public static boolean checkMobile(String mobile) {
        return Objects.nonNull(mobile) && Pattern.matches("^1[3-9][0-9]{9}$", mobile);
    }
    //校验身份证号
    public static boolean checkCertNo(String certNo) {
        return Objects.nonNull(certNo) && Pattern.matches("\\d{17}[\\d|x|X]$", certNo) && checkIdNoLastNum(certNo);
    }
    //校验银行卡号
    public static boolean checkAccountId(String accountId) {
        return Objects.isNull(accountId) || accountId.trim().isEmpty() ||
                Pattern.matches("\\d{16,21}", accountId.trim())
                        && checkNumberNoLastNum(accountId);
    }



    public static boolean checkLicensePlate(String licensePlate) {
        return Objects.isNull(licensePlate) || licensePlate.trim().isEmpty()
                || Pattern.matches("^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$",
                licensePlate.toUpperCase());
    }

    private static String getToken() {
        int year = LocalDate.now().getYear();
        int month = LocalDate.now().getMonthValue();
        int day = LocalDate.now().getDayOfMonth();
        int sum = year + month + day;
        return TimeUtil.formatDateToStringWithoutSeparation(LocalDate.now()) + sum % 10;
    }

    //Luhn算法, 根据卡号获取校验位校验
    private static boolean checkNumberNoLastNum(String accountId) {
        int checkNum = Integer.valueOf(accountId.substring(accountId.length() - 1));
        accountId = accountId.substring(0, accountId.length() - 1);
        int totalNumber = 0;
        for (int i = accountId.length() - 1; i >= 0; i -= 2) {
            int tmpNumber = calculate(accountId.charAt(i));
            if (i == 0) {
                totalNumber += tmpNumber;
            } else {
                totalNumber += tmpNumber + Integer.parseInt(String.valueOf(accountId.charAt(i - 1)));
            }

        }
        return checkNum == ((10 - totalNumber % 10) % 10);
    }

    private static int calculate(char c) {
        String str = String.valueOf(Integer.parseInt(String.valueOf(c)) * 2);
        int total = 0;
        for (int i = 0; i < str.length(); i++) {
            total += Integer.parseInt(String.valueOf(str.charAt(i)));
        }
        return total;
    }

    private static boolean checkIdNoLastNum(String certNo) {
        char[] tmp = certNo.toUpperCase().toCharArray();
        int[] certNoArray = new int[tmp.length - 1];
        for (int i = 0; i < tmp.length - 1; i++) {
            certNoArray[i] = Integer.parseInt(tmp[i] + "");
        }
        String checkCode = sumPower(certNoArray);
        String lastNum = tmp[tmp.length - 1] + "";
        return checkCode.equals(lastNum);
    }

    //计算身份证的第十八位校验码
    private static String sumPower(int[] cardIdArray) {
        int result = 0;
        for (int i = 0; i < power.length; i++) {
            result += power[i] * cardIdArray[i];
        }
        return refNumber[(result % 11)];
    }
}
