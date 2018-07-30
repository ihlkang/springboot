package com.lkh.springboot.util;

import java.util.Random;

public class TokenUtil {
    private static final char[] CHARACTER_SET = new char[62];

    private static final Random ranDom = new Random();

    static{
        int i = 0;
        for (; i < 10; i++) {
            CHARACTER_SET[i] = Character.forDigit(i,10);
        }
        for (; i < 36; i++) {
            CHARACTER_SET[i] = (char)('A'+(i-10));
        }
        for (; i < 62; i++) {
            CHARACTER_SET[i] = (char)('a'+(i-36));
        }
    }

    public static String generate(){
        return generate(40,"-",8);
    }

    public static String generate(int length,String delimiter,int delimiterGap){
        StringBuilder builder = new StringBuilder();
        final int actualLength = length + delimiter.length()*(length/delimiterGap-1);
        for (int i = 0; i < length; i++) {
            builder.append(nextRandomCharacter());
            if((i+1)%delimiterGap == 0 && i!=0){
                if (builder.length()<actualLength){
                    builder.append(delimiter);
                }
            }
        }
        return builder.toString();
    }
    private static char nextRandomCharacter(){
        return CHARACTER_SET[ranDom.nextInt(CHARACTER_SET.length)];
    }
}
