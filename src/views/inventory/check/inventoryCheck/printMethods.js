import jsBarcodeCode from '../../../../utils/JsBarcode.all.min.js?raw';

/**
 * 打印盘点单
 * @param {Object} checkOrder - 盘点单详情数据
 * @param {Number} type - 打印类型：2-盘点明细清单, 3-盘点库位清单
 */
export function openPrintCheckOrder(checkOrder, type) {
  if (!checkOrder) return;

  const newWin = window.open('', '_blank');

  // 根据类型确定标题
  const titleMap = {
    2: '盘点明细清单',
    3: '盘点库位清单'
  };
  const pageTitle = titleMap[type] || '盘点单打印';

  let html = `<!doctype html><html><head><meta charset="utf-8"><title>${pageTitle}</title>`;

  // 引入JsBarcode
  html += `<script>${jsBarcodeCode}</script>`;

  html += `<style>
    @media print { .page { page-break-after: always; } }
    html,body{height:100%;margin:0;padding:0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial}
    .container{width:210mm;min-height:297mm;padding:10mm;box-sizing:border-box;margin:0 auto}
    .page{min-height:280mm;padding:6mm 8mm;border: none;box-sizing:border-box}
    
    /* 顶部标题样式 */
    .header{text-align: center; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #ccc;}
    .main-title{font-size:22px;font-weight:700;margin-bottom:8px;}
    .sub-title{font-size:16px;color:#333;margin-bottom:8px;}
    
    /* 条形码容器 */
    .barcode-container {
      display: flex;
      justify-content: center;
      margin: 10px 0;
      width: 100%;
    }
    .barcode-svg {
      height: 60px;
      max-width: 100%; 
    }
    
    /* 基础信息样式 */
    .section{margin-bottom: 15px; border-bottom: 1px dashed #eee; padding-bottom: 10px;}
    .section-title{font-weight:600;font-size:18px;margin-bottom:10px;margin-top:8px;color:#333;}
    
    /* Flex布局处理基础信息 */
    .info-row{display: flex; flex-wrap: wrap;}
    
    /* 普通项：占1/3宽度 */
    .info-item{
      width: 33.33%; 
      box-sizing: border-box; 
      padding-right: 10px; 
      margin-bottom: 6px;
      line-height: 1.4;
      font-size: 14px;
    }
    
    /* 长文本项：占100%宽度，且强制换行 */
    .info-item.full-width{
      width: 100%;
      white-space: normal;
      word-wrap: break-word; /* 允许长单词换行 */
      word-break: break-all; /* 强制断行，防止长字符串撑破容器 */
    }
    
    .info-label{font-weight:600; color:#444; margin-right:2px;}
    
    /* 表格样式 */
    table{
      width:100%;
      border-collapse:collapse;
      margin-top:8px;
      table-layout: fixed; 
    }
    th,td{
      border:1px solid #333;
      padding:5px 4px;
      text-align:left;
      font-size:12px;
      word-wrap: break-word; /* 单元格内容自动换行 */
    }
    .items-table th{background:#f5f5f5; text-align: center; font-weight: 600;}
    .items-table td{text-align: center;}
    
    /* 特殊列对齐 */
    .text-left { text-align: left !important; }
    
    /* SKU/条码列样式 */
    .sku-barcode-td {
      text-align: left !important;
    }
    .sku-barcode-td .sku-part {
      font-weight: bold;
      margin-bottom: 2px;
    }
    .sku-barcode-td .barcode-part {
      color: #555;
      font-size: 11px;
    }

    .detail-title{margin:15px 0 5px 0; font-size: 14px;}
    .note{text-align: right; margin-top: 15px; font-size:12px; color:#666;}
  </style>`;
  html += `</head><body>`;

  // 提取数据
  const checkNo = escapeHtml(checkOrder.checkNo || '');
  const warehouse = escapeHtml(checkOrder.warehouseCode || '');
  const customer = escapeHtml(checkOrder.customerName || ''); // 客户名称
  const checkType = escapeHtml(checkOrder.checkTypeName || '');
  const status = escapeHtml(checkOrder.statusName || '');
  const locationQty = escapeHtml(checkOrder.locationQty || 0);
  const createdBy = escapeHtml(checkOrder.createdBy || '');
  const remark = escapeHtml(checkOrder.remark || '无');

  const barcodeId = `check-barcode-${checkOrder.id || 'new'}`;

  html += `<div class="container">
      <div class="page">
        <div class="header">
          <div class="main-title">${pageTitle}</div>
          <div class="sub-title">单号: ${checkNo}</div>
          <div class="barcode-container">
            <svg id="${barcodeId}" class="barcode-svg"></svg>
          </div>
        </div>

        <div class="section">
          <div class="section-title">基础信息</div>
          <div class="info-row">
            <div class="info-item"></div> <div class="info-item full-width">
              <span class="info-label">客户：</span>${customer}
            </div>
            <div class="info-item"><span class="info-label">仓库：</span>${warehouse}</div>
            <div class="info-item"><span class="info-label">盘点方式：</span>${checkType}</div>
            <div class="info-item"><span class="info-label">状态：</span>${status}</div>
            
            <div class="info-item"><span class="info-label">涉及库位：</span>${locationQty} 个</div>
            <div class="info-item"><span class="info-label">创建人：</span>${createdBy}</div>

            <div class="info-item full-width">
              <span class="info-label">备注：</span>${remark}
            </div>
          </div>
        </div>`;

  // --- Type 2: 盘点明细清单 ---
  if (type === 2) {
    html += `<div class="detail-title"><strong>一、盘点明细</strong></div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 5%;">序号</th>
              <th style="width: 15%;">库位</th>
              <th style="width: 30%;">SKU/条码</th>
              <th style="width: 10%;">品质</th>
              <th style="width: 10%;">系统数</th>
              <th style="width: 10%;">一盘数</th>
              <th style="width: 10%;">复盘数</th>
              <th style="width: 10%;">差异数</th>
            </tr>
          </thead>
          <tbody>`;

    if (checkOrder.detailList && checkOrder.detailList.length > 0) {
      checkOrder.detailList.forEach((item, i) => {
        const index = i + 1;
        const loc = escapeHtml(item.locationCode || '');
        const skuBarcode = `
            <div class="sku-part">${escapeHtml(item.sku || '')}</div>
            <div class="barcode-part">${escapeHtml(item.barcode || '')}</div>
        `;
        const quality = escapeHtml(item.qualityName || '');
        const sysQty = item.sysQty ?? 0;
        const firstQty = item.firstCheckQty ?? 0;
        const secondQty = item.secondCheckQty ?? 0;
        // 计算逻辑：优先取复盘数，其次一盘数，与系统数对比
        const checkQty = item.secondCheckQty !== null ? item.secondCheckQty : (item.firstCheckQty !== null ? item.firstCheckQty : 0);
        const diffQty = checkQty - sysQty;

        html += `<tr>
          <td>${index}</td>
          <td class="text-left">${loc}</td>
          <td class="sku-barcode-td">${skuBarcode}</td>
          <td>${quality}</td>
          <td>${sysQty}</td>
          <td>${firstQty}</td>
          <td>${secondQty}</td>
          <td>${diffQty}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="8" style="padding: 15px;">无盘点明细数据</td></tr>`;
    }
    html += `</tbody></table>`;

    // 汇总列表
    html += `<div class="detail-title" style="margin-top:15px;"><strong>二、盘点汇总 (按SKU)</strong></div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 5%;">序号</th>
              <th style="width: 35%;">SKU/条码</th>
              <th style="width: 12%;">品质</th>
              <th style="width: 12%;">系统数</th>
              <th style="width: 12%;">一盘数</th>
              <th style="width: 12%;">复盘数</th>
              <th style="width: 12%;">差异数</th>
            </tr>
          </thead>
          <tbody>`;

    if (checkOrder.detailGroupList && checkOrder.detailGroupList.length > 0) {
      checkOrder.detailGroupList.forEach((item, i) => {
        const index = i + 1;
        const skuBarcode = `
            <div class="sku-part">${escapeHtml(item.sku || '')}</div>
            <div class="barcode-part">${escapeHtml(item.barcode || '')}</div>
        `;
        const quality = escapeHtml(item.qualityName || '');
        const sysQty = item.sysQty ?? 0;
        const firstQty = item.firstCheckQty ?? 0;
        const secondQty = item.secondCheckQty ?? 0;
        const diffQty = item.diffQty ?? 0;

        html += `<tr>
          <td>${index}</td>
          <td class="sku-barcode-td">${skuBarcode}</td>
          <td>${quality}</td>
          <td>${sysQty}</td>
          <td>${firstQty}</td>
          <td>${secondQty}</td>
          <td>${diffQty}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="7" style="padding: 15px;">无汇总数据</td></tr>`;
    }
    html += `</tbody></table>`;
  }

  // --- Type 3: 盘点库位清单 ---
  else if (type === 3) {
    html += `<div class="detail-title"><strong>盘点库位明细</strong></div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 10%;">序号</th>
              <th style="width: 30%;">库区</th>
              <th style="width: 60%;">库位</th>
            </tr>
          </thead>
          <tbody>`;

    if (checkOrder.locationList && checkOrder.locationList.length > 0) {
      checkOrder.locationList.forEach((item, i) => {
        const index = i + 1;
        const zone = escapeHtml(item.zoneCode || '');
        const loc = escapeHtml(item.locationCode || '');

        html += `<tr>
          <td>${index}</td>
          <td>${zone}</td>
          <td>${loc}</td>
        </tr>`;
      });
    } else {
      html += `<tr><td colspan="3" style="padding: 15px;">无库位数据</td></tr>`;
    }
    html += `</tbody></table>`;
  }

  html += `
        <div class="note">打印时间：${new Date().toLocaleString()}</div>
      </div>
    </div>`;

  // JSBarcode 生成
  html += `<script>
    document.addEventListener('DOMContentLoaded', function() {
      const barcodeElement = document.getElementById('${barcodeId}');
      if (barcodeElement) {
        try {
          JsBarcode(barcodeElement, '${checkNo}', {
            format: 'CODE128',
            displayValue: false,
            lineColor: '#000',
            width: 2,
            height: 50, 
            margin: 0
          });
        } catch (e) {
          console.error('Barcode generation failed', e);
        }
      }
    });
  </script>`;

  html += `</body></html>`;

  newWin.document.open();
  newWin.document.write(html);
  newWin.document.close();
  newWin.focus();
}

/**
 * HTML字符转义
 */
function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}