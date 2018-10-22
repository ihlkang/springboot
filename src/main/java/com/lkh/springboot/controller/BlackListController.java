package com.lkh.springboot.controller;

import com.alibaba.fastjson.JSON;
import com.lkh.springboot.model.BlackUser;
import com.lkh.springboot.service.UserService;
import com.lkh.springboot.util.FileUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/black")
public class BlackListController {

    private static Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    @Autowired
    public BlackListController(UserService userService){
        this.userService = userService;
    }
    @RequestMapping("/index")
    public String index(@ModelAttribute(value = "userBean") BlackUser userBean,Model model){
        List<BlackUser> users = userService.queryBlack();
        model.addAttribute("users",users);
        return "blacklist";
    }

    /**
     * 下载模板文件
     *
     * @param response
     * @throws Exception
     */
    @RequestMapping(value = "/downloadtemplate")
    public void downloadTemplate(HttpServletResponse response) {
        FileUtil.download(response, "blacklist.xlsx");
    }

    @RequestMapping("/upload")
    public void importBlackList(HttpServletResponse response, MultipartFile fileField) throws IOException {
        /*if (StringUtils.isBlank(UserUtil.getCurrentUsername())) {
            response.getOutputStream().write(("<script>parent.showMsg('请先登陆');</script>").getBytes("utf-8"));
            return;
        }*/
        String msg = "上传失败";
        //成功数
        int successNum = 0;
        // 循环所有行
        int line = 0;
        int totalLine = 0;
        List<Integer> failList = new ArrayList<>();
        try {
            if (fileField.getOriginalFilename().endsWith(".xlsx")) {
                XSSFWorkbook readWorkBook = new XSSFWorkbook(fileField.getInputStream());
                // 输入文件第一个sheet
                Sheet inputSheet = readWorkBook.getSheetAt(0);

                //无数据 直接跳出循环
                if (inputSheet.getLastRowNum() <= 0) {
                    return;
                }
                totalLine = inputSheet.getLastRowNum();
                // 行-中间值存储
                Row inputRow = null;
                List<BlackUser> blackLists = new ArrayList<>(128);
                // 最后一行的索引 16行的索引是15
                while (totalLine >= (line + 1) && null != inputSheet.getRow(line + 1)) {
                    // 第二行开始读-索引1开始
                    line++;
                    try {
                        // 取第i行
                        inputRow = inputSheet.getRow(line);
                        if (null != inputRow) {
                            // 读取数据Cell
                            // 单元格 黑名单姓名
                            String name = FileUtil.getExcelCellStringValue(inputRow.getCell(0));
                            //手机号
                            String mobile = FileUtil.getExcelCellStringValue(inputRow.getCell(1));
                            if (StringUtils.isBlank(name)) {
                                failList.add(line + 1);
                                continue;
                            }
                            BlackUser vo = new BlackUser();
                            vo.setName(name);
                            vo.setMobile(mobile);
                            blackLists.add(vo);
                        } else {
                            failList.add(line + 1);
                        }
                    } catch (Exception e) {
                        failList.add(line + 1);
                    }
                }
                successNum = userService.importBlack(blackLists);
                msg = "导入成功" + successNum + "条，失败行：" + JSON.toJSONString(failList);
            } else {
                msg = "文件格式错误";
            }
        } catch (Exception e) {
            log.error("上传文件异常", e);
            msg = "上传失败";
        }
        response.getOutputStream().write(("<script>parent.showMsg(" + "'" + msg + "'" + ");</script>").getBytes("utf-8"));
    }
}
