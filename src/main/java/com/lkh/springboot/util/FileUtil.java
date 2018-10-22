package com.lkh.springboot.util;

import org.apache.commons.io.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;

public class FileUtil {
    private static final Logger LOGGER = LoggerFactory.getLogger(FileUtil.class);

    public static void download(HttpServletResponse response, String fileName) {
        try {
            String dfileName = new String(fileName.getBytes("utf-8"), "utf-8");
            response.setContentType("application/force-download");// 设置强制下载不打开
            response.addHeader("Content-Disposition",
                    "attachment;fileName=" + dfileName);// 设置文件名
            response.addHeader("contentType", MediaType.APPLICATION_OCTET_STREAM_VALUE);
            InputStream fileInputStream = FileUtil.class.getResourceAsStream
                    ("/templates/" + dfileName);
            IOUtils.copy(fileInputStream, response.getOutputStream());
        } catch (Exception e) {
            LOGGER.error("文件下载失败，fileName={}", fileName);
        }
    }

    public static String getExcelCellValue(Cell cell) throws Exception {
        if (cell == null) {
            return null;
        }
        int type = cell.getCellType();
        switch (type) {
            case HSSFCell.CELL_TYPE_NUMERIC:
                if (HSSFDateUtil.isCellDateFormatted(cell)) {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    return sdf.format(HSSFDateUtil.getJavaDate(cell.getNumericCellValue())).toString();
                } else {
                    return new BigDecimal(cell.getNumericCellValue()).setScale(5, BigDecimal.ROUND_HALF_UP)
                            .stripTrailingZeros().toPlainString();
                }
            case HSSFCell.CELL_TYPE_STRING:
                return cell.getStringCellValue();
            default:
                return cell.getStringCellValue();
        }
    }

    public static Double getExcelCellDoubleValue(Cell cell) throws Exception {
        if (cell == null) {
            return null;
        }
        return cell.getNumericCellValue();
    }
    public static String getExcelCellStringValue(Cell cell) throws Exception {
        if (cell == null) {
            return null;
        }
        cell.setCellType(Cell.CELL_TYPE_STRING);
        return cell.getStringCellValue();
    }

}
