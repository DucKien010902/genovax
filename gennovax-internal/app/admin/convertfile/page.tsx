"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  FlaskConical,
  Loader2,
  Logs,
  ShieldCheck,
  Upload,
} from "lucide-react";

type ToolKey = "nipt" | "carrier";

type ToolState = {
  file: File | null;
  busy: boolean;
  error: string | null;
  logs: string[];
  resultUrl: string | null;
  resultName: string | null;
};

type PdfCanvasResult = {
  pageCount: number;
  pageWidthPts: number;
  pageHeightPts: number;
  canvas: HTMLCanvasElement;
};

type PdfTextItem = {
  text: string;
  x: number;
  yTop: number;
  yBottom: number;
};

type CarrierRowAnalysis = {
  rowIndex: number;
  gene: string;
  label: string;
  variantText: string;
  genotypeText: string;
  abnormal: boolean;
  abnormalDetail: string | null;
};

type CarrierDetection = {
  abnormal: boolean;
  abnormalRows: CarrierRowAnalysis[];
  conclusionText: string;
  keptGenes: string[];
  removedGenes: string[];
};

const NIPT_TEMPLATE = {
  cropTop: 40,
  cropBottom: 379,
};

const CARRIER_TEMPLATE = {
  pageWidth: 595.3,
  pageHeight: 841.9,
  tableTop: 250.42,
  headerBottom: 279.72,
  tableColumns: {
    left: 37.5,
    geneLeft: 255.45,
    variantLeft: 319.15,
    genotypeLeft: 474.98,
    right: 567.38,
  },
  tableGridColor: "#70ad47",
  gridLineWidthPts: 0.5,
  bottomSegmentStart: 720,
  keepRowIndices: [0, 1, 2, 3, 4, 5, 6, 7, 10, 11, 13, 14, 15, 16, 17],
  allRows: [
    { gene: "HBA1 & HBA2", label: "Alpha-Thalassemia" },
    { gene: "HBB", label: "Beta-Thalassemia" },
    { gene: "G6PD", label: "Thiếu men G6PD" },
    { gene: "PAH", label: "Phenylketon niệu" },
    { gene: "GALT", label: "Rối loạn chuyển hóa Galactose" },
    { gene: "SLC25A13", label: "Thiếu hụt citrin" },
    { gene: "GAA", label: "Pompe" },
    { gene: "ATP7B", label: "Wilson" },
    { gene: "HEXA", label: "Tay-Sachs" },
    { gene: "ETFDH", label: "Tăng axit huyết loại II" },
    { gene: "GLA", label: "Fabry" },
    { gene: "SRD5A2", label: "Thiếu 5α-reductase type 2" },
    { gene: "CFTR", label: "Xơ nang" },
    { gene: "CYP21A2", label: "Tăng sản tuyến thượng thận bẩm sinh" },
    { gene: "TSHR", label: "Suy giáp bẩm sinh" },
    { gene: "SLC26A4", label: "Pendred / mất thính lực" },
    { gene: "SLC22A5", label: "Thiếu hụt carnitine nguyên phát" },
    { gene: "SMPD1", label: "Niemann-Pick A/B" },
    { gene: "IGHMBP2", label: "SMARD1 / CMT2S" },
    { gene: "ABCD1", label: "X-ALD" },
    { gene: "OTC", label: "Thiếu hụt OTC" },
  ],
  rowBounds: [
    [280.2, 305.5],
    [306.0, 321.6],
    [322.1, 337.7],
    [338.2, 353.8],
    [354.3, 370.0],
    [370.5, 386.1],
    [386.6, 402.2],
    [402.7, 418.3],
    [418.8, 434.4],
    [434.9, 450.5],
    [451.0, 466.6],
    [467.1, 492.4],
    [492.9, 508.5],
    [509.0, 524.6],
    [525.1, 540.7],
    [541.2, 566.5],
    [567.0, 582.6],
    [583.1, 598.7],
    [599.2, 637.2],
    [637.7, 663.0],
    [663.5, 679.1],
  ] as Array<[number, number]>,
  conclusionLabelX: 54.5,
  conclusionValueX: 135,
  conclusionTopGap: 14,
  conclusionFontSize: 11,
  conclusionLineHeight: 1.35,
  conclusionMaxRightMargin: 24,
  bottomFontColor: "#243779",
};

const initialToolState = (): ToolState => ({
  file: null,
  busy: false,
  error: null,
  logs: [],
  resultUrl: null,
  resultName: null,
});

async function getPdfJsLib() {
  const pdfjs = await import("pdfjs-dist");

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }

  return pdfjs;
}

async function renderPdfPageToCanvas(file: File, pageNumber = 1, scale = 3): Promise<PdfCanvasResult> {
  const pdfjs = await getPdfJsLib();
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Không khởi tạo được canvas 2D.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const renderTask = page.render({ canvas, canvasContext: ctx, viewport });
  await renderTask.promise;

  return {
    pageCount: pdf.numPages,
    pageWidthPts: page.view[2],
    pageHeightPts: page.view[3],
    canvas,
  };
}

function toPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Không tạo được PNG từ canvas."));
        return;
      }
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, "image/png");
  });
}

function sliceCanvas(source: HTMLCanvasElement, sx: number, sy: number, sw: number, sh: number): HTMLCanvasElement {
  const target = document.createElement("canvas");
  target.width = Math.max(1, Math.floor(sw));
  target.height = Math.max(1, Math.floor(sh));
  const ctx = target.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Không khởi tạo được canvas 2D.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, target.width, target.height);
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, target.width, target.height);
  return target;
}

function ptsToPx(value: number, canvasSize: number, pageSizePts: number) {
  return Math.round((value / pageSizePts) * canvasSize);
}

function ptsToPxPrecise(value: number, canvasSize: number, pageSizePts: number) {
  return (value / pageSizePts) * canvasSize;
}

async function extractPdfTextItems(file: File, pageNumber = 1): Promise<PdfTextItem[]> {
  const pdfjs = await getPdfJsLib();
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const textContent = await page.getTextContent();

  return (textContent.items as Array<any>)
    .filter((item) => typeof item?.str === "string")
    .map((item) => {
      const transform = pdfjs.Util.transform(viewport.transform, item.transform);
      const x = transform[4];
      const yBottom = transform[5];
      const height = Math.abs(transform[3]) || item.height || 0;

      return {
        text: item.str as string,
        x,
        yTop: yBottom - height,
        yBottom,
      };
    });
}

function collectPdfTextInRect(
  items: PdfTextItem[],
  rowTopPts: number,
  rowBottomPts: number,
  colLeftPts: number,
  colRightPts: number,
) {
  const filtered = items
    .filter((item) => {
      const yMid = (item.yTop + item.yBottom) / 2;
      return item.x >= colLeftPts - 2 && item.x <= colRightPts + 2 && yMid >= rowTopPts && yMid <= rowBottomPts;
    })
    .sort((a, b) => (Math.abs(a.yTop - b.yTop) > 2.5 ? a.yTop - b.yTop : a.x - b.x));

  const lines: Array<{ y: number; text: string }> = [];

  filtered.forEach((item) => {
    if (!item.text.length) return;

    let line = lines.find((candidate) => Math.abs(candidate.y - item.yTop) <= 2.5);
    if (!line) {
      line = { y: item.yTop, text: "" };
      lines.push(line);
    }

    line.text += item.text;
  });

  return lines
    .map(({ text }) => text.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function normalizeCompareText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}

function looksLikeNormalVariant(value: string) {
  return normalizeCompareText(value).includes("chua phat hien bat thuong");
}

function looksLikeNormalGenotype(value: string) {
  return normalizeCompareText(value).includes("binh thuong");
}

function buildCarrierAbnormalDetail(row: { gene: string }, variantText: string, genotypeText: string) {
  const abnormalPieces = [
    looksLikeNormalVariant(variantText) ? "" : variantText.trim(),
    looksLikeNormalGenotype(genotypeText) ? "" : genotypeText.trim(),
  ].filter(Boolean);

  const fallbackPieces = [variantText.trim(), genotypeText.trim()].filter(Boolean);
  const detail = (abnormalPieces.length ? abnormalPieces : fallbackPieces).join(" - ");

  return detail ? `${row.gene}: ${detail}` : row.gene;
}

async function analyzeCarrierRows(file: File): Promise<CarrierRowAnalysis[]> {
  const textItems = await extractPdfTextItems(file, 1);

  return CARRIER_TEMPLATE.keepRowIndices.map((rowIndex) => {
    const rowMeta = CARRIER_TEMPLATE.allRows[rowIndex];
    const [rowTopPts, rowBottomPts] = CARRIER_TEMPLATE.rowBounds[rowIndex];

    const variantText = collectPdfTextInRect(
      textItems,
      rowTopPts,
      rowBottomPts,
      CARRIER_TEMPLATE.tableColumns.variantLeft,
      CARRIER_TEMPLATE.tableColumns.genotypeLeft,
    );
    const genotypeText = collectPdfTextInRect(
      textItems,
      rowTopPts,
      rowBottomPts,
      CARRIER_TEMPLATE.tableColumns.genotypeLeft,
      CARRIER_TEMPLATE.tableColumns.right,
    );

    const hasAnyResultText = Boolean(variantText.trim() || genotypeText.trim());
    const isNormal = hasAnyResultText
      ? looksLikeNormalVariant(variantText) && looksLikeNormalGenotype(genotypeText)
      : true;

    return {
      rowIndex,
      gene: rowMeta.gene,
      label: rowMeta.label,
      variantText,
      genotypeText,
      abnormal: !isNormal,
      abnormalDetail: !isNormal ? buildCarrierAbnormalDetail(rowMeta, variantText, genotypeText) : null,
    };
  });
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const paragraphs = text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) return [""];

  const lines: string[] = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let currentLine = "";

    words.forEach((word) => {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (!currentLine || ctx.measureText(candidate).width <= maxWidth) {
        currentLine = candidate;
        return;
      }

      lines.push(currentLine);
      currentLine = word;
    });

    if (currentLine) lines.push(currentLine);
  });

  return lines.length ? lines : [""];
}

async function buildPdfFromSingleCanvas(canvas: HTMLCanvasElement, pageWidthPts: number, pageHeightPts: number) {
  const outPdf = await PDFDocument.create();
  const page = outPdf.addPage([pageWidthPts, pageHeightPts]);
  const pngBytes = await toPngBytes(canvas);
  const png = await outPdf.embedPng(pngBytes);
  page.drawImage(png, {
    x: 0,
    y: 0,
    width: pageWidthPts,
    height: pageHeightPts,
  });
  return await outPdf.save();
}

async function buildPdfFromCanvasPlusRemainingPages(
  canvas: HTMLCanvasElement,
  pageWidthPts: number,
  pageHeightPts: number,
  originalPdfFile: File,
) {
  const outPdf = await PDFDocument.create();
  const firstPage = outPdf.addPage([pageWidthPts, pageHeightPts]);

  const pngBytes = await toPngBytes(canvas);
  const png = await outPdf.embedPng(pngBytes);
  firstPage.drawImage(png, {
    x: 0,
    y: 0,
    width: pageWidthPts,
    height: pageHeightPts,
  });

  const originalBytes = await originalPdfFile.arrayBuffer();
  const originalPdf = await PDFDocument.load(originalBytes);

  if (originalPdf.getPageCount() > 1) {
    const indices = Array.from({ length: originalPdf.getPageCount() - 1 }, (_, i) => i + 1);
    const copiedPages = await outPdf.copyPages(originalPdf, indices);
    copiedPages.forEach((page) => outPdf.addPage(page));
  }

  return await outPdf.save();
}

async function transformNiptPdf(file: File, pushLog: (msg: string) => void): Promise<Uint8Array> {
  const firstPage = await renderPdfPageToCanvas(file, 1, 3);

  pushLog(`Đọc xong PDF NIPT: ${firstPage.pageCount} trang.`);
  pushLog("Cắt đúng phần trang 1: từ tiêu đề phiếu kết quả đến trước mục KẾT LUẬN.");

  const cropTopPx = ptsToPx(NIPT_TEMPLATE.cropTop, firstPage.canvas.height, firstPage.pageHeightPts);
  const cropBottomPx = ptsToPx(NIPT_TEMPLATE.cropBottom, firstPage.canvas.height, firstPage.pageHeightPts);

  const croppedCanvas = sliceCanvas(firstPage.canvas, 0, cropTopPx, firstPage.canvas.width, cropBottomPx - cropTopPx);
  const cropHeightPts = NIPT_TEMPLATE.cropBottom - NIPT_TEMPLATE.cropTop;

  pushLog("Đã bỏ phần KẾT LUẬN và toàn bộ các trang sau. File đích còn 1 trang.");

  return await buildPdfFromSingleCanvas(croppedCanvas, firstPage.pageWidthPts, cropHeightPts);
}

function drawCarrierTableGrid(
  ctx: CanvasRenderingContext2D,
  rowBottoms: number[],
  scaleX: number,
  scaleY: number,
) {
  const xPositions = [
    CARRIER_TEMPLATE.tableColumns.left,
    CARRIER_TEMPLATE.tableColumns.geneLeft,
    CARRIER_TEMPLATE.tableColumns.variantLeft,
    CARRIER_TEMPLATE.tableColumns.genotypeLeft,
    CARRIER_TEMPLATE.tableColumns.right,
  ].map((value) => value * scaleX);

  const tableTopPx = CARRIER_TEMPLATE.tableTop * scaleY;
  const headerBottomPx = CARRIER_TEMPLATE.headerBottom * scaleY;
  const lineWidth = Math.max(1, CARRIER_TEMPLATE.gridLineWidthPts * Math.min(scaleX, scaleY));
  const tableBottomPx = rowBottoms.length ? rowBottoms[rowBottoms.length - 1] : headerBottomPx;

  ctx.save();
  ctx.strokeStyle = CARRIER_TEMPLATE.tableGridColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  xPositions.forEach((x) => {
    const alignedX = Math.round(x) + 0.5;
    ctx.moveTo(alignedX, Math.round(tableTopPx) + 0.5);
    ctx.lineTo(alignedX, Math.round(tableBottomPx) + 0.5);
  });

  [tableTopPx, headerBottomPx, ...rowBottoms].forEach((y) => {
    const alignedY = Math.round(y) + 0.5;
    ctx.moveTo(Math.round(xPositions[0]) + 0.5, alignedY);
    ctx.lineTo(Math.round(xPositions[xPositions.length - 1]) + 0.5, alignedY);
  });

  ctx.stroke();
  ctx.restore();
}

function drawCarrierConclusion(
  ctx: CanvasRenderingContext2D,
  currentYpx: number,
  conclusionText: string,
  hasAbnormal: boolean,
  scaleX: number,
  scaleY: number,
  canvasWidth: number,
) {
  const labelX = CARRIER_TEMPLATE.conclusionLabelX * scaleX;
  const valueX = CARRIER_TEMPLATE.conclusionValueX * scaleX;
  const top = currentYpx + CARRIER_TEMPLATE.conclusionTopGap * scaleY;
  const fontSize = CARRIER_TEMPLATE.conclusionFontSize * scaleY;
  const baseline = top + fontSize;
  const maxWidth = canvasWidth - valueX - CARRIER_TEMPLATE.conclusionMaxRightMargin * scaleX;
  const lineHeight = fontSize * CARRIER_TEMPLATE.conclusionLineHeight;

  ctx.save();
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = CARRIER_TEMPLATE.bottomFontColor;
  ctx.font = `italic 700 ${fontSize}px "Times New Roman", Tinos, "Noto Serif", serif`;
  ctx.fillText("KẾT LUẬN:", labelX, baseline);

  ctx.fillStyle = hasAbnormal ? "#d31717" : "#111111";
  ctx.font = `700 ${fontSize}px "Times New Roman", Tinos, "Noto Serif", serif`;

  const wrappedLines = wrapCanvasText(ctx, conclusionText, maxWidth);
  wrappedLines.forEach((line, index) => {
    ctx.fillText(line, valueX, baseline + index * lineHeight);
  });

  ctx.restore();
}

function buildCarrierFirstPageCanvas(source: HTMLCanvasElement, rowAnalyses: CarrierRowAnalysis[]) {
  const output = document.createElement("canvas");
  output.width = source.width;
  output.height = source.height;

  const ctx = output.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Không khởi tạo được canvas 2D.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, output.width, output.height);

  const scaleX = output.width / CARRIER_TEMPLATE.pageWidth;
  const scaleY = output.height / CARRIER_TEMPLATE.pageHeight;

  const headerBottomPx = ptsToPxPrecise(CARRIER_TEMPLATE.headerBottom, output.height, CARRIER_TEMPLATE.pageHeight);
  ctx.drawImage(source, 0, 0, source.width, headerBottomPx, 0, 0, output.width, headerBottomPx);

  const keptGenes = rowAnalyses.map((row) => row.gene);
  const removedGenes = CARRIER_TEMPLATE.allRows
    .filter((_, rowIndex) => !CARRIER_TEMPLATE.keepRowIndices.includes(rowIndex))
    .map((row) => row.gene);
  const abnormalRows = rowAnalyses.filter((row) => row.abnormal);

  const rowBottoms: number[] = [];
  let currentY = headerBottomPx;

  CARRIER_TEMPLATE.keepRowIndices.forEach((rowIndex) => {
    const [rowTopPts, rowBottomPts] = CARRIER_TEMPLATE.rowBounds[rowIndex];
    const rowTopPx = ptsToPxPrecise(rowTopPts, output.height, CARRIER_TEMPLATE.pageHeight);
    const rowBottomPx = ptsToPxPrecise(rowBottomPts, output.height, CARRIER_TEMPLATE.pageHeight);
    const rowHeightPx = rowBottomPx - rowTopPx;

    ctx.drawImage(source, 0, rowTopPx, source.width, rowHeightPx, 0, currentY, output.width, rowHeightPx);

    currentY += rowHeightPx;
    rowBottoms.push(currentY);
  });

  drawCarrierTableGrid(ctx, rowBottoms, scaleX, scaleY);

  const conclusionText = abnormalRows.length > 0
    ? abnormalRows.map((row) => row.abnormalDetail).filter(Boolean).join("\n")
    : "Bình thường";

  drawCarrierConclusion(ctx, currentY, conclusionText, abnormalRows.length > 0, scaleX, scaleY, output.width);

  const bottomSegmentStartPx = ptsToPxPrecise(
    CARRIER_TEMPLATE.bottomSegmentStart,
    output.height,
    CARRIER_TEMPLATE.pageHeight,
  );
  const bottomSegmentHeightPx = output.height - bottomSegmentStartPx;
  ctx.drawImage(
    source,
    0,
    bottomSegmentStartPx,
    source.width,
    bottomSegmentHeightPx,
    0,
    bottomSegmentStartPx,
    output.width,
    bottomSegmentHeightPx,
  );

  return {
    canvas: output,
    detection: {
      abnormal: abnormalRows.length > 0,
      abnormalRows,
      conclusionText,
      keptGenes,
      removedGenes,
    } as CarrierDetection,
  };
}

async function transformCarrierPdf(file: File, pushLog: (msg: string) => void): Promise<Uint8Array> {
  const firstPage = await renderPdfPageToCanvas(file, 1, 3);
  const rowAnalyses = await analyzeCarrierRows(file);

  pushLog(`Đọc xong PDF bệnh di truyền lặn: ${firstPage.pageCount} trang.`);
  pushLog("Giữ nguyên phần đầu mẫu phiếu + trang 2 trở đi, chỉ thay trang 1.");

  const { canvas, detection } = buildCarrierFirstPageCanvas(firstPage.canvas, rowAnalyses);

  pushLog(`Giữ lại ${detection.keptGenes.length}/21 hàng: ${detection.keptGenes.join(", ")}.`);
  pushLog(`Cắt bỏ 6 hàng ngoài danh sách: ${detection.removedGenes.join(", ")}.`);
  pushLog("Đã kẻ lại đường viền ngang/dọc cho bảng 15 hàng và bổ sung viền cuối bảng.");

  if (detection.abnormal) {
    pushLog(`Phát hiện ${detection.abnormalRows.length} hàng bất thường trong 15 hàng giữ lại.`);
    detection.abnormalRows.forEach((row) => {
      if (row.abnormalDetail) pushLog(`→ ${row.abnormalDetail}`);
    });
  } else {
    pushLog("Trong 15 hàng được giữ không có kết quả bất thường. Kết luận mới: Bình thường.");
  }

  return await buildPdfFromCanvasPlusRemainingPages(canvas, firstPage.pageWidthPts, firstPage.pageHeightPts, file);
}

function bytesToObjectUrl(bytes: Uint8Array, mime = "application/pdf") {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  return URL.createObjectURL(new Blob([buffer], { type: mime }));
}

function PdfPreview({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
      <iframe src={url} title="PDF preview" className="h-[720px] w-full bg-white" />
    </div>
  );
}

function StatusBadge({ state }: { state: ToolState }) {
  if (state.busy) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
        <Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
        <AlertCircle className="h-4 w-4" /> Lỗi xử lý
      </div>
    );
  }
  if (state.resultUrl) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> Hoàn tất
      </div>
    );
  }
  return null;
}

function ToolPanel({
  active,
  state,
  onFileChange,
  onConvert,
  buttonText,
}: {
  active: boolean;
  state: ToolState;
  onFileChange: (file: File | null) => void;
  onConvert: () => void;
  buttonText: string;
}) {
  if (!active) return null;

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {/* CỘT TRÁI: THAO TÁC & LOG */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Tải file & Xử lý</h3>
            <StatusBadge state={state} />
          </div>

          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer">
            <Upload className="h-6 w-6 text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700">Nhấp để chọn file PDF</span>
            <span className="mt-1 text-xs text-slate-500">
              {state.file?.name ?? "Chưa có file nào được chọn"}
            </span>
            <input
              className="hidden"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            />
          </label>

          <button
            onClick={onConvert}
            disabled={!state.file || state.busy}
            className="mt-4 w-full inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
            {buttonText}
          </button>

          {state.error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {state.error}
            </div>
          )}
        </div>

        {/* <div className="rounded-2xl bg-slate-950 p-5 text-slate-100 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-300">
            <Logs className="h-4 w-4" /> Nhật ký xử lý
          </div>
          {state.logs.length ? (
            <ol className="space-y-2 text-sm text-slate-300">
              {state.logs.map((log, index) => (
                <li key={`${index}-${log}`} className="flex gap-2">
                  <span className="text-slate-500">[{index + 1}]</span>
                  <span>{log}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-slate-500 italic">Chưa có thông tin xử lý...</div>
          )}
        </div> */}
      </div>

      {/* CỘT PHẢI: KẾT QUẢ PREVIEW */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Eye className="h-5 w-5" /> Kết quả
          </div>
          {state.resultUrl && (
            <a
              href={state.resultUrl}
              download={state.resultName ?? "converted.pdf"}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-200"
            >
              <Download className="h-4 w-4" /> Tải về
            </a>
          )}
        </div>

        {state.resultUrl ? (
          <PdfPreview url={state.resultUrl} />
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            <ShieldCheck className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">Bản xem trước sẽ hiển thị ở đây</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function PdfTransformPage() {
  const [activeTool, setActiveTool] = useState<ToolKey>("nipt");
  const [niptState, setNiptState] = useState<ToolState>(initialToolState);
  const [carrierState, setCarrierState] = useState<ToolState>(initialToolState);
  const currentUrls = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      currentUrls.current.forEach((url) => URL.revokeObjectURL(url));
      currentUrls.current = [];
    };
  }, []);

  const setResultUrl = (tool: ToolKey, url: string, fileName: string, logs: string[]) => {
    currentUrls.current.push(url);
    const updater = (prev: ToolState): ToolState => {
      if (prev.resultUrl) URL.revokeObjectURL(prev.resultUrl);
      return { ...prev, busy: false, error: null, logs, resultUrl: url, resultName: fileName };
    };
    if (tool === "nipt") setNiptState(updater);
    else setCarrierState(updater);
  };

  const setFileForTool = (tool: ToolKey, file: File | null) => {
    const updater = (prev: ToolState): ToolState => {
      if (prev.resultUrl) URL.revokeObjectURL(prev.resultUrl);
      return { ...prev, file, error: null, logs: [], resultUrl: null, resultName: null };
    };
    if (tool === "nipt") setNiptState(updater);
    else setCarrierState(updater);
  };

  const runTool = async (tool: ToolKey) => {
    const sourceState = tool === "nipt" ? niptState : carrierState;
    if (!sourceState.file) return;

    const logs: string[] = [];
    const pushLog = (message: string) => logs.push(message);

    const setBusy = (prev: ToolState): ToolState => ({
      ...prev,
      busy: true,
      error: null,
      logs: ["Bắt đầu xử lý..."],
    });

    if (tool === "nipt") setNiptState(setBusy);
    else setCarrierState(setBusy);

    try {
      const outputBytes = tool === "nipt"
        ? await transformNiptPdf(sourceState.file, pushLog)
        : await transformCarrierPdf(sourceState.file, pushLog);

      const safeBaseName = sourceState.file.name.replace(/\.pdf$/i, "");
      const outputName = tool === "nipt"
        ? `${safeBaseName}__nipt-cat-truoc-ket-luan.pdf`
        : `${safeBaseName}__carrier-15-gen.pdf`;

      const url = bytesToObjectUrl(outputBytes);
      setResultUrl(tool, url, outputName, ["Bắt đầu xử lý...", ...logs, "Hoàn tất."]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đã có lỗi không xác định.";
      const updater = (prev: ToolState): ToolState => ({
        ...prev,
        busy: false,
        error: message,
        logs: ["Bắt đầu xử lý...", ...logs],
      });

      if (tool === "nipt") setNiptState(updater);
      else setCarrierState(updater);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col items-start gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Xử lý PDF Xét nghiệm</h1>
            <p className="text-sm text-slate-500">Công cụ cắt và format chuẩn kết quả</p>
          </div>
          
          <div className="flex gap-2 rounded-lg bg-slate-200/50 p-1">
            <button
              onClick={() => setActiveTool("nipt")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                activeTool === "nipt" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
             PHIẾU KQ NIPT 
            </button>
            <button
              onClick={() => setActiveTool("carrier")}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                activeTool === "carrier" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              LỌC 15 GEN LẶN
            </button>
          </div>
        </div>

        <ToolPanel
          active={activeTool === "nipt"}
          state={niptState}
          onFileChange={(file) => setFileForTool("nipt", file)}
          onConvert={() => void runTool("nipt")}
          buttonText="Bắt đầu cắt KQ NIPT"
        />

        <ToolPanel
          active={activeTool === "carrier"}
          state={carrierState}
          onFileChange={(file) => setFileForTool("carrier", file)}
          onConvert={() => void runTool("carrier")}
          buttonText="Xử lý bảng Gen lặn"
        />
      </div>
    </div>
  );
}