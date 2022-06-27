package uz.smart.service;

import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import uz.smart.payload.OrderReport;
import uz.smart.payload.Report;
import uz.smart.utils.AppConstants;
import uz.smart.utils.JasperHelper;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Service
public class ReportService {

  @Value("${jasper.report-template-directories.reportsDir}")
  private String reportsDir;

  private byte[] exportFile(Report<?> report) throws JRException, IOException {


    JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(report.getData());
    JasperReport jasper = JasperHelper.compileJasperReport(reportsDir, report.getTemplateName());
    JasperPrint jasperPrint = JasperFillManager.fillReport(jasper, report.getParams(), dataSource);
    List<JasperPrint> sheets = List.of(jasperPrint);
    return JasperHelper.exportReport(report.getSheetNames(), sheets).toByteArray();
  }

  public void getExcelFile(HttpServletResponse response, Report<?> report) {
    try {
      byte[] file = exportFile(report);
      LocalDateTime now = LocalDateTime.now();
      response.setHeader(HttpHeaders.CONTENT_DISPOSITION,
          "attachment; filename=\"" + report.getFileName() + now + ".xlsx\"");
      response.setContentType(AppConstants.CONTENT_TYPE);
      FileCopyUtils.copy(file, response.getOutputStream());
    } catch (IOException | JRException e) {
      log.error("Error while exporting excel file: {}", e.getMessage());
    }
  }
}
