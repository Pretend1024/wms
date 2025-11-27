import jsBarcodeCode from '../../../../utils/JsBarcode.all.min.js?raw';

export function openPrintWindow(orders) {
  const newWin = window.open('', '_blank');

  let html = `<!doctype html><html><head><meta charset="utf-8"><title>波次拣货单打印</title>`;

  // 引入JsBarcode
  html += `<script>${jsBarcodeCode}</script>`;

  html += `<style>
    @media print { .page { page-break-after: always; } }
    html,body{height:100%;margin:0;padding:0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial}
    .container{width:210mm;min-height:297mm;padding:10mm;box-sizing:border-box;margin:0 auto}
    .page{min-height:280mm;padding:6mm 8mm;border: none;box-sizing:border-box}
    
    /* 顶部标题样式 - 纵向居中排列 */
    .header{text-align: center; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #ccc;}
    .main-title{font-size:22px;font-weight:700;margin-bottom:8px;}
    .wave-no{font-size:16px;color:#333;margin-bottom:8px;}
    /* 条形码容器样式 */
    .barcode-container {
      display: flex;
      justify-content: center;
      margin: 10px 0;
      width: 100%;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }
    .barcode-svg {
      width: 100%;
      height: 60px;
    }
    
    /* 信息区块通用样式 */
    .section{margin-bottom: 15px; }
    .section-title{font-weight:600;font-size:18px;margin-bottom:8px;margin-top:8px;color:#333;}
    .info-row{display: flex; margin-bottom: 5px;}
    .info-item{width: 50%; box-sizing: border-box; padding-right: 10px;}
    .info-label{font-weight:500;margin-right:5px;}
    
    .order-item-section{margin:10px 0;padding:5px;border:1px solid #ddd;border-radius:4px;}
    .order-item-header{font-weight:600;margin-bottom:5px;}
    
    table{
      width:100%;
      border-collapse:collapse;
      margin-top:8px;
      table-layout: fixed; /* 固定列宽，确保不被内容撑开 */
    }
    th,td{
      border:1px solid #333;
      padding:6px;
      text-align:left;
      font-size:12px;
    }
    .items-table th{background:#f5f5f5}
    .detail-title{margin:8px 0;}
    
    /* 品名列：限制长度+省略号 */
    .item-name-th, .item-name-td {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    
    /* 数量列（待拣货数、已拣货数量、待检、已检）：完全显示+自适应高度 */
    .qty-td {
      white-space: normal;
      word-wrap: break-word;
    }
    
    /* 库位、分拣列：完全显示+自适应高度 */
    .locate-td, .sort-td {
      white-space: normal;
      word-wrap: break-word;
    }
    
    /* SKU/条码列：SKU过长换行+与条码强制分行 */
    .sku-barcode-td {
      width: 100%;
    }
    .sku-barcode-td .sku-part, 
    .sku-barcode-td .barcode-part {
      display: block;
      width: 100%;
      word-wrap: break-word;
      word-break: break-all;
      margin-bottom: 4px;
    }
    .sku-barcode-td .barcode-part {
      margin-bottom: 0;
    }

    .note{text-align: right; margin-top: 15px; font-size:12px; color:#666;}
  </style>`;
  html += `</head><body>`;

  orders.forEach((order, idx) => {
    const waveNo = escapeHtml(order.waveNo || '');
    const warehouse = escapeHtml(order.warehouseCode || '');
    const zoneCode = escapeHtml(order.zoneCode || ''); // 库区
    const customer = escapeHtml(order.customerCode + (order.customerName ? ' ' + order.customerName : '') || '');
    const shipway = escapeHtml(order.shipwayCode || ''); // 渠道
    const waveType = escapeHtml(order.waveTypeName || '');
    const createTime = escapeHtml(order.createdTime || '');
    const printTime = escapeHtml(order.printOrderTime || '');
    const picker = escapeHtml(order.allocatedEmployeeNum + `(${order.allocatedEmployeeName})` || '');
    const orderCount = escapeHtml(order.orderQty || 0);
    const skuCount = escapeHtml(order.wavePickItems ? order.wavePickItems.length : 0);
    const goodsCount = escapeHtml(order.goodsQty || 0);
    const locationCount = escapeHtml(order.locationQty || 0);
    const lineNumberSum = escapeHtml(order.lineNumberSum || 0);

    // 为每个波次创建唯一的条形码ID
    const barcodeId = `wave-barcode-${idx}`;

    html += `<div class="container">
      <div class="page">
        <!-- 顶部标题：纵向居中排列，包含条形码 -->
        <div class="header">
          <div class="main-title">波次拣货单(${waveType})</div>
          <div class="wave-no">波次号: ${waveNo}</div>
          <!-- 条形码容器 -->
          <div class="barcode-container">
            <svg id="${barcodeId}" class="barcode-svg"></svg>
          </div>
        </div>

        <!-- 基础信息：每两个一行，居左对齐 -->
        <div class="section">
          <div class="section-title">基础信息</div>
          <div class="info-row">
            <div class="info-item"><span class="info-label">仓库：</span>${warehouse}</div>
            <div class="info-item"><span class="info-label">库区：</span>${zoneCode}</div>
          </div>
          <div class="info-row">
            <div class="info-item"><span class="info-label">客户：</span>${customer}</div>
            <div class="info-item"><span class="info-label">渠道：</span>${shipway}</div>
          </div>
          <div class="info-row">
            <div class="info-item"><span class="info-label">创建时间：</span>${createTime}</div>
            <div class="info-item"><span class="info-label">拣货员：</span>${picker}</div>
          </div>
          <div class="info-row">
            <div class="info-item"><span class="info-label">打印时间：</span>${printTime}</div>
          </div>
        </div>

        <!-- 波次规模：每两个一行，居左对齐 -->
        <div class="section">
          <div class="section-title">波次规模</div>
          <div class="info-row">
            <div class="info-item"><span class="info-label">订单数：</span>${orderCount}个</div>
            <div class="info-item"><span class="info-label">SKU个数：</span>${skuCount}个</div>
          </div>
          <div class="info-row">
            <div class="info-item"><span class="info-label">商品件数：</span>${goodsCount}件</div>
            <div class="info-item"><span class="info-label">库位数：</span>${locationCount}个</div>
          </div>
          <div class="info-row">
            <div class="info-item"><span class="info-label">动线之和：</span>${lineNumberSum} 米</div>
          </div>
        </div>

        <!-- 波次拣货明细 -->
        <div class="detail-title"><strong>一、波次拣货明细</strong></div>
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 4%;">序号</th>
              <th style="width: 20%;">库位</th>
              <th style="width: 20%;">SKU/条码</th>
              <th style="width: 15%;" class="item-name-th">品名</th>
              <th style="width: 10%;">待拣货数</th>
              <th style="width: 10%;">已拣货数</th>
              <th style="width: 21%;">分拣(订单下标*件数)</th>
            </tr>
          </thead>
          <tbody>`;

    // 遍历拣货明细
    if (order.wavePickItems && order.wavePickItems.length > 0) {
      order.wavePickItems.forEach((item, i) => {
        const index = i + 1;
        const location = escapeHtml(item.locationCode || '');
        const skuBarcode = `
                  <div class="sku-part">${escapeHtml(item.sku || '')}</div>
                  <div class="barcode-part">${escapeHtml(item.skuBarcode || '')}</div>
                `;
        const skuName = escapeHtml(item.skuName || '');
        const pickQty = escapeHtml(item.pickQty || 0);
        const pickSort = item.pickSort && item.pickSort.length > 0
          ? item.pickSort.map(s => `<span style="margin-right:5px;">${s}</span>`).join('')
          : '';
        const toPickQty = escapeHtml(item.pickQty || 0);

        html += `<tr>
          <td>${index}</td>
          <td class="locate-td">${location}</td>
          <td class="sku-barcode-td">${skuBarcode}</td>
          <td class="item-name-td">${skuName}</td>
          <td class="qty-td">${toPickQty}</td> 
          <td class="qty-td">${pickQty}</td> 
          <td class="sort-td">${pickSort}</td>
        </tr>`;
      });
    }

    html += `</tbody></table>`;

    // 订单商品明细
    html += `
        <div class="detail-title"><strong>二、订单商品明细</strong></div>
        <div class="order-items-container">`;

    if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
      order.orderItems.forEach(orderItem => {
        const orderIndex = escapeHtml(orderItem.orderIndex || '');
        const orderNo = escapeHtml(orderItem.orderNo || '');
        let orderToPick = 0;
        let orderPicked = 0;

        if (Array.isArray(orderItem.orderSkuItems)) {
          orderItem.orderSkuItems.forEach(skuItem => {
            orderToPick += skuItem.qty || 0;
            orderPicked += skuItem.pickFinishedQty || 0;
          });
        }

        html += `<div class="order-item-section">
                  <div class="order-item-header">订单下标：${orderIndex} | 订单号：${orderNo} | 待拣：${orderToPick}件 | 已拣：${orderPicked}件</div>
                  <table class="items-table">
                    <thead>
                      <tr>
                        <th style="width: 25%;">SKU/条码</th>
                        <th style="width: 37%;" class="item-name-th">品名</th>
                        <th style="width: 10%;">待拣</th>
                        <th style="width: 10%;">已拣</th>
                        <th style="width: 18%;">对应波次明细行</th>
                      </tr>
                    </thead>
                    <tbody>`;

        if (Array.isArray(orderItem.orderSkuItems)) {
          orderItem.orderSkuItems.forEach(skuItem => {
            const skuBarcode = `
                          <div class="sku-part">${escapeHtml(skuItem.sku || '')}</div>
                          <div class="barcode-part">${escapeHtml(skuItem.barcode || '')}</div>
                        `;
            const skuName = escapeHtml(skuItem.skuName || '');
            const toCheck = escapeHtml(skuItem.qty || 0); // 待检数量
            const checked = escapeHtml(skuItem.pickFinishedQty || 0); // 已检数量

            // 波次明细行：去重显示
            let waveLine = '';
            if (skuItem.waveIndexList && Array.isArray(skuItem.waveIndexList) && skuItem.waveIndexList.length > 0) {
              const uniqueIndexes = [...new Set(skuItem.waveIndexList)];
              waveLine = `第${uniqueIndexes.join('、')}行`;
            }
            waveLine = escapeHtml(waveLine);

            html += `<tr>
                          <td class="sku-barcode-td">${skuBarcode}</td>
                          <td class="item-name-td">${skuName}</td>
                          <td class="qty-td">${toCheck}</td> 
                          <td class="qty-td">${checked}</td>
                          <td>${waveLine}</td>
                        </tr>`;
          });
        } else {
          html += `<tr><td colspan="5" style="text-align:center">无商品明细</td></tr>`;
        }

        html += `</tbody></table>
                </div>`;
      });
    } else {
      html += `<div>无订单商品明细数据</div>`;
    }

    html += `</div>

        <div class="note">第 ${idx + 1} / ${orders.length} 份</div>
      </div>
    </div>`;
  });

  // 添加生成条形码的脚本
  html += `<script>
    // 等待页面加载完成后生成条形码
    document.addEventListener('DOMContentLoaded', function() {
      ${orders.map((order, idx) => {
    const waveNo = escapeHtml(order.waveNo || '');
    const barcodeId = `wave-barcode-${idx}`;
    return `
          const barcodeElement${idx} = document.getElementById('${barcodeId}');
          if (barcodeElement${idx}) {
            JsBarcode(barcodeElement${idx}, '${waveNo}', {
              format: 'CODE128',
              displayValue: false,
              lineColor: '#000',
              width: 2,
              height: 60,
              fontSize: 14,
              textMargin: 5,
            });
          }
        `;
  }).join('')}
    });
  </script>`;

  html += `</body></html>`;

  newWin.document.open();
  newWin.document.write(html);
  newWin.document.close();
  newWin.focus();
}

/**
 * HTML字符转义函数，用于防止XSS攻击并确保特殊字符在HTML中正确显示
 * @param {any} s - 需要进行转义处理的输入值（可能为字符串、null、undefined或其他类型）
 * @returns {string} 转义后的安全字符串，特殊字符已转换为HTML实体
 */
function escapeHtml(s) {
  // 如果输入为null或undefined，直接返回空字符串避免后续处理错误
  if (s === null || s === undefined) return '';
  // 将输入转换为字符串后，依次替换HTML特殊字符为对应的实体编码
  // & -> &amp;  < -> &lt;  > -> &gt;  " -> &quot;  ' -> &#39;
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}