package com.lkh.springboot.util;

import com.lkh.springboot.util.except.TimeException;

import javax.annotation.Nonnull;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Objects;

public class TimeUtil {
    private static final DateTimeFormatter dateSeparatedByDash = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter dateWithoutSeparation = DateTimeFormatter.ofPattern("yyyyMMdd");
    private TimeUtil() {
        throw new AssertionError("不可被实例化");
    }

    @Nonnull
    public static String formatDateToStringWithoutSeparation(LocalDate date) {
        try {
            return dateWithoutSeparation.format(date);
        } catch (DateTimeParseException e) {
            throw new TimeException(TimeException.ErrorType.TIME_ERROR,e);
        }
    }
    public static LocalDate formatStringToDateWithoutSeparation(String datetime) {
        try {
            return LocalDate.parse(datetime, dateWithoutSeparation);
        } catch (DateTimeParseException e) {
            throw new TimeException(TimeException.ErrorType.TIME_ERROR,e);
        }
    }

    @Nonnull
    public static String formatDateToStringSeparatedByDash(LocalDate date) {
        try {
            if (Objects.isNull(date)) return "";
            return dateSeparatedByDash.format(date);
        } catch (DateTimeParseException e) {
            throw new TimeException(TimeException.ErrorType.TIME_ERROR,e);
        }
    }

    public static LocalDate formatStringToDateSeparatedByDash(String date) {
        try {
            return LocalDate.parse(date, dateSeparatedByDash);
        } catch (DateTimeParseException e) {
            throw new TimeException(TimeException.ErrorType.TIME_ERROR,e);
        }
    }

}
