import jsBarcodeCode from '../../../../utils/JsBarcode.all.min.js?raw';

/**
 * 打开增值服务单打印窗口（服务明细为块区域布局）
 * @param {Array} vasOrders - 增值服务单列表（接口返回的data数组）
 */
export function openVasPrintWindow(vasOrders) {
  if (!Array.isArray(vasOrders) || vasOrders.length === 0) {
    console.warn('无有效增值服务单数据');
    return;
  }

  const newWin = window.open('', '_blank');
  if (!newWin) {
    alert('浏览器弹窗被阻止，请允许弹窗后重试');
    return;
  }

  let html = `<!doctype html><html><head><meta charset="utf-8"><title>增值服务单打印</title>`;

  // 注入 JsBarcode 源码
  html += `<script>${jsBarcodeCode}</script>`;

  html += `<style>
    @media print {
      .page { page-break-after: always; } /* 每个页面强制分页，最后一页自动失效 */
      @page { margin: 0; } /* 清除默认页边距 */
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } /* 保证打印时颜色正常 */
    }
    html,body{
      height:100%;
      margin:0;
      padding:0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size:12px;
      background: #f6f7f8;
    }
    .container{
      width:210mm; /* A4宽度 */
      min-height:297mm; /* A4高度 */
      padding:10mm;
      box-sizing:border-box;
      margin:0 auto; /* 去掉上下边距，避免溢出 */
      background:#fff;
    }
    .page{
      padding:6mm 8mm;
      box-sizing:border-box;
    }

    .header{
      text-align: center;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .main-title{
      font-size:22px;
      font-weight:700;
      margin-bottom:6px;
      color:#222;
    }
    .order-no-wrap{
      font-size:14px;
      color:#333;
      margin-bottom:4px;
    }

    .barcode-container {
      display: flex;
      justify-content: center;
      margin: 8px 0;
      width: 100%;
      max-width: 320px;
      margin-left: auto;
      margin-right: auto;
    }
    .barcode-svg {
      width: 100%;
      height: 65px;
    }

    .section{
      margin-bottom: 5px;
      padding:10px 0;
    }
    .section-title{
      font-weight:700;
      font-size:16px;
      margin-bottom:8px;
      color:#333;
      display: flex;
      align-items: center;
    }

    /* 每行显示两个字段 */
    .info-row{
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 6px;
      line-height: 1.6;
    }
    .info-item{
      width: 50%;
      box-sizing: border-box;
      padding-right: 12px;
      margin-bottom: 6px;
      display:flex;
      align-items:flex-start;
    }
    .info-label{
      font-weight:600;
      margin-right: 6px;
      color:#333;
      min-width: 86px;
    }
    .info-value{
      color:#444;
      word-break: break-word;
      white-space: pre-wrap;
    }

    /* 服务块样式（优化） */
    .service-block {
      background-color: #fbfdfe;
      border: 1px solid #e6f1f6;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;
      box-shadow: 0 1px 0 rgba(0,0,0,0.02);
    }
    .service-header {
      font-weight:700;
      margin-bottom: 8px;
      color: #16324a;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size:14px;
    }
    .service-line{
      display:block;
      margin-bottom:6px;
      font-size:14px; /* 字体放大一点，更利于打印和手写 */
      color:#222;
      line-height:1.8;
    }
    .service-line .info-label {
      display: inline-block;
      min-width: 80px;
      font-weight:600;
    }

    /* 完成数量为可填写的下划线样式 */
    .fillable-line {
      display: inline-block;
      min-width: 140px;
      border-bottom: 1px solid #000;
      padding: 2px 6px;
      margin-left: 8px;
      text-align: left;
      color: #000;
      background: transparent;
      line-height:1.8;
    }
    .small-muted {
      color:#666;
      font-size:12px;
    }

    .detail-title{
      margin:10px 0 6px;
      font-size:15px;
      font-weight:600;
      color:#333;
    }

    .desc-content{
      padding:8px;
      border:1px solid #eee;
      border-radius:4px;
      min-height:60px;
      line-height:1.6;
      color:#444;
      white-space: pre-wrap;
      background: #fff;
    }

    .note{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-top: 18px;
      font-size:12px;
      color:#999;
      line-height:1.6;
    }

    .empty-tip{
      text-align:center;
      padding:12px;
      color:#999;
      border:1px dashed #eee;
      margin:10px 0;
      border-radius:4px;
      background: #fbfbfb;
    }

    /* 表格（保留通用样式，如果以后需要） */
    table{
      width:100%;
      border-collapse:collapse;
      margin-top:10px;
      table-layout: fixed;
      margin-bottom: 12px;
    }
    th,td{
      border:1px solid #ddd;
      padding:7px;
      text-align:left;
      font-size:12px;
      word-wrap: break-word;
      word-break: break-all;
    }
    th{
      background:#fafafa;
      font-weight:600;
      color:#333;
    }
    td{
      color:#444;
    }

  </style>`;
  html += `</head><body>`;

  // 遍历每份单据生成页面（简化分页逻辑，每个页面都用page-break-after: always）
  vasOrders.forEach((vasOrder, idx) => {
    // 基础字段（区分数字和字符串用于计算）
    const vasOrderNo = escapeHtml(vasOrder.vasOrderNo || '');
    const statusName = escapeHtml(vasOrder.statusName || '');
    const relatedBizTypeName = escapeHtml(vasOrder.relatedBizTypeName || '');
    const relatedBizId = escapeHtml(vasOrder.relatedBizId || '');
    const relatedBizNo = escapeHtml(vasOrder.relatedBizNo || '');
    const warehouseCode = escapeHtml(vasOrder.warehouseCode || '');
    const warehouseName = escapeHtml(vasOrder.warehouseName || '');
    const customerCode = escapeHtml(vasOrder.customerCode || '');
    const customerName = escapeHtml(vasOrder.customerName || '');
    const vasTitle = escapeHtml(vasOrder.vasTitle || '');
    const vasDesc = escapeHtml(vasOrder.vasDesc || '无');

    const totalPlanQty = escapeHtml(vasOrder.totalPlanQty == null ? 0 : vasOrder.totalPlanQty);
    const totalFinishQty = escapeHtml(vasOrder.totalFinishQty == null ? 0 : vasOrder.totalFinishQty);

    const expectFinishTime = escapeHtml(vasOrder.expectFinishTime || '无');
    const actualFinishTime = escapeHtml(vasOrder.actualFinishTime || '未完成');
    const relatedWorkOrderId = escapeHtml(vasOrder.relatedWorkOrderId || '无');
    const printedTime = escapeHtml(vasOrder.printedTime || new Date().toLocaleString());
    const isForceComplete = escapeHtml(vasOrder.isForceComplete ? '是' : '否');

    // 操作日志 -> 分两行显示：创建人、创建时间；更新人、更新时间
    const createdBy = escapeHtml(vasOrder.createdBy || '');
    const createdTime = escapeHtml(vasOrder.createdTime || '');
    const updatedBy = escapeHtml(vasOrder.updatedBy || '');
    const updatedTime = escapeHtml(vasOrder.updatedTime || '');

    const barcodeId = `vas-barcode-${idx}`;

    html += `<div class="container">
      <div class="page"> <!-- 简化：所有页面统一用page类，依赖print样式的page-break-after: always -->
        <div class="header">
          <div class="main-title">增值服务单</div>
          <div class="order-no-wrap">服务单号：${vasOrderNo}  &nbsp;&nbsp; | &nbsp;&nbsp; 状态：${statusName}</div>
          <div class="barcode-container">
            <svg id="${barcodeId}" class="barcode-svg"></svg>
          </div>
        </div>

        <div class="section">
          <div class="section-title">基础信息</div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">关联业务类型：</span>
              <span class="info-value">${relatedBizTypeName}</span>
            </div>
            <div class="info-item">
              <span class="info-label">关联业务单号：</span>
              <span class="info-value">${relatedBizNo}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">客户信息：</span>
              <span class="info-value">${customerCode}（${customerName}）</span>
            </div>
            <div class="info-item">
              <span class="info-label">仓库信息：</span>
              <span class="info-value">${warehouseCode} - ${warehouseName}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">关联工单ID：</span>
              <span class="info-value">${relatedWorkOrderId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">服务标题：</span>
              <span class="info-value">${vasTitle}</span>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">强制完成：</span>
              <span class="info-value">${isForceComplete}</span>
            </div>
            <div class="info-item">
              <span class="info-label">打印时间：</span>
              <span class="info-value">${printedTime}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">数量统计</div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">总计划数量：</span>
              <span class="info-value">${totalPlanQty}</span>
            </div>
            <div class="info-item">
              <span class="info-label">总完成数量：</span>
              <span class="info-value">${totalFinishQty}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">预计完成时间：</span>
              <span class="info-value">${expectFinishTime}</span>
            </div>
            <div class="info-item">
              <span class="info-label">实际完成时间：</span>
              <span class="info-value">${actualFinishTime}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">服务描述（客户需求）</div>
          <div class="desc-content">${vasDesc}</div>
        </div>

        <div class="detail-title">服务明细清单</div>`;

    // 服务明细：每个服务一块区域
    const serviceItems = vasOrder.vasOrderItemList || [];
    if (serviceItems.length > 0) {
      serviceItems.forEach((item, i) => {
        const serviceTypeName = escapeHtml(item.serviceTypeName || '');
        const serviceTypeCode = escapeHtml(item.serviceTypeCode || '');
        const sku = escapeHtml(item.sku || '');
        const remark = escapeHtml(item.remark || '');
        // serviceAttachment 可能为 JSON 字符串（数组），尝试解析并取 [0].name
        let serviceAttachmentDisplay = '';
        try {
          if (item.serviceAttachment) {
            const parsed = typeof item.serviceAttachment === 'string'
              ? JSON.parse(item.serviceAttachment)
              : item.serviceAttachment;
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && parsed[0].name) {
              serviceAttachmentDisplay = escapeHtml(parsed[0].name);
            } else {
              serviceAttachmentDisplay = '无'
            }
          } else {
            serviceAttachmentDisplay = '';
          }
        } catch (e) {
          serviceAttachmentDisplay = escapeHtml(typeof item.serviceAttachment === 'string' ? item.serviceAttachment : JSON.stringify(item.serviceAttachment));
        }

        const planQty = escapeHtml(item.planQty || 0);
        const unit = escapeHtml(item.unit || '');
        // 完成数量显示为填写下划线（如果后端有值也显示在下划线上）
        const finishQty = item.finishQty == null || item.finishQty === '' || item.finishQty === 0 ? '' : escapeHtml(item.finishQty);

        html += `<div class="service-block">
          <div class="service-header">
            <span>服务类型：${serviceTypeName}${serviceTypeCode ? `（编码：${serviceTypeCode}）` : ''}</span>
            <span>计划数量：${planQty}</span>
            <span>单位：${unit}</span>
          </div>

          <div class="service-line"><span class="info-label">SKU：</span><span class="info-value">${sku || '<span class="small-muted">—</span>'}</span></div>
          <div class="service-line"><span class="info-label">备注：</span><span class="info-value">${remark || '<span class="small-muted">—</span>'}</span></div>
          <div class="service-line"><span class="info-label">服务附件：</span><span class="info-value">${serviceAttachmentDisplay || '<span class="small-muted">—</span>'}</span></div>
          <div class="service-line"><span class="info-label">完成数量：</span><span class="fillable-line">${finishQty}</span> <span class="small-muted">（填写）</span></div>
        </div>`;
      });
    } else {
      html += `<div class="empty-tip">无服务明细数据</div>`;
    }

    // 底部：打印时间与份数放在同一行
    html += `
        <div class="note">
          <div>打印时间：${new Date().toLocaleString()}</div>
          <div>第 ${idx + 1} / ${vasOrders.length} 份</div>
        </div>
      </div>
    </div>`;
  });

  // 生成条形码并触发打印
  html += `<script>
    document.addEventListener('DOMContentLoaded', function() {
      ${vasOrders.map((vasOrder, idx) => {
    const vasOrderNoSafe = (vasOrder.vasOrderNo || '').toString().replace(/'/g, "\\'");
    const barcodeId = `vas-barcode-${idx}`;
    return `
          (function() {
            var barcodeElement = document.getElementById('${barcodeId}');
            var code = '${vasOrderNoSafe}';
            if (barcodeElement && code) {
              try {
                if (typeof JsBarcode === 'function') {
                  JsBarcode(barcodeElement, code, {
                    format: 'CODE128',
                    displayValue: false,
                    lineColor: '#000000',
                    width: 2,
                    height: 65,
                    fontSize: 14,
                    textMargin: 5,
                    margin: 0
                  });
                } else if (typeof window['JsBarcode'] === 'function') {
                  window['JsBarcode'](barcodeElement, code);
                } else {
                  console.warn('JsBarcode 未找到，无法生成条形码');
                }
              } catch (e) {
                console.error('生成条形码失败：', e);
              }
            }
          })();
        `;
  }).join('')}
    });

    // 轻微延时再打印以确保字体/SVG 渲染完成
    setTimeout(function() {
      try {
        window.print();
      } catch (e) {
        console.error('打印调用失败：', e);
      }
    }, 500);
  </script>`;

  html += `</body></html>`;

  newWin.document.open();
  newWin.document.write(html);
  newWin.document.close();
  newWin.focus();
}

function escapeHtml(s) {
  if (s === null || s === undefined || s === '') return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>')
    .replace(/\s{2,}/g, ' ');
}

export { escapeHtml };