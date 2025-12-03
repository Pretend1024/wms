<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset" :collapseRows="3">
                <template #custom-form="{ formData }">
                    <!-- 公司 -->
                    <el-col>
                        <el-form-item :label="getLabel('orgId')">
                            <el-cascader ref="cascaderRef" v-model="formData.orgId" :options="companyOptions"
                                :props="parentProps" clearable @change="handleCascaderChange"
                                :placeholder="getPlaceholder('orgId')" />
                        </el-form-item>
                    </el-col>
                    <!-- 仓库 -->
                    <el-col>
                        <el-form-item :label="getLabel('warehouseCode')">
                            <el-select v-model="formData.warehouseCode" :placeholder="getPlaceholder('warehouseCode')"
                                clearable>
                                <el-option v-for="item in warehouseOptions" :key="item.code"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 客户 -->
                    <el-col>
                        <el-form-item :label="getLabel('customerCode')">
                            <el-select v-model="formData.customerCodeList" filterable
                                :placeholder="getPlaceholder('customerCode')" clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in customerOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 出库单号 -->
                    <el-col>
                        <selectInput :options="way" :formData="formData" selectKey="way" :useCanonicalInput="true">
                        </selectInput>
                        <!-- </el-form-item> -->
                    </el-col>
                    <el-col>
                        <selectDate ref="dateSelectRef" :options="timeTypeOptions"
                            :initialDateRange="selectDateData.dateRange" @change="handleTimeChange"></selectDate>
                    </el-col>
                    <!-- 波次号 -->
                    <el-col>
                        <el-form-item :label="getLabel('outWaveNo')">
                            <canonicalInput v-model:listName="formData.outWaveNoList"
                                :placeholder="getPlaceholder('outWaveNo')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 国家 -->
                    <el-col>
                        <el-form-item :label="getLabel('countryCode')">
                            <el-select v-model="formData.receiverCountryCode" value-key="id" filterable
                                :placeholder="getPlaceholder('countryCode')" clearable>
                                <el-option v-for="item in countryOptions" :key="item.id"
                                    :label="`${item.code}-${item.nameCn}-${item.nameEn}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 承运商 -->
                    <el-col>
                        <el-form-item :label="getLabel('carrierCode')">
                            <el-select v-model="formData.carrierCode" :placeholder="getPlaceholder('carrierCode')"
                                clearable>
                                <el-option v-for="item in carrierOptions" :key="item.id" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 服务商 -->
                    <el-col>
                        <el-form-item :label="getLabel('supplierId')">
                            <el-select v-model="formData.supplierId" :placeholder="getPlaceholder('supplierId')"
                                clearable>
                                <el-option v-for="item in supplierOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 物流产品 -->
                    <el-col>
                        <el-form-item :label="getLabel('shipwayId')">
                            <el-select v-model="formData.shipwayId" :placeholder="getPlaceholder('shipwayId')"
                                clearable>
                                <el-option v-for="item in shipwayOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- sku -->
                    <el-col>
                        <el-form-item :label="getLabel('sku')">
                            <canonicalInput v-model:listName="formData.skuList" :placeholder="getPlaceholder('sku')"
                                clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 平台sku -->
                    <el-col>
                        <el-form-item :label="getLabel('platformSku')">
                            <canonicalInput v-model:listName="formData.platformSkuList"
                                :placeholder="getPlaceholder('platformSku')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- sku个数 -->
                    <el-col>
                        <el-form-item :label="getLabel('skuQty')">
                            <el-select v-model="formData.skuQtyBtnType" :placeholder="getPlaceholder('skuQty')"
                                clearable>
                                <el-option v-for="item in countBtnOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 商品个数 -->
                    <el-col>
                        <el-form-item :label="getLabel('productQty')">
                            <el-select v-model="formData.goodsQtyBtnType" :placeholder="getPlaceholder('productQty')"
                                clearable>
                                <el-option v-for="item in countBtnOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 电商平台 -->
                    <el-col>
                        <el-form-item :label="getLabel('ecPlatform')">
                            <el-select v-model="formData.ecPlatformList" filterable
                                :placeholder="getPlaceholder('ecPlatform')" clearable multiple collapse-tags
                                collapse-tags-tooltip :max-collapse-tags="1" popper-class="multi-column-select">
                                <el-option v-for="item in ecPlatformOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 店铺账号 -->
                    <el-col>
                        <el-form-item :label="getLabel('ecSaleAccount')">
                            <el-input v-model.trim="formData.ecSaleAccount"
                                :placeholder="getPlaceholder('ecSaleAccount')" clearable />
                        </el-form-item>
                    </el-col>
                    <!-- 单号状态 -->
                    <el-col>
                        <el-form-item :label="getLabel('supplierPushStatusId')">
                            <el-select v-model="formData.isTrackingNoReady"
                                :placeholder="getPlaceholder('supplierPushStatusId')" clearable>
                                <el-option :label="$t('yes')" :value="true" />
                                <el-option :label="$t('no')" :value="false" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 是否打印 -->
                    <el-col>
                        <el-form-item :label="getLabel('isPrint')">
                            <el-select v-model="formData.isPrintedLabel" :placeholder="getPlaceholder('isPrint')"
                                clearable>
                                <el-option :label="$t('yes')" :value="true" />
                                <el-option :label="$t('no')" :value="false" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 库区 -->
                    <el-col>
                        <el-form-item :label="getLabel('zoneCode')">
                            <el-select v-model="formData.zoneCode" :placeholder="getPlaceholder('zoneCode')" clearable>
                                <el-option v-for="item in zoneEnumOptions" :key="item.typeId"
                                    :label="`${item.code}-${item.name}`" :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 库位 -->
                    <el-col>
                        <el-form-item :label="getLabel('locationCode')">
                            <canonicalInput v-model:listName="formData.locationCodeList"
                                :placeholder="getPlaceholder('locationCode')" clearable>
                            </canonicalInput>
                        </el-form-item>
                    </el-col>
                    <!-- 模糊查询 -->
                    <el-col>
                        <el-form-item :label="getLabel('fuzzySearch')">
                            <el-input v-model.trim="formData.fuzzySearch" :placeholder="getPlaceholder('fuzzySearch')"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <!-- 接口类型 -->
                    <el-col>
                        <el-form-item :label="getLabel('apiTypeId')">
                            <el-select v-model="formData.apiTypeId" :placeholder="getPlaceholder('apiTypeId')"
                                clearable>
                                <el-option v-for="item in apiTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 运输方式 -->
                    <el-col>
                        <el-form-item :label="getLabel('shipwayTypeId')">
                            <el-select v-model="formData.shipwayTypeId" :placeholder="getPlaceholder('shipwayTypeId')"
                                clearable>
                                <el-option v-for="item in shipwayTypeOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 创建方式 -->
                    <el-col>
                        <el-form-item :label="getLabel('createWay')">
                            <el-select v-model="formData.createWay" :placeholder="getPlaceholder('createWay')"
                                clearable>
                                <el-option v-for="item in createWayOptions" :key="item.code" :label="item.name"
                                    :value="item.code" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 自提代码 -->
                    <el-col>
                        <el-form-item :label="getLabel('pickupCode')">
                            <el-input v-model.trim="formData.pickupCode" :placeholder="getPlaceholder('pickupCode')"
                                clearable />
                        </el-form-item>
                    </el-col>
                    <!-- 是否保险 -->
                    <el-col>
                        <el-form-item :label="getLabel('isPremium')">
                            <el-select v-model="formData.isInsured" :placeholder="getPlaceholder('isPremium')"
                                clearable>
                                <el-option :label="$t('yes')" :value="true" />
                                <el-option :label="$t('no')" :value="false" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 是否缺货 -->
                    <el-col>
                        <el-form-item :label="getLabel('isShortage')">
                            <el-select v-model="formData.isShortage" :placeholder="getPlaceholder('isShortage')"
                                clearable>
                                <el-option :label="$t('yes')" :value="true" />
                                <el-option :label="$t('no')" :value="false" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 拦截状态 -->
                    <el-col>
                        <el-form-item :label="getLabel('holdUpStatus')">
                            <el-select v-model="formData.holdUpId" :placeholder="getPlaceholder('holdUpStatus')"
                                clearable>
                                <el-option v-for="item in holdUpStatusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 计费状态 -->
                    <el-col>
                        <el-form-item :label="getLabel('calculateFeeStatus')">
                            <el-select v-model="formData.calculateFeeStatus"
                                :placeholder="getPlaceholder('calculateFeeStatus')" clearable>
                                <el-option v-for="item in calculateFeeStatusOptions" :key="item.id" :label="item.name"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[20, 50, 100, 200, 500]"
                @selection-change="handleSelectionChange" @row-click="handleRowClick" @page-change="handlePageChange"
                @sort-change="handleTableSort" :red-text-condition="(row) => row.holdUpId === 2 || row.statusId === 99"
                :exclude-red-text-props="['index', 'action', 'orderNo', 'statusName']"
                :strike-condition="(row) => row.statusId == 99"
                :excludeStrikeProps="['index', 'action', 'orderNo', 'statusName']">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <div class="tableTopButtons">
                        <div class="statusIds">
                            <el-checkbox-group v-model="statusIdsArr" @change="handleStatusChange">
                                <el-checkbox v-for="item in statusIdsList" :key="item.id" :label="item.id">
                                    {{ item.name + '[' + item.qty + ']' }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="btns">
                            <!-- 新增 -->
                            <el-button type="primary" @click="handleAdd" :icon="Plus">{{ getButtonText('add')
                            }}</el-button>
                            <!-- 导入 -->
                            <el-dropdown trigger="click">
                                <el-button type="success">
                                    {{ getButtonText('import') }}<el-icon
                                        class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleImportAdd">{{ getButtonText('importCreate')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handleImportUpd">{{ getButtonText('importUpdate')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 物流单号 -->
                            <el-dropdown trigger="click">
                                <el-button type="warning">
                                    {{ getButtonText('trackingNo')
                                    }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="applyNo">{{ getButtonText('applyNo')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handleImport"> {{ getButtonText('importTrackingNo')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handleCancelTrackingNo"> {{
                                            getButtonText('cancelTrackingNo')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 打印 -->
                            <el-dropdown trigger="click">
                                <el-button type="info">
                                    {{ getButtonText('print') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handlePrint(403)"> {{ getButtonText('trackingNo')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handlePrint(404)">{{ getButtonText('serviceOrder')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handlePrint(405)">{{ getButtonText('attachment')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handlePrint(402)">{{
                                            getButtonText('commercialInvoice')
                                        }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 加入波次 -->
                            <el-dropdown trigger="click">
                                <el-button type="primary">
                                    {{ getButtonText('waveNo')
                                    }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleJoinWave">{{ getButtonText('joinWave')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handleExitWave"> {{
                                            getButtonText('exitWave')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 分配库存 -->
                            <el-dropdown trigger="click">
                                <el-button type="danger">
                                    {{ getButtonText('assignStock')
                                    }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleInventory">{{ getButtonText('assignStock')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handleCancelInventory"> {{
                                            getButtonText('cancelAssign')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 拦截 -->
                            <el-dropdown trigger="click">
                                <el-button type="danger">
                                    {{ getButtonText('intercept')
                                    }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="ApplyHoldUp">{{ getButtonText('ApplyHoldUp')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="CancelHoldUp"> {{
                                            getButtonText('CancelHoldUp')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 问题 -->
                            <el-button type="primary" @click="handleProblem" :icon="Plus">{{
                                getButtonText('registerProblem')
                                }}</el-button>
                            <!-- 状态修改 -->
                            <el-dropdown trigger="click">
                                <el-button type="success">
                                    {{ getButtonText('status') }}<el-icon
                                        class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="handleToAllocate">{{ getButtonText('pendingAssign')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="handleToDraft">{{ getButtonText('draft')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 批量设置 -->
                            <el-dropdown trigger="click">
                                <el-button type="warning">
                                    {{ getButtonText('batchSet') }}<el-icon
                                        class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="setWarehouse"> {{ getButtonText('setWarehouse')
                                            }}</el-dropdown-item>
                                        <el-dropdown-item @click="setShipway">{{ getButtonText('setChannel')
                                            }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <!-- 导出 -->
                            <el-button type="success" @click="handleExport" :icon="Share">{{ getButtonText('export')
                            }}</el-button>
                            <!-- 导出文件 -->
                            <el-button type="info" @click="handleExportAttachment" :icon="Share">{{
                                getButtonText('exportAttachment')
                                }}</el-button>
                            <!-- 删除 -->
                            <el-button type="danger" @click="handleDel" :icon="Delete">{{ getButtonText('del')
                            }}</el-button>
                        </div>
                    </div>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row }">
                    <div style="display: flex; align-items: center;">
                        <div class="cursor-pointer" @click=" handleEdit(row)">
                            <el-icon>
                                <Edit />
                            </el-icon>
                            <span>{{ getButtonText('edit') }}</span>
                        </div>
                        <!-- <el-dropdown>
                            <span class="cursor-pointer">
                                {{ getButtonText('print') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handlePrint('1', row)">{{
                                        getButtonText('printInboundOrder') }}</el-dropdown-item>
                                    <el-dropdown-item @click="handlePrint('2', row)">{{
                                        getButtonText('printBoxLabel') }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
</el-dropdown> -->
                        <el-dropdown>
                            <span class="cursor-pointer">
                                {{ getButtonText('more') }}
                                <el-icon>
                                    <arrow-down />
                                </el-icon>
                            </span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="handleCopy(row)">{{ getButtonText('copy')
                                    }}</el-dropdown-item>
                                    <el-dropdown-item @click="handleCancel(row)">{{ getButtonText('cancelReceipt')
                                    }}</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <template #statusName="{ row }">
                    <span :style="{ color: row.statusId !== 99 ? 'green' : 'red' }">{{ row.statusName }}</span>
                </template>
                <template #orderNo="{ row }">
                    <div class="copyDiv">
                        <el-tooltip content="copy" placement="left">
                            <el-icon class="copyIcon" @click.stop="copyToClipboard(row.orderNo)">
                                <DocumentCopy />
                            </el-icon>
                        </el-tooltip>
                        <span class="copyText" @click="handleInfo(row)">{{ row.orderNo }}</span>
                    </div>
                </template>
                <template #holdUpName="{ row }">
                    <span :style="{ color: row.holdUpId == 2 ? 'red' : 'green' }">{{ row.holdUpName }}</span>
                </template>
                <template #isReturn="{ row }">
                    <span :style="{ color: row.isReturn ? 'red' : 'green' }">{{ row.isReturn ? '是' : '否' }}</span>
                </template>
                <template #isValiPackage="{ row }">
                    <span :style="{ color: row.isValiPackage ? 'red' : 'green' }">{{ row.isValiPackage ? '是' : '否'
                        }}</span>
                </template>
                <template #isValiLabel="{ row }">
                    <span :style="{ color: row.isValiLabel ? 'red' : 'green' }">{{ row.isValiLabel ? '是' : '否' }}</span>
                </template>
                <template #isValiPackageNeed="{ row }">
                    <span :style="{ color: row.isValiPackageNeed ? 'red' : 'green' }">{{ row.isValiPackageNeed ? '是' :
                        '否' }}</span>
                </template>
                <template #isAllocateInventory="{ row }">
                    <span :style="{ color: row.isAllocateInventory ? 'green' : 'red' }">{{ row.isAllocateInventory ? '是'
                        :
                        '否' }}</span>
                </template>
                <template #isShortage="{ row }">
                    <span :style="{ color: row.isShortage ? 'red' : 'green' }">{{ row.isShortage ? '是' :
                        '否' }}</span>
                </template>
                <template #customer="{ row }">
                    {{ row.customerCode }}({{ row.customerName }})
                </template>
                <!-- 备注 -->
                <template #remark="{ row }">
                    <span class="copyText" @click="handleRemark(row.id)"> ({{ row.remarkQty }})</span>
                    {{ row.remarkQty > 0 ? row.newestRemark : '' }}
                </template>
                <!-- 附件 -->
                <template #fileQty="{ row }">
                    <span class="copyText" @click="handleFile(row.id)"> ({{ row.fileQty }})</span>
                </template>
                <!-- 跟踪单号 -->
                <template #trackingNoCount="{ row }">
                    <span class="copyText" v-if="row.trackingNoCount > 0" @click="handleTrackingNo(row.id)">是 ({{
                        row.trackingNoCount }})</span>
                    <span style="color: red;" v-else>否</span>
                </template>
                <!-- 增值服务单号 -->
                <template #vasOrderNo="{ row }">
                    <span class="copyText" @click="handleServiceNo(row)">{{ row.vasOrderNo }}</span>
                </template>
            </hydTable>
        </div>
        <!-- 导出弹窗 -->
        <exportDialog ref="exportDialogRef" :selectionRows="selectionRows" :initValues="initValues" :exportType="400">
        </exportDialog>
        <!-- 打印弹窗 -->
        <printDialog ref="printDialogRef" :selectionRows="selectionRows" :initValues="initValues" :printType="printType"
            :printRangeValue="1" :showPrintQty="false" :showPrintFormat="showPrintFormat"
            :onPrintSuccess="handlePrintSuccess">
        </printDialog>
        <!-- 导入运单弹窗 -->
        <importDialog ref="importDialogRef" />
        <!-- 批量设置 -->
        <batchSettingDialog ref="batchDialogRef" :type="currentType" :warehouseOptions="warehouseOptions"
            @confirm="handleDialogConfirm" />
        <!-- 申请单号 -->
        <applyWayBillDialog ref="applyWayBillDialogRef" :selectionRows="selectionRows"
            @confirm="handleApplyNoConfirm" />
        <!-- 备注 -->
        <remarkDialog ref="remarkDialogRef" :id="selectionRows.id" @close="handleDialogClose" />
        <!-- 附件 -->
        <fileDialog ref="fileDialogRef" :id="selectionRows.id" @close="handleDialogClose" />
        <!-- 跟踪单号 -->
        <trackingNoDialog ref="trackingNoDialogRef" />
        <!-- 导出附件弹窗 -->
        <el-dialog v-model="fileDialogVisible" title="导出附件" width="500" align-center destroy-on-close>
            <el-form :model="form">
                <el-form-item label="导出类型:" label-width="90px">
                    <el-select v-model="exportTypeId">
                        <el-option v-for="(item, index) in fileOptions" :label="item.name" :value="item.id"
                            :key="index" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="fileDialogVisible = false"> {{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleExportFile">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 分配库存弹窗 -->
        <el-dialog v-model="inventoryDialogVisible" title="指定库存范围" width="800" align-center
            :close-on-click-modal="false" destroy-on-close>
            <inventoryRangeForm ref="inventoryRangeFormRef"></inventoryRangeForm>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="inventoryDialogVisible = false"> {{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleInventoryRange">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 创建波次 -->
        <el-dialog v-model="waveDialogVisible" title="加入波次" width="800" align-center :close-on-click-modal="false"
            destroy-on-close>
            <el-form :model="waveFormData" label-width="110px">
                <el-form-item :label="getLabel('isJoin')" prop="inOrderIds">
                    <el-select v-model="waveFormData.isJoin" :placeholder="getPlaceholder('isJoin')" clearable>
                        <el-option label="加入波次" :value="true" />
                        <el-option label="创建波次" :value="false" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="waveFormData.isJoin" :label="getLabel('outWaveNo')">
                    <el-input v-model.trim="waveFormData.waveNo" :placeholder="getPlaceholder('outWaveNo')" clearable />
                </el-form-item>
            </el-form>
            <inventoryRangeForm v-if="!waveFormData.isJoin" ref="inventoryRangeFormRef"></inventoryRangeForm>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="waveDialogVisible = false"> {{ getButtonText('cancel') }}</el-button>
                    <el-button type="primary" @click="handleWave">
                        {{ getButtonText('confirm') }}
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 问题弹窗 -->
        <AddProblemDialog ref="addProblemDialogRef" @close="handleDialogClose" />

        <batchOperationn :dialogTitle="'操作结果'" :isVisible="delDialogVisible" :tableData="delData" :nameField="'id'"
            :nameLabel="'出库单号'" @close="delColse" :promptMessage="promptMessage" />
    </div>
</template>
<script setup name="出库单">
import { getOutstockOrderApi, deleteOutstockOrderApi, getOutstockOrderStatusMenuApi } from '@/api/outstockApi/order.js'
import { outstockOrderTypeApi, outstockOrderBatchSetWarehouseApi, outstockOrderBatchSetChannelApi, outstockOrderApplyTrackingNoApi, outstockOrderCancelTrackingNoApi, outstockOrderStatusApi, outstockOrderCreateWayEnumApi, outstockOrderEcommercePlatformApi, outstockOrderSupplierPushStatusEnumApi, getOutstockOrderTimeFilterEnumApi, getOutstockOrderCountBtnEnumApi, getOutstockOrderExportTypeEnumApi, getOutstockOrderExportZIPApi, getAllocateInventoryApi, getCancelAllocateInventoryApi, getJoinWaveApi, getExitWaveApi, outstockOrderToPendingAllocationApi, outstockOrderToDraftApi } from '@/api/outstockApi/order.js';
// import { } from '@/api/instockApi/order.js';
import { outstockOrderApplyHoldUptApi, outstockOrderCancelHoldUpApi, getOrderHoldupStatusApi } from '@/api/outstockApi/holdup.js'
import { getOrgListCompanyApi } from '@/api/baseApi/org.js';
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { getCustomerLikeQueryApi } from '@/api/baseApi/sku.js'
import { Plus, Delete, Share } from '@element-plus/icons-vue'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import remarkDialog from './remarkDialog.vue'
import fileDialog from './fileDialog.vue'
import trackingNoDialog from './trackingNoDialog.vue'
import inventoryRangeForm from './InventoryRangeForm.vue'
import selectDate from '@/components/table/selectDate.vue'
import printDialog from '@/components/print-export-importDialog/printDialog.vue';
import importDialog from './importDialog.vue'
import exportDialog from '@/components/print-export-importDialog/exportDialog.vue';
import batchSettingDialog from './batchSettingDialog.vue'
import applyWayBillDialog from './applyWayBillDialog.vue';
import batchOperationn from '@/components/messageNotices/batchOperation.vue'
import canonicalInput from '@/components/table/canonicalInpt.vue';
import { openVasPrintWindow } from '@/views/vas/vas/vasOrder/printMethods.js'
import { smartAlert, trimObjectStrings } from '@/utils/genericMethods.js'
import router from '@/router/index.js'
import { useRefreshStore } from '@/store/refresh.js'
const refreshStore = useRefreshStore()
import { getLabel } from '@/utils/i18n/i18nLabels.js';

import { getProductShipwayTypeEnumApi, getProductShipwayListApi, getProductShipwayBrandListApi, getProductSupplierListApi } from '@/api/productApi/shipway.js'
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
// import { } from '@/api/instockApi/order.js'
import { getCustomerApiTypeEnumApi } from "@/api/baseApi/cust.js";
import { getWhZoneEnumApi } from '@/api/baseApi/wh.js'

import { getInstockInOrderBusinessEnumApi, updOrderInOrderCancelInReceiptByIdApi, getInstockInOrderCalculateFeeStatusEnumApi, getOrderQualityEnumApi } from '@/api/instockApi/order.js';
import { ref } from 'vue';
import AddProblemDialog from './addProblemDialog.vue';



// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    // { type: 'date', prop: 'createdTimeBegin', offsetDays: 30, useEndOfDay: false },
    // { type: 'date', prop: 'createdTimeEnd', useEndOfDay: true },
])


// 初始化表单数据
const initValues = ref({
    orgId: [],
    way: 'orderNoList',
})

const way = ref([
    // 出库单号
    { label: getLabel('orderNo'), value: 'orderNoList' },
    // 客户单号
    { label: getLabel('customerOrderNo'), value: 'customerOrderNoList' },
    // 电商单号
    { label: getLabel('ecOrderNo'), value: 'ecOrderNoList' },
    // 跟踪单号
    { label: getLabel('trackingNo'), value: 'trackingNoList' },
])

const dateSelectRef = ref(null)
const timeTypeOptions = ref(null)
// 初始化日期范围
const getDefaultDateRange = () => {
    const time2 = new Date();
    time2.setHours(23, 59, 59, 999);

    const time1 = new Date(time2);
    time1.setDate(time1.getDate() - 30);
    time1.setHours(0, 0, 0, 0);

    // 格式化为 YYYY-MM-DD HH:mm:ss 格式
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    return [formatDate(time1), formatDate(time2)];
};
const selectDateData = ref({
    dateType: 10,
    dateRange: getDefaultDateRange()
})
const handleTimeChange = (data) => {
    console.log('时间变化', data);
    selectDateData.value = data
}

// 搜索事件
const handleSearch = (data) => {
    loading.value = true;
    initValues.value = {
        ...data,
        statusIdList: statusIdsArr.value,
        timeType: selectDateData.value.dateType,
        timeBegin: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[0] : '',
        timeEnd: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[1] : '',
    }
    // 定义所有可能的字段
    const fields = way.value.map(item => item.value);
    // 筛选出需要删除的字段（排除当前选中的way）
    const fieldsToDelete = fields.filter(field => field !== data.way);
    // 循环删除不需要的字段
    fieldsToDelete.forEach(field => {
        delete initValues.value[field];
    });
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 重置事件
const handleReset = (data) => {
    loading.value = true;
    selectDateData.value = {
        dateType: 10,
        dateRange: getDefaultDateRange()
    }
    nextTick(() => {
        dateSelectRef.value.reset();
    })
    initValues.value = {
        ...data,
        statusIdList: [],
        timeType: selectDateData.value.dateType,
        timeBegin: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[0] : '',
        timeEnd: selectDateData.value.
            dateRange ? selectDateData.value.dateRange[1] : '',
    }
    statusIdsArr.value = []
    handleCascaderChange()
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 表格数据--------------------------------------
const tableData = shallowRef([])
// 底部信息
const footer = ref({})
// 表格列配置
const columns = ref([
    // 核心基础字段（固定左侧，优先展示）
    { label: '公司', prop: 'orgName', width: '130', fixed: 'left', sortable: true },
    { label: '仓库', prop: 'warehouseCode', width: '135', fixed: 'left', sortable: true },
    { label: '客户', prop: 'customerCode', width: '180', slot: 'customer', fixed: 'left', sortable: true }, // 修正prop为实体类的customerName
    { label: '出库单号', prop: 'orderNo', width: '250', sortable: true, slot: 'orderNo', fixed: 'left' },
    { label: '客户订单号', prop: 'customerOrderNo', width: '180', sortable: true },


    // 订单类型与状态（核心业务属性）
    { label: '出库单类型', prop: 'typeName', width: '125', sortable: true },
    { label: '业务类型', prop: 'businessName', width: '110', sortable: true },
    { label: '订单状态', prop: 'statusName', width: '125', sortable: true, slot: 'statusName' },
    { label: '是否退件', prop: 'isReturn', width: '125', sortable: true, slot: 'isReturn' },
    { label: '拦截状态', prop: 'holdUpName', width: '125', sortable: true, slot: 'holdUpName' },

    // 物流核心信息
    { label: '收件人国家', prop: 'receiverCountryCode', width: '180', sortable: true },
    { label: '运输方式', prop: 'shipwayTypeName', width: '125', sortable: true },
    { label: '物流产品代码', prop: 'shipwayCode', width: '110', sortable: true },
    { label: '物流品牌代码', prop: 'carrierCode', width: '125', sortable: true },
    { label: '服务商代码', prop: 'supplierCode', width: '140', sortable: true },
    { label: '物流单号个数', prop: 'trackingNoCount', width: '150', slot: 'trackingNoCount' },
    { label: '跟踪单号', prop: 'trackingNos', width: '180', sortable: true },
    { label: '增值服务单号', prop: 'vasOrderNo', width: '180', sortable: true, slot: 'vasOrderNo' },

    // 商品与库存信息
    { label: 'SKU个数', prop: 'skuQty', width: '125', sortable: true },
    { label: 'SKU预览', prop: 'skus', width: '180' },
    { label: '商品总数', prop: 'goodsQty', width: '125', sortable: true },
    { label: '商品总重', prop: 'goodsWeight', width: '125', sortable: true },
    { label: '商品总价', prop: 'goodsPrice', width: '125', sortable: true },
    { label: '库区数量', prop: 'zoneQtys', width: '180' },
    { label: '库区号', prop: 'zoneCodes', width: '180', sortable: true },
    { label: '是否已分配库存', prop: 'isAllocateInventory', width: '170', sortable: true, slot: 'isAllocateInventory' },
    { label: '是否缺货', prop: 'isShortage', width: '125', sortable: true, slot: 'isShortage' },
    { label: '电商平台', prop: 'ecPlatform', width: '125', sortable: true },
    { label: '电商店铺账号', prop: 'ecSaleAccount', width: '140', sortable: true },
    { label: '电商订单号', prop: 'ecOrderNo', width: '130', sortable: true },

    // 操作流程时间节点（按流程顺序）
    { label: '建波时间', prop: 'createWaveTime', width: '150', sortable: true },
    { label: '开始下架时间', prop: 'outShelfTimeStart', width: '150', sortable: true },
    { label: '完成下架时间', prop: 'outShelfTimeEnd', width: '150', sortable: true },
    { label: '打包装箱时间', prop: 'packageTime', width: '150', sortable: true },
    { label: '出库称重时间', prop: 'outWeightTime', width: '150', sortable: true },
    { label: '打托时间', prop: 'packetTime', width: '150', sortable: true },
    { label: '计划发货时间', prop: 'planShippedTime', width: '150', sortable: true },
    { label: '实际出库发货时间', prop: 'shippedTime', width: '180', sortable: true },
    { label: '上网时间', prop: 'ascanTime', width: '150', sortable: true },
    { label: '签收时间', prop: 'deliveredTime', width: '150', sortable: true },

    // 波次与托盘信息
    { label: '波次号码', prop: 'outWaveNo', width: '110', sortable: true },
    { label: '波次中顺序', prop: 'outWaveIndex', width: '125', sortable: true },
    { label: '托盘号', prop: 'packetNo', width: '125', sortable: true },
    { label: '托盘数量', prop: 'palletQty', width: '125', sortable: true }, // 补充字段

    // 重量与费用信息
    { label: '出库重量(KG)', prop: 'outWeightKg', width: '180', sortable: true },
    { label: '出库重量(LB)', prop: 'outWeightLb', width: '180', sortable: true },
    { label: '体积重', prop: 'volumeWeight', width: '125' },
    { label: '计费重', prop: 'billWeight', width: '125' },
    { label: '承保金额币种', prop: 'insuranceCurrency', width: '180', sortable: true },
    { label: '承保金额', prop: 'insurancePremium', width: '125' },
    { label: '计费状态', prop: 'calculateFeeStatus', width: '110', sortable: true },
    { label: '上次计费时间', prop: 'calculateFeeTime', width: '150', sortable: true },
    { label: '计费次数', prop: 'calculateFeeCount', width: '125', sortable: true },
    { label: '计费消息', prop: 'calculateFeeMsg', width: '180' },

    // 时效统计字段
    { label: '出库时长', prop: 'shippedExTime', width: '125', sortable: true },
    { label: '出库到揽收小时', prop: 'ascanHour', width: '180', sortable: true },
    { label: '出库到签收小时', prop: 'deliveredHour', width: '180', sortable: true },

    // 验证与操作状态
    { label: '是否需要复核装箱', prop: 'isValiPackageNeed', width: '180', sortable: true, slot: 'isValiPackageNeed' },
    { label: '是否已复核装箱', prop: 'isValiPackage', width: '180', sortable: true, slot: 'isValiPackage' },
    { label: '是否已验证贴单', prop: 'isValiLabel', width: '180', sortable: true, slot: 'isValiLabel' },
    { label: '物流单打印次数', prop: 'printLabelCount', width: '150', sortable: true }, // 补充字段
    { label: '拣货单打印次数', prop: 'printOutShelfCount', width: '150', sortable: true }, // 补充字段

    // 联系人与附件信息
    { label: '收件人姓名', prop: 'receiverName', width: '150' },
    { label: '收件人电话', prop: 'receiverPhone', width: '140' },
    { label: '寄件人姓名', prop: 'senderName', width: '150' },
    { label: '寄件人电话', prop: 'senderPhone', width: '140' },
    { label: '附件数量', prop: 'fileQty', width: '125', slot: 'fileQty' },
    { label: '待解决问题数', prop: 'unresolvedProblemQty', width: '150' },

    // 其他辅助信息
    { label: '退货单号', prop: 'returnNo', width: '110', sortable: true },
    { label: '自提代码', prop: 'pickupCode', width: '110' },
    { label: '最新轨迹', prop: 'lastTrace', width: '180', sortable: true },
    { label: '备注', prop: 'remark', width: '150', slot: 'remark' },
    { label: '创建时间', prop: 'createdTime', width: '150', sortable: true }, // 补充字段
    { label: '更新时间', prop: 'updatedTime', width: '150', sortable: true },// 补充字段
    { label: '操作', prop: 'action', width: '150', fixed: 'right', slot: 'customBtn' }
])

const pagination = ref({
    currentPage: 1,
    pageSize: 100,
    total: 99
})

const loading = ref(true)

// 事件回调
const handleSelectionChange = (selection) => {
    selectionRows.value = selection
    console.log('选中的数据：', selectionRows.value)
}

const handleRowClick = (row) => {
    console.log('点击的行数据：', row)
    selection.value = row
}

const handlePageChange = ({ pageSize, currentPage }) => {
    loading.value = true
    console.log('分页变化：', pageSize, currentPage)
    pagination.value.pageSize = pageSize
    pagination.value.currentPage = currentPage
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 排序条件
const orderBy = ref('')
// 点击表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    orderBy.value = sortString
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
}
// 编辑
const handleEdit = (row) => {
    router.push({
        name: '编辑出库单',
        params: { id: row.id, name: row.orderNo },
    })
}

// 导入
const handleImportAdd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 400, typeName: '出库单创建' },
    })
}
const handleImportUpd = async () => {
    router.push({
        name: '导入文件',
        params: { typeId: 400, typeName: 'SKU更新' },
    })
}

// 登记问题
const addProblemDialogRef = ref(null)
const handleProblem = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择问题数据！'
        });
        return
    }
    const outOrderNoList = selectionRows.value.map(item => item.orderNo)
    addProblemDialogRef.value.open(outOrderNoList)
}

// 详情
const handleInfo = (row) => {
    router.push({
        name: '出库单详情',
        params: { id: row.id, name: row.orderNo },
    })
}
// 增值服务
const handleServiceNo = (row) => {
    router.push({
        name: '增值服务单详情',
        params: { id: row.vasOrderNo, name: row.vasOrderNo },
    })
}
// 复制
const handleCopy = (row) => {
    router.push({
        name: '出库单复制',
        params: { id: row.id },
    })
}
// 批量设置------------------------------------
// 设置仓库
const batchDialogRef = ref(null)
const currentType = ref('warehouse')
const setWarehouse = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要设置的数据！'
        });
        return
    }
    currentType.value = 'warehouse'
    batchDialogRef.value.open()
}
const setShipway = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要设置的数据！'
        });
        return
    }
    currentType.value = 'channel'
    batchDialogRef.value.open()
}
// 批量设置弹窗确定
const handleDialogConfirm = async (e) => {
    loading.value = true;
    delDialogVisible.value = true;
    delData.value = [];
    promptMessage.value = '操作中...'
    if (currentType.value === 'warehouse') {
        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await outstockOrderBatchSetWarehouseApi({ outOrderId: selectionRows.value[i].id, warehouseCode: e.warehouseCode });
            delData.value.push({
                id: selectionRows.value[i].orderNo,
                msg: res.msg,
                success: res.success
            });
        }
    } else {
        for (let i = 0; i < selectionRows.value.length; i++) {
            const res = await outstockOrderBatchSetChannelApi({ outOrderId: selectionRows.value[i].id, shipwayCode: e.shipwayCode, carrierCode: e.carrierCode });
            delData.value.push({
                id: selectionRows.value[i].orderNo,
                msg: res.msg,
                success: res.success
            });
        }
    }
    loading.value = false;
    promptMessage.value = '操作完成！'
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}
// 物流单号------------------
const importDialogRef = ref(null)

const applyWayBillDialogRef = ref(null)
const applyNo = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要申请的数据！'
        });
        return
    }
    applyWayBillDialogRef.value.open()
}
const handleApplyNoConfirm = async (e) => {
    loading.value = true;
    delDialogVisible.value = true;
    delData.value = [];
    promptMessage.value = '操作中...'
    for (let i = 0; i < selectionRows.value.length; i++) {
        const res = await outstockOrderApplyTrackingNoApi({ outOrderId: selectionRows.value[i].id, ...e });
        delData.value.push({
            id: selectionRows.value[i].orderNo,
            msg: res.msg,
            success: res.success
        });
    }
    loading.value = false;
    promptMessage.value = '操作完成！'
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
    getStatus()
}

// 申请运单号
// const applyNo = async () => {
//     if (selectionRows.value.length === 0) {
//         ElMessage({
//             type: 'warning',
//             message: '请选择要申请运单号的数据！'
//         });
//         return;
//     }
//     ElMessageBox.confirm(
//         `是否要为${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条订单申请单号?`,
//         '提醒',
//         {
//             confirmButtonText: '确定',
//             cancelButtonText: '取消',
//             type: 'warning'
//         }
//     )
//         .then(async () => {
//             loading.value = true;
//             delDialogVisible.value = true;
//               delData.value = []; 
// promptMessage.value = '操作中...'
//             for (let i = 0; i < selectionRows.value.length; i++) {
//                 const res = await outstockOrderApplyTrackingNoApi({ outOrderId: selectionRows.value[i].id });
//                 delData.value.push({
//                     id: selectionRows.value[i].orderNo,
//                     msg: res.msg,
//                     success: res.success
//                 });
//             }
//             promptMessage.value = '操作完成！'
//         })
//         .catch(() => {
//             ElMessage({
//                 type: 'info',
//                 message: '已取消删除'
//             });
//         });
// }
// 取消运单号
const handleCancelTrackingNo = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要申请运单号的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要取消${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条订单的单号?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await outstockOrderCancelTrackingNoApi({ outOrderId: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
}
// 导入运单
const handleImport = () => {
    importDialogRef.value.open()
}
// 申请拦截
const ApplyHoldUp = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要拦截的数据！'
        });
        return;
    }

    // 使用prompt创建带输入框的对话框
    ElMessageBox.prompt(
        `请输入拦截${selectionRows.value.length}条订单的备注信息：`,
        '拦截确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            inputPlaceholder: '请输入备注（可选）',
        }
    )
        .then(async ({ value }) => {
            // value为用户输入的备注内容
            const remark = value.trim();
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'

            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await outstockOrderApplyHoldUptApi({
                    outOrderId: selectionRows.value[i].id,
                    msg: remark
                });

                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
            }

            promptMessage.value = '操作完成！';
            loading.value = false;
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消拦截操作'
            });
        });
}
// 取消拦截
const CancelHoldUp = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要取消的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要取消拦截${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条订单?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await outstockOrderCancelHoldUpApi({ outOrderId: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
}

// 备注
const remarkDialogRef = ref(null)
const handleRemark = (id) => {
    setTimeout(() => {
        remarkDialogRef.value.open(id)
    }, 100)
}
const handleDialogClose = (hasChanged) => {
    if (hasChanged) {
        loading.value = true;
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        getStatus()
    }
}
// 附件
const fileDialogRef = ref(null)
const handleFile = (id) => {
    setTimeout(() => {
        fileDialogRef.value.open(id)
    }, 100)
}
// 跟踪单号
const trackingNoDialogRef = ref(null)
const handleTrackingNo = (id) => {
    setTimeout(() => {
        trackingNoDialogRef.value.open(id)
    }, 100)
}


// 取消收货
const handleCancel = (row) => {
    ElMessageBox.confirm(
        `是否要取消${row.orderNo}的收货数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            const res = await updOrderInOrderCancelInReceiptByIdApi({ id: row.id });
            console.log('删除数据:', res);
            getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
            getStatus()
            smartAlert(res.msg, res.success, 1000)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 删除
const delData = ref([]);
const promptMessage = ref('')
const delDialogVisible = ref(false);
const handleDel = () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要删除${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await deleteOutstockOrderApi({ id: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('删除数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除'
            });
        });
};
const delColse = () => {
    delDialogVisible.value = false;
    delData.value = [];
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
    getStatus()
};

// 转为待分配
const handleToAllocate = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要修改的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据改为待分配?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await outstockOrderToPendingAllocationApi({ outOrderId: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('删除数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// 转为草稿
const handleToDraft = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要修改的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将${selectionRows.value.length > 0 ? selectionRows.value.length : '该'}条数据改为草稿?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await outstockOrderToDraftApi({ outOrderId: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
                console.log('删除数据:', res);
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}
// const selectionItem = ref({}) // 用于存储单个选中行数据
// 导出
const exportDialogRef = ref(null)
const handleExport = async () => {
    exportDialogRef.value.openExportDialog()
}
// 导出附件
const fileDialogVisible = ref(false);
const exportTypeId = ref(10);
const handleExportAttachment = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要导出的数据！'
        });
        return;
    }
    fileDialogVisible.value = true;
};
// 确定导出附件
const handleExportFile = async () => {
    const idList = selectionRows.value.map(item => item.id);
    const res = await getOutstockOrderExportZIPApi({
        exportTypeId: exportTypeId.value,
        idList: idList
    });
    smartAlert(res.msg, res.success, 1000);
    if (res.success) {
        fileDialogVisible.value = false;
    }
}

// 分配库存
const inventoryDialogVisible = ref(false);
const inventoryRangeFormRef = ref(null)
const handleInventory = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要分配库存的数据！'
        });
        return;
    }
    inventoryDialogVisible.value = true;
}

const handleInventoryRange = async () => {
    const data = inventoryRangeFormRef.value.getFormData()
    inventoryDialogVisible.value = false;
    delData.value = [];
    for (let i = 0; i < selectionRows.value.length; i++) {
        loading.value = true;
        delDialogVisible.value = true;
        promptMessage.value = '操作中...'
        data.outOrderId = selectionRows.value[i].id;
        console.log('分配库存数据:', data)
        const res = await getAllocateInventoryApi(data);
        delData.value.push({
            id: selectionRows.value[i].orderNo,
            msg: res.msg,
            success: res.success
        });
    }
    promptMessage.value = '操作完成！'
}
// 取消分配
const handleCancelInventory = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要取消的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要取消这${selectionRows.value.length > 0 ? selectionRows.value.length : ''}条数据分配的库存?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await getCancelAllocateInventoryApi({ outOrderId: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}

// 加入波次
const waveDialogVisible = ref(false);
const waveFormData = ref({
    isJoin: true,
    waveNo: ''
});

const handleJoinWave = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要加入波次的数据！'
        });
        return;
    }
    waveFormData.value.isJoin = true;
    waveFormData.value.waveNo = '';
    waveDialogVisible.value = true;
}
const handleWave = async () => {
    if (waveFormData.value.isJoin && !waveFormData.value.waveNo) {
        ElMessage({
            type: 'warning',
            message: '请输入波次号！'
        });
        return;
    }

    const outOrderIdList = selectionRows.value.map(item => item.id);
    let res
    if (waveFormData.value.isJoin && waveFormData.value.waveNo) {
        res = await getJoinWaveApi({ waveNo: waveFormData.value.waveNo, outOrderIdList });
    } else {
        const allocateInventoryReqDto = inventoryRangeFormRef.value.getFormData()
        res = await getJoinWaveApi({ outOrderIdList, allocateInventoryReqDto });
    }
    if (res.data) {
        delDialogVisible.value = true;
        delData.value = [];
        promptMessage.value = '操作中...'
        delData.value = res.data.map(item => ({
            id: item.code,
            msg: item.msg,
            success: item.success
        }))
        promptMessage.value = '操作完成！'
    } else {
        smartAlert(res.msg, res.success, 1000)
    }

    waveDialogVisible.value = false;
}
// 取消加入波次
const handleExitWave = async () => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请选择要退出的数据！'
        });
        return;
    }
    ElMessageBox.confirm(
        `是否要将这${selectionRows.value.length > 0 ? selectionRows.value.length : ''}条数据退出波次?`,
        '提醒',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            loading.value = true;
            delDialogVisible.value = true;
            delData.value = [];
            promptMessage.value = '操作中...'
            for (let i = 0; i < selectionRows.value.length; i++) {
                const res = await getExitWaveApi({ outOrderId: selectionRows.value[i].id });
                delData.value.push({
                    id: selectionRows.value[i].orderNo,
                    msg: res.msg,
                    success: res.success
                });
            }
            promptMessage.value = '操作完成！'
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消'
            });
        });
}

// 打印
const printDialogRef = ref(null)
const printType = ref(402)
const showPrintFormat = ref(false)
const handlePrint = async (id) => {
    if (selectionRows.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '请先选择要打印的数据！'
        });
        return;
    }
    printType.value = id;
    if (id == 402) {
        showPrintFormat.value = true;
    } else {
        showPrintFormat.value = false;
    }
    await nextTick();
    printDialogRef.value.openPrintDialog()
}
const handlePrintSuccess = async (res, apiParams) => {
    if (typeof res.data === 'string') {
        return false; // 表示未处理，组件触发做默认行为
    }

    // 如果后端返回的是打印数据
    if (Array.isArray(res.data)) {
        // console.log('打印数据:', res.data)
        openVasPrintWindow(res.data);
        return true;
    }
    return false;
};

// 选择的行数据
const selection = ref({})
// 多选的行数据
const selectionRows = ref([])

// 添加按钮
const handleAdd = async () => {
    router.push('/outstock/order/outOrder/add')
}
// 获取列表
const getList = async (currentPage, pageSize, orderBy) => {
    const res = await getOutstockOrderApi({
        page: currentPage,
        pageSize: pageSize,
        orderBy,
        ...trimObjectStrings(initValues.value),
        orgId: initValues.value.orgId.length > 0 ? initValues.value.orgId[initValues.value.orgId.length - 1] : ''
    })
    tableData.value = res.data.rows
    footer.value = res.data.footer[0]
    loading.value = false
    pagination.value = {
        currentPage: res.data.page,
        pageSize: pageSize,
        total: res.data.total
    }
}
// 获状态栏
const getStatus = async () => {
    const data = {
        ...trimObjectStrings(initValues.value),
        statusIdList: initValues.value.statusIdList
    }
    if (data.orgId.length > 0) {
        data.orgId = data.orgId[data.orgId.length - 1]
    } else {
        delete data.orgId
    }
    const res = await getOutstockOrderStatusMenuApi(data)
    statusIdsList.value = res.data
    statusIdsArr.value = [...initValues.value.statusIdList]
}
// 状态栏
const statusIdsList = ref([])
// 状态栏数组
const statusIdsArr = ref([])
// 状态改变事件
const handleStatusChange = async (e) => {
    loading.value = true;
    let list = [...statusIdsArr.value];

    if (list.includes(null)) {
        list = [];
    }

    initValues.value.statusIdList = list;
    getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value);
}
// 公司数据
const companyOptions = ref([]);
const cascaderRef = ref(null);
const parentProps = {
    checkStrictly: true,
    expandTrigger: 'hover'
};
// 公司改变事件
const handleCascaderChange = async (e) => {
    if (e) {
        nextTick(() => {
            cascaderRef.value.togglePopperVisible()
        });
    }
    const orgId = e ? e[e.length - 1] : '';
    const result = await getCustomerLikeQueryApi({ keyword: '*', orgId });
    customerOptions.value = result.data.map(item => ({
        value: item.code,
        label: item.code + '(' + item.name + ')'
    }))
};
// 筛选客户代码
const customerOptions = ref([]);

// 仓库下拉框数据（对应warehouseCode字段）
const warehouseOptions = ref([])
// 国家编码下拉框数据（对应receiver.countryCode/sender.countryCode字段）
const countryOptions = ref([])
// 业务类型下拉框数据（对应businessId字段）
const businessOptions = ref([])
// 运输方式类型下拉框数据（对应shipwayTypeId字段）
const shipwayTypeOptions = ref([])
// 物流方式下拉框数据（对应shipwayCode/shipwayId字段）
const shipwayOptions = ref([])
// 承运商下拉框数据（对应carrierCode字段）
const carrierOptions = ref([])
// 创建方式下拉框数据（对应createWay字段）
const createWayOptions = ref([])
// 收件人地址类型下拉框数据（对应receiver.addressType字段）
const addressTypeOptions = ref([])
// 出库类型下拉框数据（对应typeId字段）
const typeOptions = ref([])
// 订单状态下拉框数据（对应statusId字段）
const statusOptions = ref([])
// 货币类型下拉框数据（对应insuranceCurrency字段）
const currencyOptions = ref([])
// 商品品质下拉框数据（对应skuList.qualityId字段）
const qualityOptions = ref([])
// 物流服务商下拉框数据（对应trackingNoList.supplierId字段）
const supplierOptions = ref([])
// api类型下拉框数据（对应apiType字段）
const apiTypeOptions = ref([])
// 单号状态
const supplierStatusOptions = ref([])
// 计费状态
const calculateFeeStatusOptions = ref([])


// 拦截状态
const holdUpStatusOptions = ref([])
// 库区下拉框数据
const zoneEnumOptions = ref([]);
// 库位下拉框数据
const locationEnumOptions = ref([]);

// 电商平台下拉框数据（对应ecPlatform字段）
const ecPlatformOptions = ref([])
// 数量个数
const countBtnOptions = ref([])
// 导出附件类型
const fileOptions = ref([]);

onMounted(async () => {
    // 获取公司数据
    const companyRes = await getOrgListCompanyApi();
    // 处理公司数据
    const convertToTree = (items) => {
        return items.map(item => ({
            value: item.id,
            label: item.nameCn,
            children: item.children ? convertToTree(item.children) : []
        }));
    };
    companyOptions.value = convertToTree(companyRes.data);
    // const result = await getCustomerLikeQueryApi({ keyword: '*' });
    // customerOptions.value = result.data.map(item => ({
    //     value: item.code,
    //     label: item.code + '(' + item.name + ')'
    // }))
    // // 获取仓库数据
    // const warehouseRes = await getWhWarehouseApi()
    // warehouseOptions.value = warehouseRes.data.map(item => ({ label: item.code + '-' + item.name, value: item.code }))



    loading.value = true;

    try {
        //定义框接口任务
        const apiTasks = [
            {
                key: "国家",
                api: getOrgCountryListApi(),
                handleSuccess: (data) => (countryOptions.value = data || []),
            },
            {
                key: "仓库",
                api: getWhWarehouseApi(),
                handleSuccess: (data) => (warehouseOptions.value = data || []),
            },
            {
                key: "业务类型",
                api: getInstockInOrderBusinessEnumApi(),
                handleSuccess: (data) => (businessOptions.value = data || []),
            },
            {
                key: "客户",
                api: getCustomerLikeQueryApi({ keyword: "*" }),
                handleSuccess: (data) =>
                (customerOptions.value = data.map((item) => ({
                    value: item.code,
                    label: `${item.code}(${item.name})`,
                }))),
            },
            {
                key: "运输方式类型",
                api: getProductShipwayTypeEnumApi(),
                handleSuccess: (data) => (shipwayTypeOptions.value = data || []),
            },
            {
                key: "物流方式",
                api: getProductShipwayListApi(),
                handleSuccess: (data) => (shipwayOptions.value = data || []),
            },
            {
                key: "承运商",
                api: getProductShipwayBrandListApi(),
                handleSuccess: (data) => (carrierOptions.value = data || []),
            },
            {
                key: "物流服务商",
                api: getProductSupplierListApi(),
                handleSuccess: (data) => (supplierOptions.value = data || []),
            },
            {
                key: "货币类型",
                api: getCurrencyEnumApi(),
                handleSuccess: (data) => (currencyOptions.value = data || []),
            },
            {
                key: "商品品质",
                api: getOrderQualityEnumApi(),
                handleSuccess: (data) => (qualityOptions.value = data || []),
            },
            {
                key: "出库类型",
                api: outstockOrderTypeApi(),
                handleSuccess: (data) => (typeOptions.value = data || []),
            },
            {
                key: "订单状态",
                api: outstockOrderStatusApi(),
                handleSuccess: (data) => (statusOptions.value = data || []),
            },
            {
                key: "创建方式",
                api: outstockOrderCreateWayEnumApi(),
                handleSuccess: (data) => (createWayOptions.value = data || []),
            },
            {
                key: "电商平台",
                api: outstockOrderEcommercePlatformApi(),
                handleSuccess: (data) => (ecPlatformOptions.value = data || []),
            },
            {
                key: 'api类型',
                api: getCustomerApiTypeEnumApi(),
                handleSuccess: (data) => (apiTypeOptions.value = data || [])
            },
            {
                key: '库区',
                api: getWhZoneEnumApi(),
                handleSuccess: (data) => (zoneEnumOptions.value = data || [])
            },
            {
                key: '拦截状态',
                api: getOrderHoldupStatusApi(),
                handleSuccess: (data) => (holdUpStatusOptions.value = data || [])
            },
            {
                key: '单号状态',
                api: outstockOrderSupplierPushStatusEnumApi(),
                handleSuccess: (data) => (supplierStatusOptions.value = data || [])
            },
            {
                key: '计费状态',
                api: getInstockInOrderCalculateFeeStatusEnumApi(),
                handleSuccess: (data) => (calculateFeeStatusOptions.value = data || [])
            },
            {
                key: '时间类型',
                api: getOutstockOrderTimeFilterEnumApi(),
                handleSuccess: (data) => (timeTypeOptions.value = data.map(item => ({
                    label: item.name,
                    value: item.id
                })) || [])
            },
            {
                key: '数量个数',
                api: getOutstockOrderCountBtnEnumApi(),
                handleSuccess: (data) => (countBtnOptions.value = data || [])
            },
            {
                key: '附件类型',
                api: getOutstockOrderExportTypeEnumApi(),
                handleSuccess: (data) => (fileOptions.value = data || [])
            }
        ];

        //执行所有请求
        const dropdownResults = await Promise.allSettled(
            apiTasks.map((task) => task.api)
        );

        //统一处理结果
        dropdownResults.forEach((result, index) => {
            const task = apiTasks[index];
            if (result.status === "fulfilled") {
                const res = result.value;
                if (res.success !== false) {
                    task.handleSuccess(res.data);
                } else {
                    smartAlert(`【${task.key}】数据加载失败：${res.msg}`, false);
                }
            } else {
                smartAlert(`【${task.key}】接口请求失败`, false);
                console.error(`[${task.key}] error:`, result.reason);
            }
        });
    } finally {
        // loading.close();
        loading.value = false;
    }
})
// 监听刷新数据
onActivated(() => {
    if (refreshStore.shouldRefreshOutOrderList) {
        getList(pagination.value.currentPage, pagination.value.pageSize, orderBy.value)
        refreshStore.shouldRefreshOutOrderList = false
    }
})
</script>

<style scoped lang="scss">
@use '@/assets/css/viewArea.scss';

// 多选输入框
:deep(.is-near) {
    flex-wrap: nowrap;
}

:deep(.el-tag--info) {
    width: 45px;
}

/* 清楚悬浮黑框 */
:deep(.el-dropdown) {
    outline: none;
}

:deep(.el-tooltip__trigger) {
    outline: none;
}
</style>