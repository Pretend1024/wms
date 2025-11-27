<template>
    <div class="viewArea">
        <div class="contentDiv flex-container">
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
                                            :placeholder="getPlaceholder('customerCode')"
                                            popper-class="multi-column-select" clearable disabled>
                                            <el-option v-for="item in customerOptions" :key="item.value"
                                                :label="item.label" :value="item.value" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('warehouseCode')" prop="warehouseCode" required>
                                        <el-select v-model="formData.warehouseCode" filterable
                                            :placeholder="getPlaceholder('warehouseCode')" clearable>
                                            <el-option v-for="item in warehouseOptions" :key="item.code"
                                                :label="`${item.code}-${item.name}`" :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('customerOrderNo')" prop="customerOrderNo" required>
                                        <el-input v-model.trim="formData.customerOrderNo"
                                            :placeholder="getPlaceholder('customerOrderNo')" maxlength="100" readonly />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('typeId')" prop="typeId" required>
                                        <el-select v-model="formData.typeId" :placeholder="getPlaceholder('typeId')">
                                            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name"
                                                :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('ecPlatform')">
                                        <el-select v-model="formData.ecPlatform"
                                            :placeholder="getPlaceholder('ecPlatform')" clearable>
                                            <el-option v-for="item in ecPlatformOptions" :key="item.id"
                                                :label="item.name" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('ecOrderNo')">
                                        <el-input v-model.trim="formData.ecOrderNo"
                                            :placeholder="getPlaceholder('ecOrderNo')" maxlength="100" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('ecSaleAccount')">
                                        <el-input v-model.trim="formData.ecSaleAccount"
                                            :placeholder="getPlaceholder('ecSaleAccount')" maxlength="100" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('businessId')" prop="businessId">
                                        <el-select v-model="formData.businessId"
                                            :placeholder="getPlaceholder('businessId')" clearable>
                                            <el-option v-for="item in businessOptions" :key="item.id" :label="item.name"
                                                :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('shipwayTypeId')">
                                        <el-select v-model="formData.shipwayTypeId"
                                            :placeholder="getPlaceholder('shipwayTypeId')" clearable>
                                            <el-option v-for="item in shipwayTypeOptions" :key="item.id"
                                                :label="item.name" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('carrierCode')">
                                        <el-select v-model="formData.carrierCode"
                                            :placeholder="getPlaceholder('carrierCode')" clearable
                                            @change="selectChannel">
                                            <el-option v-for="item in carrierOptions" :key="item.id" :label="item.name"
                                                :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('shipwayCode')">
                                        <el-select v-model="formData.shipwayCode"
                                            :placeholder="getPlaceholder('shipwayCode')" clearable>
                                            <el-option v-for="item in shipwayOptions" :key="item.id" :label="item.name"
                                                :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('insuranceCurrency')">
                                        <el-select v-model="formData.insuranceCurrency"
                                            :placeholder="getPlaceholder('insuranceCurrency')" clearable>
                                            <el-option v-for="item in currencyOptions" :key="item.id" :label="item.name"
                                                :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('insurancePremium')">
                                        <el-input v-model="formData.insurancePremium"
                                            :placeholder="getPlaceholder('insurancePremium')" v-number />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="18">
                                    <el-form-item :label="getLabel('remark')">
                                        <el-input v-model.trim="formData.remark" :placeholder="getPlaceholder('remark')"
                                            type="textarea" rows="1" />
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
                                        <el-input v-model.trim="formData.receiver.name"
                                            :placeholder="getPlaceholder('receiverName')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('receiverCompany')">
                                        <el-input v-model.trim="formData.receiver.company"
                                            :placeholder="getPlaceholder('receiverCompany')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('receiverIdentityNumber')">
                                        <el-input v-model.trim="formData.receiver.identityNumber"
                                            :placeholder="getPlaceholder('receiverIdentityNumber')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('receiverPhoneNumber1')" prop="phoneNumber1">
                                        <el-input v-model.trim="formData.receiver.phoneNumber1"
                                            :placeholder="getPlaceholder('receiverPhoneNumber1')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('receiverPhoneNumber2')">
                                        <el-input v-model.trim="formData.receiver.phoneNumber2"
                                            :placeholder="getPlaceholder('receiverPhoneNumber2')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('receiverEmail')">
                                        <el-input v-model.trim="formData.receiver.email"
                                            :placeholder="getPlaceholder('receiverEmail')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('receiverAddressType')">
                                        <el-select v-model="formData.receiver.addressType"
                                            :placeholder="getPlaceholder('receiverAddressType')">
                                            <el-option v-for="item in addressTypeOptions" :key="item.id"
                                                :label="item.name" :value="item.id" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('countryCode')" prop="countryCode">
                                        <el-select v-model="formData.receiver.countryCode" value-key="id" filterable
                                            :placeholder="getPlaceholder('countryCode')">
                                            <el-option v-for="item in countryOptions" :key="item.id"
                                                :label="`${item.code}-${item.nameCn}-${item.nameEn}`"
                                                :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('province')">
                                        <el-input v-model="formData.receiver.province"
                                            :placeholder="getPlaceholder('province')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('city')" prop="city">
                                        <el-input v-model="formData.receiver.city"
                                            :placeholder="getPlaceholder('city')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('county')">
                                        <el-input v-model="formData.receiver.county"
                                            :placeholder="getPlaceholder('county')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item :label="getLabel('addressLine1')" prop="addressLine1">
                                        <el-input v-model="formData.receiver.addressLine1"
                                            :placeholder="getPlaceholder('addressLine1')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item :label="getLabel('addressLine2')">
                                        <el-input v-model="formData.receiver.addressLine2"
                                            :placeholder="getPlaceholder('addressLine2')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <div style="display: flex;">
                                        <el-form-item :label="getLabel('receiverIsFbaAddress')">
                                            <el-switch v-model="formData.receiver.isFbaAddress" inline-prompt
                                                active-text="是" inactive-text="否" :active-value="true"
                                                :inactive-value="false" />
                                        </el-form-item>
                                        <el-form-item :label="getLabel('receiverIsAvis')">
                                            <el-switch v-model="formData.receiver.isAvis" inline-prompt active-text="是"
                                                inactive-text="否" :active-value="true" :inactive-value="false" />
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <el-button @click="openAddressDialog(true)" type="primary" plain>{{
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
                                        <el-input v-model.trim="formData.sender.name"
                                            :placeholder="getPlaceholder('senderName')" />
                                    </el-form-item>
                                </el-col>
                                <!-- 公司名 -->
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderCompany')">
                                        <el-input v-model.trim="formData.sender.company"
                                            :placeholder="getPlaceholder('senderCompany')" />
                                    </el-form-item>
                                </el-col>
                                <!--证件号码 -->
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderIdentityNumber')">
                                        <el-input v-model.trim="formData.sender.identityNumber"
                                            :placeholder="getPlaceholder('senderIdentityNumber')" />
                                    </el-form-item>
                                </el-col>
                                <!-- 电话1 -->
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderPhone1')">
                                        <el-input v-model.trim="formData.sender.phoneNumber1"
                                            :placeholder="getPlaceholder('senderPhone1')" />
                                    </el-form-item>
                                </el-col>
                                <!-- 电话2 -->
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderPhone2')">
                                        <el-input v-model.trim="formData.sender.phoneNumber2"
                                            :placeholder="getPlaceholder('senderPhone2')" />
                                    </el-form-item>
                                </el-col>
                                <!-- 邮箱 -->
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderEmail')">
                                        <el-input v-model.trim="formData.sender.email"
                                            :placeholder="getPlaceholder('senderEmail')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('countryCode')">
                                        <el-select v-model="formData.sender.countryCode" value-key="id" filterable
                                            :placeholder="getPlaceholder('countryCode')">
                                            <el-option v-for="item in countryOptions" :key="item.id"
                                                :label="`${item.code}-${item.nameCn}-${item.nameEn}`"
                                                :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('province')">
                                        <el-input v-model="formData.sender.province"
                                            :placeholder="getPlaceholder('province')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('city')">
                                        <el-input v-model="formData.sender.city"
                                            :placeholder="getPlaceholder('city')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('county')">
                                        <el-input v-model="formData.sender.county"
                                            :placeholder="getPlaceholder('county')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="getLabel('addressLine1')">
                                        <el-input v-model="formData.sender.addressLine1"
                                            :placeholder="getPlaceholder('addressLine1')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item :label="getLabel('addressLine2')">
                                        <el-input v-model="formData.sender.addressLine2"
                                            :placeholder="getPlaceholder('addressLine2')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="1"></el-col>
                                <el-col :span="6">
                                    <el-button @click="openAddressDialog(false)" type="primary" plain>{{
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
                        <generalAddTable :summaryFields="['qty']" ref="skuListTableRef" :columns="skuColumns"
                            :data="formData.skuList">
                            <template #sku="{ row }">
                                <el-input v-model="row.sku" @blur="onSkuBlur(row)" placeholder="请输入SKU">
                                    <template #append>
                                        <el-button icon="More" @click="openSkuDialog()" />
                                    </template>
                                </el-input>
                            </template>
                            <template #qty="{ row }">
                                <el-input v-model="row.qty" placeholder="请输入数量" v-number />
                            </template>
                            <template #qualityId="{ row }">
                                <el-select v-model="row.qualityId" placeholder="请选择品质">
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
                        <generalAddTable ref="serviceTableRef" :columns="serviceTableColumns"
                            :data="formData.serviceTableData">
                            <template #serviceTypeId="{ row }">
                                <el-select v-model="row.serviceTypeId" placeholder="请选择服务类型" clearable filterable
                                    @change="(val) => onServiceTypeChange(row, val)">
                                    <el-option v-for="item in serviceTypeOptions" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </template>
                            <template #planQty="{ row }">
                                <el-input v-model.number="row.planQty" placeholder="请输入计划数量" v-number />
                            </template>
                            <template #unit="{ row }">
                                <el-select v-model="row.unit" placeholder="请选择单位" clearable filterable disabled>
                                    <el-option v-for="item in unitOptions" :key="item.name" :label="item.name"
                                        :value="item.name" />
                                </el-select>
                            </template>
                            <template #sku="{ row }">
                                <el-select style="width: 150px;" v-model="row.sku" placeholder="请选择SKU"
                                    @visible-change="handleSkuVisibleChange">
                                    <!-- 加载状态显示 -->
                                    <template v-if="isSkuLoading">
                                        <el-option disabled label="loading..." />
                                    </template>
                                    <!-- 正常选项列表 -->
                                    <template v-else>
                                        <el-option v-for="item in selectSkuList" :key="item.sku" :label="item.sku"
                                            :value="item.sku" />
                                    </template>
                                </el-select>
                            </template>
                            <!-- 合并后的附件列 -->
                            <template #attachment="{ row }">
                                <div class="attachment-container">
                                    <!-- 已上传附件列表 -->
                                    <div class="attachment-list" v-if="row.attachments && row.attachments.length > 0">
                                        <div v-for="(file, index) in row.attachments" :key="index"
                                            class="attachment-item">
                                            <a :href="file.url" target="_blank" class="file-link">
                                                {{ file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name }}
                                            </a>
                                        </div>
                                    </div>
                                    <!-- 上传按钮 -->
                                    <el-upload :auto-upload="true"
                                        :http-request="(params) => handleServiceUpload(params, row)" multiple
                                        :show-file-list="false" v-if="!row.attachments || row.attachments.length === 0">
                                        <el-button type="primary" size="small">上传附件</el-button>
                                    </el-upload>
                                </div>
                            </template>
                            <template #remark="{ row }">
                                <el-input v-model="row.remark" placeholder="请输入备注" type="textarea" />
                            </template>
                        </generalAddTable>
                    </div>
                </el-collapse-item>

                <el-collapse-item name="6">
                    <template #title>
                        <span class="title">6. {{ $t('logisticsPackage') }}</span>
                    </template>
                    <div class="collapse-item-content">
                        <generalAddTable ref="trackingNoListTableRef" :columns="logisticsColumns"
                            :data="formData.waybillList" :init-array-fields="['consumablesList', 'skuList']">
                            <template #size="{ row }">
                                <el-input style="width: 55px !important;" v-model="row.length" placeholder="请输入长"
                                    v-number />
                                <el-input style="width: 55px !important;" v-model="row.width" placeholder="请输入宽"
                                    v-number />
                                <el-input style="width: 55px !important;" v-model="row.height" placeholder="请输入高"
                                    v-number />
                            </template>
                            <template #weight="{ row }">
                                <el-input v-model="row.weight" placeholder="请输入重量" v-number />
                            </template>
                            <template #trackingNo="{ row }">
                                <div style="display: flex;flex-direction: column;gap: 3px;">
                                    <el-input v-model="row.trackingNo" placeholder="请输入跟踪单号" />
                                    <el-input v-model="row.labelUrl" placeholder="请输入运单URL">
                                        <template #append>
                                            <el-upload :auto-upload="true"
                                                :http-request="(options) => handleLabelUrlUpload(options, row)"
                                                :before-upload="beforeUpload" multiple :show-file-list="false"
                                                accept=".pdf">
                                                <el-button icon="Upload" />
                                            </el-upload>
                                        </template>
                                    </el-input>
                                    <el-input v-model="row.customLabelUrl" placeholder="请输入报关单URL">
                                        <template #append>
                                            <el-upload :auto-upload="true"
                                                :http-request="(options) => handleCustomLabelUrlUpload(options, row)"
                                                :before-upload="beforeUpload" multiple :show-file-list="false"
                                                accept=".pdf">
                                                <el-button icon="Upload" />
                                            </el-upload>
                                        </template>
                                    </el-input>
                                </div>
                            </template>

                            <!-- <template #labelUrl="{ row }">
                                <el-input v-model="row.labelUrl" placeholder="请输入运单URL">
                                    <template #append>
                                        <el-upload :auto-upload="true"
                                            :http-request="(options) => handleLabelUrlUpload(options, row)"
                                            :before-upload="beforeUpload" multiple :show-file-list="false">
                                            <el-button icon="Upload" />
                                        </el-upload>
                                    </template>
                                </el-input>
                            </template>

                            <template #customLabelUrl="{ row }">
                                <el-input v-model="row.customLabelUrl" placeholder="请输入报关单URL">
                                    <template #append>
                                        <el-upload :auto-upload="true"
                                            :http-request="(options) => handleCustomLabelUrlUpload(options, row)"
                                            :before-upload="beforeUpload" multiple :show-file-list="false">
                                            <el-button icon="Upload" />
                                        </el-upload>
                                    </template>
                                </el-input>
                            </template> -->
                            <template #skus="{ row }">
                                <div class="tableFormSlot" v-for="(sku, index) in row.skuList" :key="index">
                                    <el-select style="width: 110px;" v-model="sku.sku" placeholder="请选择SKU"
                                        @visible-change="handleSkuVisibleChange">
                                        <!-- 加载状态显示 -->
                                        <template v-if="isSkuLoading">
                                            <el-option disabled label="加载中..." />
                                        </template>
                                        <!-- 正常选项列表 -->
                                        <template v-else>
                                            <el-option v-for="item in selectSkuList" :key="item.sku" :label="item.sku"
                                                :value="item.sku" />
                                        </template>
                                    </el-select>
                                    <el-input style="width: 70px !important;margin: 0 4px;" v-model="sku.qty"
                                        placeholder="请输入数量" v-number />
                                    <el-button icon="Plus" type="success" circle @click="addSku(row)" />
                                    <el-button icon="Minus" type="danger" circle @click="delSku(row, index)" />
                                </div>
                            </template>
                            <template #consumables="{ row }">
                                <div class="tableFormSlot" v-for="(item, index) in row.consumablesList" :key="index">
                                    <el-select style="width: 120px;" v-model="item.consumablesCode" placeholder="请选择耗材">
                                        <el-option v-for="item in consumablesOptions" :key="item.code"
                                            :label="item.name" :value="item.code" />
                                    </el-select>
                                    <el-input style="width: 70px !important;margin: 0 4px;" v-model="item.quantity"
                                        placeholder="请输入数量" v-number />
                                    <el-button icon="Plus" type="success" circle @click="addConsumables(row)" />
                                    <el-button icon="Minus" type="danger" circle @click="delConsumables(row, index)" />
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
                        <generalAddTable ref="fileListTableRef" :columns="filesColumns" :data="formData.fileList">
                            <template #typeId="{ row }">
                                <el-select v-model="row.typeId" placeholder="请选择附件类型">
                                    <el-option v-for="item in fileTypeOptions" :key="item.id" :label="item.name"
                                        :value="item.id" />
                                </el-select>
                            </template>
                            <template #fileName="{ row }">
                                <!-- a标签在新页面打开 -->
                                <el-input v-model="row.fileName" v-if="row.url" />
                                <el-upload v-else :auto-upload="true" :http-request="handleUpload" multiple
                                    :show-file-list="false">
                                    <el-button type="primary">上传文件</el-button>
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
                        <generalAddTable ref="remarkListTableRef" :columns="remakeColumns" :data="formData.remarkList">
                            <template #remark="{ row }">
                                <el-input v-model="row.remark" placeholder="请输入备注" />
                            </template>
                        </generalAddTable>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <div class="btns">
                <!-- 保存和关闭 -->
                <el-button type="primary" @click="handleSave">{{ getButtonText('save') }}</el-button>
                <el-button @click="handleClose">{{ getButtonText('close') }}</el-button>
            </div>
            <skuSelectDialog v-model:visible="skuDialogVisible" :customerCode="formData.customerCode"
                @confirm="handleSkuConfirm" />
            <addressSelectDialog v-model:visible="addressDialogVisible" @confirm="handleAddressConfirm"
                :customerCode="formData.customerCode" />
        </div>
    </div>

</template>

<script setup name="编辑出库单">
import { getProductShipwayTypeEnumApi, getProductShipwayListApi, getProductShipwayBrandListApi, getProductSupplierListApi } from '@/api/productApi/shipway.js'
import { getCurrencyEnumApi } from '@/api/baseApi/index.js';
import { getOrderQualityEnumApi } from '@/api/instockApi/order.js'
import { getInstockInOrderBusinessEnumApi } from '@/api/instockApi/order.js';
import { getBasicConsumablesListEnumApi } from '@/api/baseApi/consumables.js'
import { getVasServiceTypeListApi, getVasServiceTypeUnitEnumApi } from '@/api/vasApi/vas.js'

import generalAddTable from '@/components/table/generalAddTable.vue'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { updOutstockOrderApi, outstockOrderCreateTypeApi, outstockOrderAddressTypeApi, outstockOrderStatusApi, outstockOrderTypeApi, getOutstockOrderDetailApi, outstockOrderEcommercePlatformApi, outstockOrderAttachmentTypeApi } from '@/api/outstockApi/order.js'
import { getLabel } from '@/utils/i18n/i18nLabels.js';
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { uploadApi } from '@/api/baseApi/index.js'
import { getCustomerLikeQueryApi, getSkuSkuDataBySkuApi } from '@/api/baseApi/sku.js'
import { smartAlert } from '@/utils/genericMethods.js'
import skuSelectDialog from './skuSelectDialog.vue';
import addressSelectDialog from './addressSelectDialog.vue';
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
const route = useRoute()
import tagsStore from '@/store/tags.js'
let useTagsStore = tagsStore()
import { useRefreshStore } from '@/store/refresh.js'
import { nextTick } from 'vue';
const refreshStore = useRefreshStore()

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
    remarkList: [],
    serviceTableData: [],
});

// 保存
const handleSave = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {
            // -------------------SKU数量验证 -------------------
            // 1. 获取skuListTable中的SKU及总数量
            const skuTableData = skuListTableRef.value.getTableData() || [];
            const skuQtyMap1 = {}; // 格式: { sku: 总数量 }
            skuTableData.forEach(item => {
                if (!item.sku) return; // 跳过空SKU
                const sku = item.sku.toLowerCase(); // 统一转为小写避免大小写问题
                const qty = Number(item.qty) || 0;
                skuQtyMap1[sku] = (skuQtyMap1[sku] || 0) + qty;
            });

            // 2. 获取trackingNoListTable中的SKU及总数量
            const trackingTableData = trackingNoListTableRef.value.getTableData() || [];
            const skuQtyMap2 = {};
            trackingTableData.forEach(trackingItem => {
                // 遍历每个物流单中的skuList
                const trackingSkus = trackingItem.skuList || [];
                trackingSkus.forEach(skuItem => {
                    if (!skuItem.sku) return;
                    const sku = skuItem.sku.toLowerCase();
                    const qty = Number(skuItem.qty) || 0;
                    skuQtyMap2[sku] = (skuQtyMap2[sku] || 0) + qty;
                });
            });

            // 3. 比较两个Map中的SKU数量
            let isQtyMatch = true;
            const allSkus = new Set([...Object.keys(skuQtyMap1), ...Object.keys(skuQtyMap2)]);

            allSkus.forEach(sku => {
                const qty1 = skuQtyMap1[sku] || 0;
                const qty2 = skuQtyMap2[sku] || 0;
                if (qty1 !== qty2) {
                    isQtyMatch = false;
                }
            });

            // 4. 数量不匹配时提示并终止提交
            if (!isQtyMatch) {
                smartAlert('SKU数量不匹配，请检查SKU数量是否正确', false);
                return;
            }
            // 定义表格检查配置
            const tableConfigs = [
                { tableRef: skuListTableRef, fieldName: 'skuList', checkProp: 'sku' },
                { tableRef: fileListTableRef, fieldName: 'fileList', checkProp: 'fileName' },
                { tableRef: trackingNoListTableRef, fieldName: 'waybillList', checkProp: 'weight' },
                { tableRef: remarkListTableRef, fieldName: 'remarkList', checkProp: 'remark' },
            ];
            // 处理表单数据
            const data = { ...formData.value };
            tableConfigs.forEach(({ tableRef, fieldName, checkProp }) => {
                const tableData = tableRef.value.getTableData();
                // 获取checkProp对应的字段值（这里默认取表格数据的第一条记录，可根据实际场景调整）
                const checkValue = tableData.length > 0 ? tableData[0][checkProp] : null;
                if (checkValue) {
                    data[fieldName] = tableData;
                } else {
                    delete data[fieldName];
                }
            });
            // ---------------------- 新增：处理增值服务表格数据 ----------------------
            const vasItemTableDataLocal = serviceTableRef.value.getTableData() || [];
            if (vasItemTableDataLocal.length > 0) {
                console.log('增值服务表格数据不为空');
                // 格式化增值服务数据为接口要求的vasOrderItemlist格式
                if (vasItemTableDataLocal[0].serviceTypeId) {
                    data.vasOrderItemList = vasItemTableDataLocal.map(item => {
                        const attachments = item.attachments && Array.isArray(item.attachments) ? item.attachments : null;
                        return {
                            ...item,
                            serviceAttachment: attachments ? JSON.stringify(attachments) : null, // 附件JSON字符串
                        };
                    });
                } else {
                    data.vasOrderItemList = null
                }

            }
            // ----------------------------------------------------------------------
            if (data.waybillList) {
                if (data.waybillList.length == 1) {
                    // 遍历data.skuList，将sku和qty赋值给data.waybillList[0].skuList
                    data.waybillList[0].skuList = data.skuList.map(item => ({ sku: item.sku, qty: item.qty }));
                }
                data.waybillList.forEach(item => {
                    if (item.skuList && item.skuList.length > 0) {
                        item.skus = JSON.stringify(item.skuList);
                    }
                })
            }
            //提交数据
            const res = await updOutstockOrderApi(data);
            smartAlert(res.msg, res.success, 1000);

            if (res.success) {
                refreshStore.shouldRefreshOutOrderList = true;
                useTagsStore.tagsStore = useTagsStore.tagsStore.filter(
                    item => item.path !== route.fullPath
                );
                router.push('/outstock/order/outOrder/list');
            }
        } else {
            console.log('Form validation failed.');
        }
    });
};
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
    // 校验是否为PDF文件（结合MIME类型和文件名后缀，更严谨）
    const isPdf =
        file.type === 'application/pdf' ||  // 校验MIME类型
        file.name.toLowerCase().endsWith('.pdf');  // 校验文件名后缀（忽略大小写）

    if (!isPdf) {
        smartAlert('请上传PDF格式的文件!', false);
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
// 增值服务上传
const handleServiceUpload = async (params, row) => {
    const file = params.file;
    try {
        if (!row.attachments || !Array.isArray(row.attachments)) {
            row.attachments = [];
        }

        const isDuplicate = row.attachments.some(att => att.name === file.name && att.size === file.size);
        if (isDuplicate) {
            ElMessage.warning(`文件 "${file.name}" 已上传，无需重复添加`);
            params.onSuccess && params.onSuccess();
            return;
        }

        const res = await uploadApi(file, { path: 'temp' });

        if (res.success && res.data) {
            row.attachments.push({
                name: file.name,
                url: res.data,
                size: file.size
            });
            ElMessage({
                message: 'Success',
                type: 'success',
            })
            params.onSuccess && params.onSuccess();
        } else {
            ElNotification.error({ title: '失败', message: res.msg || '文件上传失败' });
            params.onError && params.onError();
        }
    } catch (error) {
        console.error('文件上传失败：', error);
        ElNotification.error({ title: '失败', message: '文件上传失败，请重试' });
        params.onError && params.onError();
    }
};
//报关单URL行内上传处理
const handleCustomLabelUrlUpload = async (options, row) => {
    const currentFile = options.file;
    if (!currentFile) return;

    const loading = ElLoading.service({
        lock: true,
        text: 'loading...'
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
// ----------------------------------------------------------增值服务
const onServiceTypeChange = (row, val) => {
    if (!val) {
        row.unit = '';
        return;
    }
    const selected = serviceTypeOptions.value.find(item => item.id === val);
    if (selected) {
        const defaultUnit = selected.defaultUnit ?? selected.default_unit ?? selected.unit ?? '';
        if (defaultUnit) row.unit = defaultUnit;
    }
};

// 表格REF
const skuListTableRef = ref(null);
const fileListTableRef = ref(null);
const trackingNoListTableRef = ref(null);
const remarkListTableRef = ref(null);
const serviceTableRef = ref(null);
// 表格列
const skuColumns = [
    { label: 'SKU', prop: 'sku', width: 285, slot: 'sku', required: true },
    { label: '品名', prop: 'name', width: 255 },
    { label: '品质', prop: 'qualityId', width: 250, slot: 'qualityId', required: true },
    { label: '数量', prop: 'qty', width: 250, slot: 'qty', required: true },
]
const filesColumns = [
    { label: '附件类型', prop: 'typeId', width: 240, slot: 'typeId' },
    { label: '附件名称', prop: 'fileName', width: 350, slot: 'fileName', required: true },
    { label: '附件地址', prop: 'fileUrl', width: 450, slot: 'fileUrl', required: true },
]
const remakeColumns = [
    { label: '备注', prop: 'remark', width: 1040, slot: 'remark' },
]
const logisticsColumns = [
    { label: '长/宽/高(CM)', prop: 'size', width: 180, slot: 'size', required: true },
    { label: '包裹重量(KG)', prop: 'weight', width: 130, slot: 'weight', required: true },
    { label: '跟踪单号、运单/报关单URL', prop: 'trackingNo', width: 220, slot: 'trackingNo' },
    // { label: '运单URL', prop: 'labelUrl', width: 180, slot: 'labelUrl' },
    // { label: '报关单URL', prop: 'customLabelUrl', width: 180, slot: 'customLabelUrl' },
    { label: 'SKU/数量', prop: 'skus', width: 260, slot: 'skus', required: true },
    { label: '耗材/数量', prop: 'consumablesList', width: 255, slot: 'consumables' },
]
const serviceTableColumns = ref([
    { label: '服务类型', prop: 'serviceTypeId', required: true, slot: 'serviceTypeId', width: 150 },
    { label: '计划数量', prop: 'planQty', required: true, slot: 'planQty', width: 120 },
    { label: '单位', prop: 'unit', required: true, slot: 'unit', width: 100 },
    { label: 'SKU', prop: 'sku', slot: 'sku', width: 180 },
    { label: '附件', prop: 'attachments', slot: 'attachment', width: 150 },
    { label: '备注', prop: 'remark', slot: 'remark', width: 340 }
]);


// 验证规则
const rules = {
    name: [
        { required: true, message: '请输入' + getLabel('receiverName'), trigger: 'change' }
    ],
    phoneNumber1: [
        { required: true, message: '请输入' + getLabel('receiverPhoneNumber1'), trigger: 'change' }
    ],
    countryCode: [
        { required: true, message: '请选择' + getLabel('countryCode'), trigger: 'change' }
    ],
    city: [
        { required: true, message: '请输入' + getLabel('city'), trigger: 'change' }
    ],
    addressLine1: [
        { required: true, message: '请输入' + getLabel('addressLine1'), trigger: 'change' }
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
// 筛选物流产品
const selectChannel = async () => {
    const productRes = await getProductShipwayListApi({
        carrierCode: formData.value.carrierCode,
    })
    shipwayOptions.value = productRes.data
}


onMounted(async () => {
    const loading = ElLoading.service({
        lock: true,
        text: "Loading",
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
                            serviceAttachment: item.serviceAttachment || null,
                            resultAttachment: item.resultAttachment || null,
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
}

// 修改按钮区域样式
.btns {
    width: 100% !important;
    margin-top: auto;
    padding: 10px 0;
    position: sticky;
    bottom: 0;
    background-color: #fff;
    z-index: 99;
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
</style>