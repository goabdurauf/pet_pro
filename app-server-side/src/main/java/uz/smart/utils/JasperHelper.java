package uz.smart.utils;

import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.*;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.List;

@Slf4j
@Service
public class JasperHelper {
  public static JasperReport compileJasperReport(String reportsDir, String templateName)
      throws JRException {

    ResourceLoader resourceLoader = new DefaultResourceLoader();
    try {
      return JasperCompileManager.compileReport(
          resourceLoader.getResource(reportsDir + File.separator + templateName).getInputStream());
    } catch (IOException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static ByteArrayOutputStream exportReport(String[] sheetNames, List<JasperPrint> sheets)
      throws IOException, JRException {
    SimpleXlsxReportConfiguration configuration = new SimpleXlsxReportConfiguration();
    configuration.setAutoFitPageHeight(true);
    configuration.setOnePagePerSheet(false);
    configuration.setIgnoreGraphics(true); // helps with cell-merging if paper size larger than A4
    configuration.setIgnoreCellBorder(false);
    configuration.setCollapseRowSpan(true);
    configuration.setWhitePageBackground(false);
    configuration.setIgnoreCellBackground(false);
    configuration.setFontSizeFixEnabled(true);
    configuration.setShowGridLines(true); // showing outside gray grid lines
    configuration.setDetectCellType(true);
    configuration.setRemoveEmptySpaceBetweenRows(true);
    configuration.setRemoveEmptySpaceBetweenColumns(true);
    configuration.setWrapText(true);
    configuration.setSheetNames(sheetNames);

    try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
      Exporter<
          ExporterInput,
          XlsxReportConfiguration,
          XlsxExporterConfiguration,
          OutputStreamExporterOutput>
          exporter = new JRXlsxExporter();
      exporter.setExporterInput(SimpleExporterInput.getInstance(sheets));
      exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(byteArrayOutputStream));
      exporter.setConfiguration(configuration);
      exporter.exportReport();


      return byteArrayOutputStream;
    } catch (IOException | JRException e) {
      log.error("", e);
      throw e;
    }
  }
}
