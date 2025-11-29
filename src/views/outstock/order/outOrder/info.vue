<template>
    <div class="viewArea">
        <div class="contentDiv flex-container">
            <el-tabs v-model="activeName" class="tabs" @tab-click="handleTabClick">
                <el-tab-pane label="订单信息" name="订单信息">
                    <el-collapse expand-icon-position="left" v-model="activeNames">
                        <el-collapse-item name="1">
                            <template #title>
                                <span class="title">1. {{ $t('basicInfo') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <el-form :model="formData" :rules="rules" ref="formRef" label-width="115px">
                                    <el-row>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('customerCode')" class="compact-item"
                                                prop="customerCode">
                                                <el-select v-model="formData.customerCode" filterable
                                                    popper-class="multi-column-select" clearable disabled>
                                                    <el-option v-for="item in customerOptions" :key="item.value"
                                                        :label="item.label" :value="item.value" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('warehouseCode')" prop="warehouseCode"
                                                required>
                                                <el-select v-model="formData.warehouseCode" filterable clearable
                                                    disabled>
                                                    <el-option v-for="item in warehouseOptions" :key="item.code"
                                                        :label="`${item.code}-${item.name}`" :value="item.code" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('customerOrderNo')" prop="customerOrderNo"
                                                required>
                                                <el-input v-model.trim="formData.customerOrderNo" maxlength="100"
                                                    readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('typeId')" prop="typeId" required>
                                                <el-select v-model="formData.typeId" disabled>
                                                    <el-option v-for="item in typeOptions" :key="item.id"
                                                        :label="item.name" :value="item.id" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('ecPlatform')">
                                                <el-select v-model="formData.ecPlatform" clearable disabled>
                                                    <el-option v-for="item in ecPlatformOptions" :key="item.id"
                                                        :label="item.name" :value="item.id" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('ecOrderNo')">
                                                <el-input v-model.trim="formData.ecOrderNo" maxlength="100" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('ecSaleAccount')">
                                                <el-input v-model.trim="formData.ecSaleAccount" maxlength="100"
                                                    readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('businessId')" prop="businessId">
                                                <el-select v-model="formData.businessId" clearable disabled>
                                                    <el-option v-for="item in businessOptions" :key="item.id"
                                                        :label="item.name" :value="item.id" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('shipwayTypeId')">
                                                <el-select v-model="formData.shipwayTypeId" clearable disabled>
                                                    <el-option v-for="item in shipwayTypeOptions" :key="item.id"
                                                        :label="item.name" :value="item.id" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('carrierCode')">
                                                <el-select v-model="formData.carrierCode" clearable disabled>
                                                    <el-option v-for="item in carrierOptions" :key="item.id"
                                                        :label="item.name" :value="item.code" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('shipwayCode')">
                                                <el-select v-model="formData.shipwayCode" clearable disabled>
                                                    <el-option v-for="item in shipwayOptions" :key="item.id"
                                                        :label="item.name" :value="item.code" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('insuranceCurrency')">
                                                <el-select v-model="formData.insuranceCurrency" clearable disabled>
                                                    <el-option v-for="item in currencyOptions" :key="item.id"
                                                        :label="item.name" :value="item.code" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('insurancePremium')">
                                                <el-input v-model="formData.insurancePremium" v-number readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="18">
                                            <el-form-item :label="getLabel('remark')">
                                                <el-input v-model.trim="formData.remark" type="textarea" rows="1"
                                                    readonly />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item name="2">
                            <template #title>
                                <span class="title">2. {{ $t('recipientInfo') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <el-form :model="formData.receiver" :rules="rules" label-width="115px">
                                    <el-row>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('receiverName')" prop="name">
                                                <el-input v-model.trim="formData.receiver.name" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('receiverCompany')">
                                                <el-input v-model.trim="formData.receiver.company" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('receiverIdentityNumber')">
                                                <el-input v-model.trim="formData.receiver.identityNumber" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('receiverPhoneNumber1')" prop="phoneNumber1">
                                                <el-input v-model.trim="formData.receiver.phoneNumber1" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('receiverPhoneNumber2')">
                                                <el-input v-model.trim="formData.receiver.phoneNumber2" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('receiverEmail')">
                                                <el-input v-model.trim="formData.receiver.email" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('receiverAddressType')">
                                                <el-select v-model="formData.receiver.addressType" disabled>
                                                    <el-option v-for="item in addressTypeOptions" :key="item.id"
                                                        :label="item.name" :value="item.id" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('countryCode')" prop="countryCode">
                                                <el-select v-model="formData.receiver.countryCode" value-key="id"
                                                    filterable disabled>
                                                    <el-option v-for="item in countryOptions" :key="item.id"
                                                        :label="`${item.code}-${item.nameCn}-${item.nameEn}`"
                                                        :value="item.code" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('province')">
                                                <el-input v-model="formData.receiver.province" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('city')" prop="city">
                                                <el-input v-model="formData.receiver.city" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('county')">
                                                <el-input v-model="formData.receiver.county" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item :label="getLabel('addressLine1')" prop="addressLine1">
                                                <el-input v-model="formData.receiver.addressLine1" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item :label="getLabel('addressLine2')">
                                                <el-input v-model="formData.receiver.addressLine2" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <div style="display: flex;">
                                                <el-form-item :label="getLabel('receiverIsFbaAddress')">
                                                    <el-switch v-model="formData.receiver.isFbaAddress" inline-prompt
                                                        active-text="是" inactive-text="否" :active-value="true"
                                                        :inactive-value="false" disabled />
                                                </el-form-item>
                                                <el-form-item :label="getLabel('receiverIsAvis')">
                                                    <el-switch v-model="formData.receiver.isAvis" inline-prompt
                                                        active-text="是" inactive-text="否" :active-value="true"
                                                        :inactive-value="false" disabled />
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-button @click="openAddressDialog(true)" type="primary" plain disabled>{{
                                                getButtonText('addressBook')
                                            }}</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item name="3">
                            <template #title>
                                <span class="title">3. {{ $t('senderInfo') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <el-form :model="formData.sender" :rules="rules" label-width="115px">
                                    <el-row>
                                        <!-- 发件人 -->
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('senderName')">
                                                <el-input v-model.trim="formData.sender.name" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <!-- 公司名 -->
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('senderCompany')">
                                                <el-input v-model.trim="formData.sender.company" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <!--证件号码 -->
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('senderIdentityNumber')">
                                                <el-input v-model.trim="formData.sender.identityNumber" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <!-- 电话1 -->
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('senderPhone1')">
                                                <el-input v-model.trim="formData.sender.phoneNumber1" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <!-- 电话2 -->
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('senderPhone2')">
                                                <el-input v-model.trim="formData.sender.phoneNumber2" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <!-- 邮箱 -->
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('senderEmail')">
                                                <el-input v-model.trim="formData.sender.email" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('countryCode')">
                                                <el-select v-model="formData.sender.countryCode" value-key="id"
                                                    filterable disabled>
                                                    <el-option v-for="item in countryOptions" :key="item.id"
                                                        :label="`${item.code}-${item.nameCn}-${item.nameEn}`"
                                                        :value="item.code" />
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('province')">
                                                <el-input v-model="formData.sender.province" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('city')">
                                                <el-input v-model="formData.sender.city" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item :label="getLabel('county')">
                                                <el-input v-model="formData.sender.county" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item :label="getLabel('addressLine1')">
                                                <el-input v-model="formData.sender.addressLine1" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item :label="getLabel('addressLine2')">
                                                <el-input v-model="formData.sender.addressLine2" readonly />
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="1"></el-col>
                                        <el-col :span="6">
                                            <el-button @click="openAddressDialog(false)" type="primary" plain
                                                disabled>{{
                                                    getButtonText('addressBook')
                                                }}</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item name="4">
                            <template #title>
                                <span class="title">4. {{ $t('productInfo') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <generalAddTable :modelValue="false" :summaryFields="['qty']" ref="skuListTableRef"
                                    :columns="skuColumns" :data="formData.skuList">
                                    <template #sku="{ row }">
                                        <el-input v-model="row.sku" @blur="onSkuBlur(row)" placeholder="请输入SKU"
                                            readonly>
                                            <template #append>
                                                <el-button icon="More" @click="openSkuDialog()" disabled />
                                            </template>
                                        </el-input>
                                    </template>
                                    <template #qty="{ row }">
                                        <el-input v-model="row.qty" placeholder="请输入数量" v-number readonly />
                                    </template>
                                    <template #qualityId="{ row }">
                                        <el-select v-model="row.qualityId" placeholder="请选择品质" disabled>
                                            <el-option v-for="item in qualityOptions" :key="item.id" :label="item.name"
                                                :value="item.id" />
                                        </el-select>
                                    </template>
                                </generalAddTable>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item name="5">
                            <template #title>
                                <span class="title">5. {{ $t('taskAndValueAddedService') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <generalAddTable ref="serviceTableRef" :modelValue="false"
                                    :columns="serviceTableColumns" :data="formData.serviceTableData">
                                    <template #serviceTypeId="{ row }">
                                        <el-select v-model="row.serviceTypeId" placeholder="请选择服务类型" clearable
                                            filterable disabled>
                                            <el-option v-for="item in serviceTypeOptions" :key="item.id"
                                                :label="item.name" :value="item.id" />
                                        </el-select>
                                    </template>
                                    <template #planQty="{ row }">
                                        <el-input v-model.number="row.planQty" v-number disabled />
                                    </template>
                                    <template #unit="{ row }">
                                        <el-select v-model="row.unit" clearable filterable disabled>
                                            <el-option v-for="item in unitOptions" :key="item.name" :label="item.name"
                                                :value="item.name" />
                                        </el-select>
                                    </template>
                                    <template #sku="{ row }">
                                        <span>{{ row.sku }}</span>
                                    </template>
                                    <!-- 合并后的附件列 -->
                                    <template #attachment="{ row }">
                                        <div class="attachment-container">
                                            <!-- 已上传附件列表 -->
                                            <div class="attachment-list"
                                                v-if="row.attachments && row.attachments.length > 0">
                                                <div v-for="(file, index) in row.attachments" :key="index"
                                                    class="attachment-item">
                                                    <a :href="file.url" target="_blank" class="file-link">
                                                        {{ file.name.length > 20 ? file.name.slice(0, 20) + '...' :
                                                            file.name }}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template #remark="{ row }">
                                        <el-input v-model="row.remark" placeholder="请输入备注" type="textarea" disabled />
                                    </template>
                                </generalAddTable>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item name="6">
                            <template #title>
                                <span class="title">6. {{ $t('logisticsPackage') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <generalAddTable :modelValue="false" ref="trackingNoListTableRef"
                                    :columns="logisticsColumns" :data="formData.waybillList"
                                    :init-array-fields="['consumablesList', 'skuList']">
                                    <template #size="{ row }">
                                        <el-input style="width: 55px !important;" v-model="row.length"
                                            placeholder="请输入长" v-number readonly />
                                        <el-input style="width: 55px !important;" v-model="row.width" placeholder="请输入宽"
                                            v-number readonly />
                                        <el-input style="width: 55px !important;" v-model="row.height"
                                            placeholder="请输入高" v-number readonly />
                                    </template>
                                    <template #weight="{ row }">
                                        <el-input v-model="row.weight" placeholder="请输入重量" v-number readonly />
                                    </template>
                                    <template #trackingNo="{ row }">
                                        <div style="display: flex;flex-direction: column;gap: 3px;">
                                            <el-input v-model="row.trackingNo" placeholder="请输入跟踪单号" readonly />
                                            <el-input v-model="row.labelUrl" placeholder="请输入运单URL" readonly>
                                                <template #append>
                                                    <el-upload :auto-upload="true"
                                                        :http-request="(options) => handleLabelUrlUpload(options, row)"
                                                        :before-upload="beforeUpload" multiple :show-file-list="false">
                                                        <el-button icon="Upload" disabled />
                                                    </el-upload>
                                                </template>
                                            </el-input>
                                            <el-input v-model="row.customLabelUrl" placeholder="请输入报关单URL" readonly>
                                                <template #append>
                                                    <el-upload :auto-upload="true"
                                                        :http-request="(options) => handleCustomLabelUrlUpload(options, row)"
                                                        :before-upload="beforeUpload" multiple :show-file-list="false">
                                                        <el-button icon="Upload" disabled />
                                                    </el-upload>
                                                </template>
                                            </el-input>
                                        </div>
                                    </template>

                                    <template #skus="{ row }">
                                        <div class="tableFormSlot" v-for="(sku, index) in row.skuList" :key="index">
                                            <el-select style="width: 110px;" v-model="sku.sku" placeholder="请选择SKU"
                                                @visible-change="handleSkuVisibleChange" disabled>
                                                <!-- 加载状态显示 -->
                                                <template v-if="isSkuLoading">
                                                    <el-option disabled label="加载中..." />
                                                </template>
                                                <!-- 正常选项列表 -->
                                                <template v-else>
                                                    <el-option v-for="item in selectSkuList" :key="item.sku"
                                                        :label="item.sku" :value="item.sku" />
                                                </template>
                                            </el-select>
                                            <el-input style="width: 70px !important;margin: 0 4px;" v-model="sku.qty"
                                                placeholder="请输入数量" v-number readonly />
                                            <el-button icon="Plus" type="success" circle @click="addSku(row)"
                                                disabled />
                                            <el-button icon="Minus" type="danger" circle @click="delSku(row, index)"
                                                disabled />
                                        </div>
                                    </template>
                                    <template #consumables="{ row }">
                                        <div class="tableFormSlot" v-for="(item, index) in row.consumablesList"
                                            :key="index">
                                            <el-select style="width: 120px;" v-model="item.consumablesCode"
                                                placeholder="请选择耗材" disabled>
                                                <el-option v-for="item in consumablesOptions" :key="item.code"
                                                    :label="item.name" :value="item.code" />
                                            </el-select>
                                            <el-input style="width: 70px !important;margin: 0 4px;"
                                                v-model="item.quantity" placeholder="请输入数量" v-number readonly />
                                            <el-button icon="Plus" type="success" circle @click="addConsumables(row)"
                                                disabled />
                                            <el-button icon="Minus" type="danger" circle
                                                @click="delConsumables(row, index)" disabled />
                                        </div>
                                    </template>
                                </generalAddTable>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item name="7">
                            <template #title>
                                <span class="title">7. {{ $t('attachment') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <generalAddTable :modelValue="false" ref="fileListTableRef" :columns="filesColumns"
                                    :data="formData.fileList">
                                    <template #typeId="{ row }">
                                        <el-select v-model="row.typeId" placeholder="请选择附件类型" disabled>
                                            <el-option v-for="item in fileTypeOptions" :key="item.id" :label="item.name"
                                                :value="item.id" />
                                        </el-select>
                                    </template>
                                    <template #fileName="{ row }">
                                        <!-- a标签在新页面打开 -->
                                        <el-input v-model="row.fileName" v-if="row.url" readonly />
                                        <el-upload v-else :auto-upload="true" :http-request="handleUpload"
                                            :before-upload="beforeUpload" multiple :show-file-list="false">
                                            <el-button type="primary" disabled>上传文件</el-button>
                                        </el-upload>
                                    </template>
                                    <template #fileUrl="{ row }">
                                        <a :href="row.url" v-if="row.url" target="_blank">{{ row.url }}</a>
                                    </template>
                                </generalAddTable>
                            </div>
                        </el-collapse-item>

                        <el-collapse-item name="8">
                            <template #title>
                                <span class="title">8. {{ $t('remark') }}</span>
                            </template>
                            <div class="collapse-item-content">
                                <generalAddTable :modelValue="false" ref="remarkListTableRef" :columns="remakeColumns"
                                    :data="formData.remarkList">
                                    <template #remark="{ row }">
                                        <el-input v-model="row.remark" placeholder="请输入备注" readonly />
                                    </template>
                                </generalAddTable>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="状态节点" name="状态节点">
                    <generalAddTable :defaultAddEmptyRow="false" :modelValue="false" :columns="statusNodesColumns"
                        :data="statusNodesData">
                        <template #isSuccess="{ row }">
                            <span :style="{ color: row.isSuccess ? 'green' : 'red' }">{{ row.isSuccess ? '是' : '否'
                            }}</span>
                        </template>
                        <template #isEnd="{ row }">
                            <span :style="{ color: row.isEnd ? 'green' : 'red' }">{{ row.isEnd ? '是' : '否'
                            }}</span>
                        </template>
                    </generalAddTable>
                </el-tab-pane>
                <el-tab-pane label="日志" name="日志">
                    <generalAddTable :defaultAddEmptyRow="false" :modelValue="false" :columns="logColumns"
                        :data="logData">
                        <template #isSuccess="{ row }">
                            <span :style="{ color: row.isSuccess ? 'green' : 'red' }">{{ row.isSuccess ? '成功' : '失败'
                            }}</span>
                        </template>
                        <template #message="{ row }">
                            <div v-html="row.message"></div>
                        </template>
                    </generalAddTable>
                </el-tab-pane>
                <el-tab-pane label="费用" name="费用">费用</el-tab-pane>
                <el-tab-pane label="轨迹" name="轨迹">
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item class="trackItem" :name="item.id" v-for="(item, index) in trackData"
                            :key="index">
                            <template #title="{ isActive }">
                                <el-descriptions :column="4" border :label-width="120">
                                    <!-- 1. trackingNo：内容可能较长，设置较宽 -->
                                    <el-descriptions-item label="跟踪单号:" label-width="110px" width="150px">
                                        {{ item.trackingNo }}
                                    </el-descriptions-item>

                                    <!-- 2. supplierName：中等长度 -->
                                    <el-descriptions-item label="服务商:" label-width="110px" width="180px">
                                        {{ item.supplierName }}
                                    </el-descriptions-item>

                                    <!-- 3. carrierCode：较短 -->
                                    <el-descriptions-item label="承运商:" label-width="80px" width="220px">
                                        {{ item.carrierCode }}
                                    </el-descriptions-item>

                                    <!-- 4. isDelivered：短内容 -->
                                    <el-descriptions-item label="是否签收:" label-width="100px" width="330px">
                                        {{ item.isDelivered ? '是' : '否' }}
                                    </el-descriptions-item>

                                    <!-- 5. deliveredTime：时间格式较长 -->
                                    <el-descriptions-item label="签收时间:" label-width="100px" width="200px">
                                        {{ item.deliveredTime }}
                                    </el-descriptions-item>

                                    <!-- 6. trackCount：数字短内容 -->
                                    <el-descriptions-item label="抓轨迹次数:" label-width="100px" width="180px">
                                        {{ item.trackCount }}
                                    </el-descriptions-item>

                                    <!-- 7. lastTrackTime：时间格式 -->
                                    <el-descriptions-item label="最新抓轨迹时间:" label-width="80px" width="220px">
                                        {{ item.lastTrackTime }}
                                    </el-descriptions-item>

                                    <!-- 8. labelUrl：链接可能较长 -->
                                    <el-descriptions-item label="运单附件" label-width="100px" width="330px">
                                        <a :href="item.labelUrl" target="_blank" v-if="item.labelUrl">下载</a>
                                    </el-descriptions-item>

                                    <!-- 9. supplierReqContent：内容较长，占宽 -->
                                    <el-descriptions-item label="服务商下单报文:" label-width="100px" width="150px">
                                        <el-button @click="handleClose">{{ getButtonText('view') }}</el-button>
                                    </el-descriptions-item>

                                    <!-- 10. supplierRespContent：长内容 -->
                                    <el-descriptions-item label="服务商返回报文:" label-width="100px" width="180px">
                                        <el-button @click="handleClose">{{ getButtonText('view') }}</el-button>
                                    </el-descriptions-item>

                                    <!-- 11. 包裹尺寸/重量：短内容 -->
                                    <el-descriptions-item label="包裹尺寸/重量" label-width="120px" width="220px">
                                        {{ item.length || 0 }}/{{ item.width || 0 }}/{{ item.height || 0 }}CM / {{
                                            item.weight || 0 }}KG
                                    </el-descriptions-item>

                                    <!-- 12. SKU：可能多个，折叠显示 -->
                                    <el-descriptions-item label="SKU:" label-width="80px" width="330px">
                                        <div v-if="item.skus && item.skus.length">
                                            <div v-for="(sku, i) in JSON.parse(item.skus)" :key="i" class="sku-item">{{
                                                sku.sku
                                                }} * {{ sku.qty }}</div>
                                        </div>
                                    </el-descriptions-item>
                                </el-descriptions>
                            </template>
                            <el-timeline class="timeline">
                                <el-timeline-item v-for="(item2, index2) in item.outTraceVOList" :key="index2"
                                    :timestamp="item2.traceTime" placement="top">
                                    <el-card>
                                        <p class="timelineTitle">{{ item2.traceLocation }}</p>
                                        <p class="timelineEvent">{{ item2.traceEvent }}</p>
                                        <p class="timelineRemark">备注:{{ item2.remark }}</p>
                                        <p class="timelineRemark">附件: <a :href="item.labelUrl" target="_blank"
                                                v-if="item.labelUrl">下载</a></p>
                                    </el-card>
                                </el-timeline-item>
                            </el-timeline>
                        </el-collapse-item>
                    </el-collapse>
                    <!-- <generalAddTable :defaultAddEmptyRow="false" :modelValue="false" :columns="trackColumns"
                        :data="trackData">
                        <template #customer="{ row }">
                            {{ row.customerCode }}({{ row.customerName }})
                        </template>
                        <template #height="{ row }">
                            {{ row.length }}/{{ row.width }}/{{ row.height }}
                        </template>
                        <template #finished="{ row }">
                            {{ row.isFinished ? '是' : '否' }}
                        </template>
                        <template #isDelivered="{ row }">
                            {{ row.isDelivered ? '是' : '否' }}
                        </template>
                    </generalAddTable> -->
                </el-tab-pane>
                <el-tab-pane label="拦截" name="拦截">
                    <generalAddTable :defaultAddEmptyRow="false" :modelValue="false" :columns="holdupColumns"
                        :data="holdupData">
                        <template #statusName="{ row }">
                            <span :style="{ color: row.holdUpStatus !== 2 ? 'green' : 'red' }">{{ row.holdUpStatusName
                                }}</span>
                        </template>
                        <template #customer="{ row }">
                            {{ row.customerCode }}({{ row.customerName }})
                        </template>
                    </generalAddTable>
                </el-tab-pane>
                <el-tab-pane label="问题" name="问题">
                    <generalAddTable :defaultAddEmptyRow="false" :modelValue="false" :columns="problemColumns"
                        :data="problemData">
                    </generalAddTable>
                </el-tab-pane>
            </el-tabs>

            <div class="btns">
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
            <skuSelectDialog v-model:visible="skuDialogVisible" :customerCode="formData.customerCode"
                @confirm="handleSkuConfirm" :disabled="true" />
            <addressSelectDialog v-model:visible="addressDialogVisible" @confirm="handleAddressConfirm"
                :customerCode="formData.customerCode" :disabled="true" />
        </div>
    </div>
</template>

<script setup name="出库单详情">
import { getProductShipwayTypeEnumApi, getProductShipwayListApi, getProductShipwayBrandListApi, getProductSupplierListApi } from '@/api/productApi/shipway.js'
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { getInstockInOrderBusinessEnumApi } from '@/api/instockApi/order.js';
import { getBasicConsumablesListEnumApi } from '@/api/baseApi/consumables.js'
import { getVasServiceTypeListApi, getVasServiceTypeUnitEnumApi } from '@/api/vasApi/vas.js'

import generalAddTable from '@/components/table/generalAddTable.vue'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { outstockOrderCreateTypeApi, outstockOrderAddressTypeApi, outstockOrderStatusApi, outstockOrderTypeApi, getOutstockOrderDetailApi, outstockOrderEcommercePlatformApi, outstockOrderAttachmentTypeApi, getOutstockOrderProblemApi, getOutstockOrderTrackApi, getOutstockOrderStatusApi, getOutstockOrderHoldupApi } from '@/api/outstockApi/order.js'
import { getLabel } from '@/utils/i18n/i18nLabels.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { uploadApi } from '@/api/baseApi/index.js'
import { getCustomerLikeQueryApi, getSkuSkuDataBySkuApi } from '@/api/baseApi/sku.js'
import { smartAlert } from '@/utils/genericMethods.js'
import skuSelectDialog from './skuSelectDialog.vue';
import addressSelectDialog from './addressSelectDialog.vue';
import { getOpLogApi } from '@/api/baseApi/index.js'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()

// 标签页
const activeName = ref('订单信息');
// 切换标签页
const handleTabClick = async (tab) => {
    const tabName = tab.paneName;
    switch (tabName) {
        case '状态节点':
            if (statusNodesData.value.length == 0) {
                const statusRes = await getOutstockOrderStatusApi({ outOrderId: poros.id });
                statusNodesData.value = statusRes.success ? statusRes.data : [];
            }
            break;
        case '日志':
            if (logData.value.length == 0) {
                const logRes = await getOpLogApi({ objId: poros.id });
                logData.value = logRes.success ? logRes.data : [];
            }
            break;
        case '拦截':
            if (holdupData.value.length == 0) {
                const holdupRes = await getOutstockOrderHoldupApi({ outOrderId: poros.id });
                holdupData.value = holdupRes.success ? holdupRes.data : [];
            }
            break;
        case '问题':
            if (problemData.value.length == 0) {
                const problemRes = await getOutstockOrderProblemApi({ outOrderId: poros.id });
                problemData.value = problemRes.success ? problemRes.data : [];
            }
            break;
        case '轨迹':
            if (problemData.value.length == 0) {
                const trackRes = await getOutstockOrderTrackApi({ outOrderId: poros.id });
                trackData.value = trackRes.success ? trackRes.data : [];
            }
            break;
        default:
            break;
    }
};

const poros = defineProps({
    id: {
        type: String,
        default: ''
    }
});

//默认展开 '1', '2', '4', '5', '6'
const activeNames = ref(['1', '2', '4', '5', '6'])

// 表单数据
const formRef = ref(null);
const formData = ref({
    customerCode: "",
    warehouseCode: "",
    customerOrderNo: "",
    ecPlatform: "",
    ecOrderNo: "",
    ecSaleAccount: "",
    typeId: '',
    businessId: null,
    apiId: "",
    apiTypeId: null,
    statusId: '',
    shipwayTypeId: "",
    shipwayCode: "",
    carrierCode: "",
    carrierServiceCode: "",
    insuranceCurrency: "",
    insurancePremium: null,
    skuQty: null,
    createWay: "1",
    remark: "",
    receiver: {},
    sender: {},
    skuList: [],
    fileList: [],
    waybillList: [],
    remarkList: []
});

// 关闭
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/outstock/order/outOrder/list' })
}



// ----------------------------------------------------sku相关----------------------------------------------------
// 失焦获取sku信息
async function onSkuBlur(row) {
    if (!formData.value.customerCode) {
        ElMessage.warning('请先选择客户代码');
        row.sku = '';
        return;
    }
    if (!row.sku) return
    try {
        const res = await getSkuSkuDataBySkuApi({
            customerCode: formData.value.customerCode,
            sku: row.sku
        })
        if (res.success && res.data) {
            row.name = res.data.nameCn
        } else {
            row.name = res.msg || 'SKU 无效，请重新输入'
        }
    } catch (e) {
        smartAlert(e.msg, false);
    }
}


// 已选择SKU列表
const selectSkuList = ref([]);
// 加载状态
const isSkuLoading = ref(false);
// 处理下拉框显示/隐藏事件
const handleSkuVisibleChange = (visible) => {
    // 当下拉框显示时执行逻辑
    if (visible) {
        isSkuLoading.value = true;
        setTimeout(() => {
            const rawSkuList = skuListTableRef.value.getTableData();
            // 不区分大小写去重：以小写sku为键，保留完整对象
            const skuMap = {};
            rawSkuList.forEach(item => {
                if (!item?.sku) return;
                // 将sku转换为小写作为去重判断
                const lowerSku = item.sku.toLowerCase();

                if (!skuMap[lowerSku]) {
                    skuMap[lowerSku] = item;
                }
            });
            const uniqueSkus = Object.values(skuMap);
            selectSkuList.value = uniqueSkus;
            isSkuLoading.value = false;
        }, 200);
    }
};

// 批量选择 SKU 弹窗相关
const skuDialogVisible = ref(false);
// 打开sku弹窗
function openSkuDialog() {
    if (!formData.value.customerCode) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    skuDialogVisible.value = true;
}
// 确定选择 SKU
async function handleSkuConfirm(selectedList) {
    // 若数组为空或无效，直接返回
    if (!selectedList || !Array.isArray(selectedList) || selectedList.length === 0) return;
    const loading = ElLoading.service({
        lock: true,
        target: ".contentDiv",
        text: 'Loading'
    })

    try {
        for (const sku of selectedList) {
            try {
                // 调用接口获取当前 SKU 的详情
                const res = await getSkuSkuDataBySkuApi({
                    customerCode: formData.value.customerCode,
                    sku: sku
                });
                const rowData = {
                    sku: sku, // SKU 字段值为当前遍历的字符串
                    name: res.success && res.data
                        ? res.data.nameCn
                        : (res.msg || 'SKU 无效，请重新输入')
                };

                // 调用表格组件方法新增行
                skuListTableRef.value.addOrReplaceRow(rowData, ['sku']);
            } catch (e) {
                // 单个 SKU 接口调用失败时的处理（不影响其他 SKU）
                console.error(`获取 SKU [${sku}] 信息失败`, e);
                smartAlert(`获取 SKU [${sku}] 信息失败: ${e.msg}`, false);
            }
        }
    } finally {
        loading.close();
        skuDialogVisible.value = false;
    }
}

// ----------------------------------------------------地址相关----------------------------------------------------
const addressDialogVisible = ref(false);
// 打开地址弹窗
function openAddressDialog(type) {
    if (!formData.value.customerCode) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    isReceiver.value = type;
    addressDialogVisible.value = true;
}
// 发件/收件
const isReceiver = ref(true);

// 确定选择地址
function handleAddressConfirm(selectedAddress) {
    if (isReceiver.value) {
        formData.value.receiver = { ...selectedAddress, addressType: selectedAddress.typeId };
    } else {
        formData.value.sender = { ...selectedAddress, addressType: selectedAddress.typeId };
    }

}


// ----------------------------------------------------------文件上传---------------------------------------------------
// 文件上传前校验
const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isLt5M) {
        ElMessage.error('图片大小不能超过5MB!');
        return false;
    }
    return true;
};

// 自定义上传处理
const handleUpload = async (options) => {
    const currentFile = options.file;
    if (!currentFile) return;

    const isDuplicate = formData.value.fileList.some(
        item => item.fileName === currentFile.name && item.size === currentFile.size
    );
    if (isDuplicate) {
        ElMessage.warning(`文件 "${currentFile.name}" 已上传，无需重复添加`);
        return;
    }

    try {
        const res = await uploadApi(currentFile, { path: 'temp' });

        if (res.success) {
            fileListTableRef.value.addOrReplaceRow({
                fileName: currentFile.name,
                url: res.data,
            }, ['fileName']);
        } else {
            fileListTableRef.value.addOrReplaceRow({
                fileName: res.msg || '上传失败，请重试',
                url: '',
            }, ['fileName']);
        }
    } catch (error) {
        fileListTableRef.value.addOrReplaceRow({
            fileName: '上传失败，请重试',
            url: '',
        }, ['fileName']);
        smartAlert(error.msg, false);
    }
};

// 运单URL行内上传处理
const handleLabelUrlUpload = async (options, row) => {
    const currentFile = options.file;
    if (!currentFile) return;

    const loading = ElLoading.service({
        lock: true,
        target: ".contentDiv",
        text: 'loading...'
    });

    try {
        const res = await uploadApi(currentFile, { path: 'temp' });

        if (res.success) {
            row.labelUrl = res.data;
        } else {
            ElMessage.error(`运单上传失败：${res.msg || '服务器异常'}`);
            row.labelUrl = '';
        }
    } catch (error) {
        ElMessage.error(`运单上传出错：${error.msg || '网络异常'}`);
        row.labelUrl = '';
    } finally {
        loading.close();
    }
};

//报关单URL行内上传处理
const handleCustomLabelUrlUpload = async (options, row) => {
    const currentFile = options.file;
    if (!currentFile) return;

    const loading = ElLoading.service({
        lock: true,
        text: 'loading...',
        target: ".contentDiv",
    });

    try {
        const res = await uploadApi(currentFile, { path: 'temp' });

        if (res.success) {
            row.customLabelUrl = res.data;
        } else {
            ElMessage.error(`报关单上传失败：${res.msg || '服务器异常'}`);
            row.customLabelUrl = '';
        }
    } catch (error) {
        ElMessage.error(`报关单上传出错：${error.msg || '网络异常'}`);
        row.customLabelUrl = '';
    } finally {
        loading.close();
    }
};


// 表格REF
const skuListTableRef = ref(null);
const fileListTableRef = ref(null);
const trackingNoListTableRef = ref(null);
const remarkListTableRef = ref(null);

// 表格列
const skuColumns = [
    { label: 'SKU', prop: 'sku', width: 335, slot: 'sku', required: true },
    { label: '品名', prop: 'name', width: 315 },
    { label: '品质', prop: 'qualityId', width: 250, slot: 'qualityId', required: true },
    { label: '数量', prop: 'qty', width: 250, slot: 'qty', required: true },
]
const filesColumns = [
    { label: '附件类型', prop: 'typeId', width: 240, slot: 'typeId' },
    { label: '附件名称', prop: 'fileName', width: 400, slot: 'fileName', required: true },
    { label: '附件地址', prop: 'fileUrl', width: 510, slot: 'fileUrl', required: true },
]
const remakeColumns = [
    { label: '备注', prop: 'remark', width: 1150, slot: 'remark' },
]
const logisticsColumns = [
    { label: '长/宽/高(CM)', prop: 'size', width: 180, slot: 'size', required: true },
    { label: '包裹重量(KG)', prop: 'weight', width: 130, slot: 'weight', required: true },
    { label: '跟踪单号、运单/报关单URL', prop: 'trackingNo', width: 220, slot: 'trackingNo' },
    // { label: '运单URL', prop: 'labelUrl', width: 180, slot: 'labelUrl' },
    // { label: '报关单URL', prop: 'customLabelUrl', width: 180, slot: 'customLabelUrl' },
    { label: 'SKU/数量', prop: 'skus', width: 320, slot: 'skus' },
    { label: '耗材/数量', prop: 'consumablesList', width: 305, slot: 'consumables' },
]
const serviceTableColumns = ref([
    { label: '服务类型', prop: 'serviceTypeId', required: true, slot: 'serviceTypeId', width: 150 },
    { label: '计划数量', prop: 'planQty', required: true, slot: 'planQty', width: 120 },
    { label: '单位', prop: 'unit', required: true, slot: 'unit', width: 100 },
    { label: 'SKU', prop: 'sku', slot: 'sku', width: 180 },
    { label: '附件', prop: 'attachments', slot: 'attachment', width: 240 },
    { label: '备注', prop: 'remark', slot: 'remark', width: 360 }
]);

// 状态节点表格数据
const statusNodesData = ref([]);
// 状态节点表格列
const statusNodesColumns = [
    // { label: '出库单号', prop: 'outOrderNo', width: 315 },
    // { label: '货主代码', prop: 'customerCode', width: 130 },
    // { label: '仓库代码', prop: 'warehouseCode', width: 120 },
    { label: '订单创建时间', prop: 'orderCreatedTime', width: 200 },
    { label: '订单更新时间', prop: 'orderUpdatedTime', width: 200 },
    { label: '操作类型名', prop: 'opTypeName', width: 130 },
    { label: '操作人账号', prop: 'opBy', width: 130 },
    { label: '操作发生时间', prop: 'opTime', width: 200 },
    { label: '状态', prop: 'statusName', width: 100 },
    { label: '出库重量(KG)', prop: 'outWeight', width: 150 },
    { label: '操作后订单数据', prop: 'orderData', width: 150 },
    { label: '推送次数', prop: 'sendCount', width: 100 },
    { label: '上次推送时间', prop: 'sendTime', width: 200 },
    { label: '推送成功时间', prop: 'succesTime', width: 200 },
    { label: '是否推送成功', prop: 'isSuccess', width: 140, slot: 'isSuccess' },
    { label: '是否停止推送', prop: 'isEnd', width: 140, slot: 'isEnd' },
    // { label: '创建人', prop: 'createdBy', width: 110 },
    // { label: '创建时间', prop: 'createdTime', width: 200 },
    // { label: '更新人', prop: 'updatedBy', width: 110 },
    // { label: '更新时间', prop: 'updatedTime', width: 200 },
]

// 日志表格数据
const logData = ref([]);
// 日志表格列
const logColumns = [

    { label: '操作类型', prop: 'opType', width: '125', },
    { label: '操作消息', prop: 'message', width: '650', slot: 'message' },
    { label: '操作结果', prop: 'isSuccess', width: '110', slot: 'isSuccess' },
    // { label: '用户代码', prop: 'userCode', width: '125', fixed: 'left' },
    { label: '操作时间', prop: 'createdTime', width: '200' },
    // { label: '登录端', prop: 'terminalName', width: '100', },
    // { label: 'IP地址', prop: 'ip_address', width: '150' },
    // { label: 'IP所在城市地址', prop: 'ip_location', width: '160' },
    { label: '操作人', prop: 'createdBy', width: '110' },
    // { label: '更新时间', prop: 'updatedTime', width: '200' },
    // { label: '更新人', prop: 'updatedBy', width: '110' },
]

// 拦截表格数据
const holdupData = ref([]);
// 拦截表格列
const holdupColumns = [
    // { label: '公司', prop: 'orgName', width: '130', fixed: 'left' },
    // { label: '仓库', prop: 'warehouseCode', width: '135', fixed: 'left' },
    // { label: '客户', prop: 'customerCode', width: '135', slot: 'customer', fixed: 'left' },
    // { label: '出库单号', prop: 'orderNo', width: '150', fixed: 'left' },
    // { label: '承运商代码', prop: 'shipwayCode', width: '150' }, // 可选字段，品牌代码
    { label: '状态', prop: 'beforeStatusName', width: '125' },
    { label: '状态', prop: 'statusName', width: '125', slot: 'statusName' },
    { label: '备注', prop: 'msg', width: '200' },
    { label: '创建人', prop: 'createdBy', width: '110' },
    { label: '创建时间', prop: 'createdTime', width: '200' },
    { label: '更新人', prop: 'updatedBy', width: '110' },
    { label: '更新时间', prop: 'updatedTime', width: '200' },
]

// 问题表格数据
const problemData = ref([]);
// 问题表格列
const problemColumns = [
    { label: '问题类型名', prop: 'typeName', width: 150 },
    { label: '问题描述', prop: 'msg', width: 300 },
    { label: '问题状态', prop: 'statusName', width: 120 },
    { label: '解决备注', prop: 'solveRemark', width: 200 },
    { label: '解决时间', prop: 'solveTime', width: 180 },
    { label: '解决人', prop: 'solveBy', width: 120 },
    { label: '创建人', prop: 'createdBy', width: 120 },
    { label: '创建时间', prop: 'createdTime', width: 200 },
    { label: '更新人', prop: 'updatedBy', width: 120 },
    { label: '更新时间', prop: 'updatedTime', width: 200 },
]
// 轨迹表格数据
const trackData = ref([]);
// 轨迹表格列
const trackColumns = [
    // { label: '公司', prop: 'orgName', width: 120 },
    // { label: '客户', prop: 'customerCode', slot: 'customer', width: 180 },
    // { label: '出库单号', prop: 'outOrderNo', width: 200 },
    // { label: '承运商代码', prop: 'carrierCode', width: 140 },
    // { label: '承运商服务代码', prop: 'carrierServiceCode', width: 170 },
    // { label: '目的国代码', prop: 'destCountryCode', width: 130 },
    { label: '是否完成', prop: 'finished', width: 120, slot: 'finished' },
    { label: '是否送达', prop: 'isDelivered', width: 120, slot: 'isDelivered' },
    { label: '送达时间', prop: 'deliveredTime', width: 200 },
    { label: '完成时间', prop: 'finishedTime', width: 200 },
    { label: '面单URL', prop: 'labelUrl', width: 250 },
    { label: '最后跟踪时间', prop: 'lastTrackTime', width: 200 },
    // { label: '长/宽/高(CM)', prop: 'length', width: 170, slot: 'height' },
    // { label: '重量(KG)', prop: 'weight', width: 120 },
    { label: '订单创建时间', prop: 'orderCreationTime', width: 200 },
    // { label: '销售用户代码', prop: 'salesUserCode', width: 150 },
    { label: '发货时间', prop: 'shippedTime', width: 200 },
    { label: '运输方式名称', prop: 'shipwayName', width: 150 },
    { label: 'SKU信息', prop: 'skus', width: 300 },
    // { label: '供应商渠道代码', prop: 'supplierChannelCode', width: 180 },
    // { label: '供应商名称', prop: 'supplierName', width: 150 },
    // { label: '供应商订单号', prop: 'supplierOrderNo', width: 200 },
    { label: '供应商请求内容', prop: 'supplierReqContent', width: 250 },
    { label: '供应商响应内容', prop: 'supplierRespContent', width: 250 },
    { label: '跟踪次数', prop: 'trackCount', width: 100 },
    { label: '跟踪结果', prop: 'trackResult', width: 250 },
    { label: '跟踪号', prop: 'trackingNo', width: 120 },
    { label: '创建人', prop: 'createdBy', width: 120 },
    { label: '创建时间', prop: 'createdTime', width: 200 },
    { label: '更新人', prop: 'updatedBy', width: 120 },
    { label: '更新时间', prop: 'updatedTime', width: 200 },
]


// 验证规则
const rules = {
    name: [
        { required: true, message: '请输入' + getLabel('receiverName'), trigger: 'blur' }
    ],
    phoneNumber1: [
        { required: true, message: '请输入' + getLabel('receiverPhoneNumber1'), trigger: 'blur' }
    ],
    countryCode: [
        { required: true, message: '请选择' + getLabel('countryCode'), trigger: 'change' }
    ],
    city: [
        { required: true, message: '请输入' + getLabel('city'), trigger: 'blur' }
    ],
    addressLine1: [
        { required: true, message: '请输入' + getLabel('addressLine1'), trigger: 'blur' }
    ],
    customerOrderNo: [
        { required: true, message: '请输入' + getLabel('customerOrderNo'), trigger: 'change' }
    ],
    businessId: [
        { required: true, message: '请选择' + getLabel('businessId'), trigger: 'change' }
    ],
    customerCode: [
        { required: true, message: '请选择' + getLabel('customerCode'), trigger: 'change' }
    ],
    warehouseCode: [
        { required: true, message: '请选择' + getLabel('warehouseCode'), trigger: 'change' }
    ],
    typeId: [
        { required: true, message: '请选择' + getLabel('typeId'), trigger: 'change' }
    ],
    statusId: [
        { required: true, message: '请选择' + getLabel('statusId'), trigger: 'change' }
    ]
};

// -------------------------------------------------包裹SKU和耗材相关-------------------------------------------------
// 添加当前物流单的SKU项
const addSku = (trackingNoRow) => {
    if (!trackingNoRow.skuList) {
        trackingNoRow.skuList = [];
    }

    trackingNoRow.skuList.push({
        sku: '',
        qty: null,
    });
};

// 删除当前物流单的指定SKU项
const delSku = (trackingNoRow, skuIndex) => {
    if (!trackingNoRow.skuList || trackingNoRow.skuList.length <= 1) {
        return;
    }
    trackingNoRow.skuList.splice(skuIndex, 1);
};

// 添加当前物流单的耗材项
const addConsumables = (trackingNoRow) => {
    if (!trackingNoRow.consumablesList) {
        trackingNoRow.consumablesList = [];
    }

    trackingNoRow.consumablesList.push({
        consumablesCode: '',
        quantity: null,
    });
};
// 删除当前物流单的指定耗材项
const delConsumables = (trackingNoRow, index) => {
    if (!trackingNoRow.consumablesList || trackingNoRow.consumablesList.length <= 1) {
        return;
    }
    trackingNoRow.consumablesList.splice(index, 1);
};

// 仓库下拉框数据（对应warehouseCode字段）
const warehouseOptions = ref([])
// 客户下拉框过滤后数据（对应customerCode字段）
const customerOptions = ref([])
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
// 服务类型下拉框数据（对应serviceTypeId字段）
const serviceTypeOptions = ref([])
// 单位下拉框数据（对应unit字段）
const unitOptions = ref([]);


// 电商平台下拉框数据（对应ecPlatform字段）
const ecPlatformOptions = ref([])
// 附件类型下拉框数据（对应fileList.typeId字段）
const fileTypeOptions = ref([])
// 耗材下拉框数据（对应consumablesList.consumablesCode字段）
const consumablesOptions = ref([])

onMounted(async () => {
    const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        target: ".contentDiv"
    });

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
                api: outstockOrderCreateTypeApi(),
                handleSuccess: (data) => (createWayOptions.value = data || []),
            },
            {
                key: "收件人地址类型",
                api: outstockOrderAddressTypeApi(),
                handleSuccess: (data) => (addressTypeOptions.value = data || []),
            },
            {
                key: "耗材类型",
                api: getBasicConsumablesListEnumApi(),
                handleSuccess: (data) => (consumablesOptions.value = data || []),
            },
            {
                key: "电商平台",
                api: outstockOrderEcommercePlatformApi(),
                handleSuccess: (data) => (ecPlatformOptions.value = data || []),
            },
            {
                key: "附件类型",
                api: outstockOrderAttachmentTypeApi(),
                handleSuccess: (data) => (fileTypeOptions.value = data || []),
            },
            {
                key: "服务类型",
                api: getVasServiceTypeListApi(),
                handleSuccess: (data) => (serviceTypeOptions.value = data || []),
            },
            {
                key: "单位",
                api: getVasServiceTypeUnitEnumApi(),
                handleSuccess: (data) => (unitOptions.value = data || []),
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

        //出库单详情处理
        if (poros.id) {
            const res = await getOutstockOrderDetailApi({ id: poros.id });
            if (res.success) {
                if (res.data.waybillList) {
                    res.data.waybillList.forEach((item) => {
                        if (item.skus?.length > 0) {
                            try {
                                item.skuList = JSON.parse(item.skus);
                            } catch (e) {
                                console.error('解析skus失败:', e);
                            }
                        }
                    });
                }

                if (res.data.skuList) {
                    for (const item of res.data.skuList) {
                        try {
                            const res2 = await getSkuSkuDataBySkuApi({
                                customerCode: res.data.customerCode,
                                sku: item.sku,
                            });
                            item.name = res2.success && res2.data
                                ? res2.data.nameCn
                                : (res2.msg || '未知品名');
                        } catch (e) {
                            console.error(`获取SKU [${item.sku}] 名称失败:`, e);
                            item.name = '获取失败'; // 异常处理，避免空值
                        }
                    }
                }
                // 处理增值服务表格数据（vasOrderItemList渲染到serviceTableRef）
                if (res.data.vasOrderItemList && Array.isArray(res.data.vasOrderItemList)) {
                    res.data.serviceTableData = res.data.vasOrderItemList.map(item => {
                        // 解析serviceAttachment JSON字符串为附件数组
                        let attachments = [];
                        if (item.serviceAttachment && typeof item.serviceAttachment === 'string') {
                            try {
                                attachments = JSON.parse(item.serviceAttachment);
                                // 确保解析后是数组
                                if (!Array.isArray(attachments)) {
                                    attachments = [];
                                }
                            } catch (e) {
                                console.error('解析serviceAttachment失败:', e);
                                attachments = [];
                            }
                        }

                        return {
                            ...item,
                            skuName: item.skuName || '',
                            serviceAttachment: item.serviceAttachment || '',
                            resultAttachment: item.resultAttachment || '',
                            // 适配表格的附件显示字段
                            attachments: attachments
                        };
                    });
                }
                nextTick(() => {
                    formData.value = { ...res.data };
                });

            } else {
                smartAlert(res.msg, false);
            }
        }
    } finally {
        loading.close();
    }
});

</script>

<style scoped lang="scss">
@use '@/assets/css/viewAreaForm.scss';

.title {
    display: inline-block;
    font-size: 22px;
    font-weight: bold;
}

.collapse-item-content {
    padding: 10px 18px 0;
}

// 添加flex容器样式
.flex-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 100px);
    padding-bottom: 0 !important;
    position: relative;
}

.btns {
    width: 100% !important;
    margin-top: auto;
    padding: 10px 0;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
}

:deep(.el-tabs) {
    height: 100%;
    overflow: hidden;
}

:deep(.el-tabs__content) {
    overflow-y: auto;
}

:deep(.el-tabs__content) {
    flex: 1;
}

:deep(.el-tabs__item) {
    font-size: 20px;
}

:deep(.el-tab-pane) {
    height: 100%;
}

h3 {
    font-size: 18px;
    margin: 5px 0;
}

.tableFormSlot {
    display: flex;
    margin: 4px 0;
}

:deep(.input-error-text .el-input__wrapper) {
    box-shadow: 0 0 0 1px #ff3a3a !important;
}

:deep(.input-error-text .el-input__inner) {
    color: #ff3a3a !important;
}

:deep(.el-form) {
    width: 1205px !important;
}

:deep(.el-collapse-item__header) {
    border-bottom: 1px solid #e4e7ed;
}

:deep(.el-input) {
    width: 100% !important;
}

:deep(.is-circle) {
    padding: 5px !important;
    width: 30px !important;
    height: 30px !important;
    margin-left: 5px !important;
}

:deep(.el-table__header-wrapper th) {
    background-color: white !important;
    font-weight: 400;
}

.el-collapse:has(> .trackItem) {
    /* 仅作用于直接包含 .trackItem 作为子元素的 el-collapse */
    --el-collapse-header-height: 180px;
}

.timeline {
    max-width: 800px;
    margin-top: 10px;

    .timelineTitle {
        font-weight: bold !important;
        font-size: 18px !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        // 超出一行省略号
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .timelineEvent {
        font-weight: bold !important;
        font-size: 14px !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .timelineRemark {
        font-weight: 300 !important;
        font-size: 14px !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
}

:deep(.el-card__body) {
    padding: 12px;
}

:deep(.el-collapse-item__content) {
    padding-bottom: 5px;
}

:deep(.el-timeline-item) {
    padding: 0;
}
</style>