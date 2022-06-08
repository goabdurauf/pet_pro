package uz.smart.service.report;

import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import uz.smart.payload.*;
import uz.smart.service.OrderService;
import uz.smart.utils.AppConstants;
import uz.smart.utils.JasperHelper;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderReportService {

    @Autowired
    OrderService orderService;

    @Value("${jasper.report-template-directories.reportsDir}")
    protected String reportsDir;

    public byte[] exportFile(ReqOrderSearch req) {

        List<ResOrder> orderReport = orderService.getOrderReportByFilter(req);
        List<OrderReport> orderReports = new ArrayList<>();
        List<JasperPrint> sheets = new ArrayList<>();
        long rowNum = 1;
        for (ResOrder resOrder : orderReport) {
            OrderReport report = new OrderReport();
            report.setRowNum(rowNum++);
            report.setNum(resOrder.getNum());
            report.setDate(resOrder.getDate());
            report.setStatusId(resOrder.getStatusId());
            report.setStatusName(resOrder.getStatusName());
            report.setClientName(resOrder.getClientName());
            report.setManagerName(resOrder.getManagerName());
            if (!resOrder.getShippingList().isEmpty()) {
                for (ResShipping resShipping : resOrder.getShippingList()) {
                    report.setCurrierName(resShipping.getCarrierName());
                    report.setShippingNum(resShipping.getNum());
                    report.setTransportNum(resShipping.getShippingNum());
                }
            }
            orderReports.add(report);
        }

        String[] sheetNames = {"Заказы"};
        try {
            JasperReport jasper;
            JasperPrint print;
            {
                jasper = JasperHelper.compileJasperReport(reportsDir, "OrderReport.jrxml");
                JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(orderReports);
                Map<String, Object> params = new HashMap<>();
                print = JasperFillManager.fillReport(jasper, params, dataSource);
                sheets.add(print);
            }
            return JasperHelper.exportReport(sheetNames, sheets).toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }

    public void download(HttpServletResponse response, ReqOrderSearch req) throws IOException {
        byte[] file = exportFile(req);
        int minute = LocalDateTime.now().getMinute();
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + "OrderReport_" + minute + ".xlsx\"");
        response.setContentType(AppConstants.CONTENT_TYPE);
        if (file != null)
            FileCopyUtils.copy(file, response.getOutputStream());
    }
}

