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
                                            popper-class="multi-column-select" clearable>
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
                                            :placeholder="getPlaceholder('customerOrderNo')" maxlength="100">
                                            <template #append>
                                                <el-button @click="getOrderNo">生成</el-button>
                                            </template>
                                        </el-input>
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
                                            @change="selectChannel" filterable>
                                            <el-option v-for="item in carrierOptions" :key="item.id" :label="item.name"
                                                :value="item.code" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('shipwayCode')">
                                        <el-select v-model="formData.shipwayCode"
                                            :placeholder="getPlaceholder('shipwayCode')" clearable filterable>
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
                                                :value="item.id" />
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
                                <el-col :span="7">
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
                                    <el-button @click="openAddressDialog(true)" type="primary" plain>
                                        {{ getButtonText('addressBook') }}
                                    </el-button>
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
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderName')">
                                        <el-input v-model.trim="formData.sender.name"
                                            :placeholder="getPlaceholder('senderName')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderCompany')">
                                        <el-input v-model.trim="formData.sender.company"
                                            :placeholder="getPlaceholder('senderCompany')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderIdentityNumber')">
                                        <el-input v-model.trim="formData.sender.identityNumber"
                                            :placeholder="getPlaceholder('senderIdentityNumber')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderPhone1')">
                                        <el-input v-model.trim="formData.sender.phoneNumber1"
                                            :placeholder="getPlaceholder('senderPhone1')" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="getLabel('senderPhone2')">
                                        <el-input v-model.trim="formData.sender.phoneNumber2"
                                            :placeholder="getPlaceholder('senderPhone2')" />
                                    </el-form-item>
                                </el-col>
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
                                <el-col :span="6">
                                    <el-button @click="openAddressDialog(false)" type="primary" plain>
                                        {{ getButtonText('addressBook') }}
                                    </el-button>
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
                                <el-input v-model="row.qty" placeholder="请输入数量" v-intNumber />
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
                                <el-input v-model="row.planQty" placeholder="请输入计划数量" v-intNumber />
                            </template>
                            <template #unit="{ row }">
                                <el-select v-model="row.unit" placeholder="请选择单位" clearable filterable disabled>
                                    <el-option v-for="item in unitOptions" :key="item.name" :label="item.name"
                                        :value="item.name" />
                                </el-select>
                            </template>
                            <template #sku="{ row }">
                                <el-select style="width: 150px;" v-model="row.sku" placeholder="请选择SKU"
                                    @visible-change="handleSkuVisibleChange" filterable>
                                    <template v-if="isSkuLoading">
                                        <el-option disabled label="loading..." />
                                    </template>
                                    <template v-else>
                                        <el-option v-for="item in selectSkuList" :key="item.sku" :label="item.sku"
                                            :value="item.sku" />
                                    </template>
                                </el-select>
                            </template>
                            <template #attachment="{ row }">
                                <div class="attachment-container">
                                    <div class="attachment-list" v-if="row.attachments && row.attachments.length > 0">
                                        <div v-for="(file, index) in row.attachments" :key="index"
                                            class="attachment-item">
                                            <a :href="file.url" target="_blank" class="file-link">{{ file.name }}</a>
                                        </div>
                                    </div>
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
                                    <el-input v-model="row.returnNo" placeholder="退货单号" />
                                    <el-input v-model="row.returnLabelUrl" placeholder="请输入退货运单URL">
                                        <template #append>
                                            <el-upload :auto-upload="true"
                                                :http-request="(options) => handleReturnLabelUrlUpload(options, row)"
                                                :before-upload="beforeUpload" multiple :show-file-list="false"
                                                accept=".pdf">
                                                <el-button icon="Upload" />
                                            </el-upload>
                                        </template>
                                    </el-input>
                                </div>
                            </template>
                            <template #skus="{ row }">
                                <div class="tableFormSlot" v-for="(sku, index) in row.skuList" :key="index">
                                    <el-select style="width: 110px;" v-model="sku.sku" placeholder="请选择SKU"
                                        @visible-change="handleSkuVisibleChange" filterable>
                                        <template v-if="isSkuLoading">
                                            <el-option disabled label="loading..." />
                                        </template>
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

<script setup name="新增出库单">
// ================== 1. 导入依赖 ==================
// API 导入
import { getProductShipwayTypeEnumApi, getProductShipwayListApi, getProductShipwayBrandListApi, getProductSupplierListApi } from '@/api/productApi/shipway.js'
import { getCurrencyListApi, uploadApi } from '@/api/baseApi/index.js';
import { getOrderQualityEnumApi, getInstockInOrderBusinessEnumApi } from '@/api/instockApi/order.js'
import { getBasicConsumablesListEnumApi } from '@/api/baseApi/consumables.js'
import { getVasServiceTypeListApi, getVasServiceTypeUnitEnumApi } from '@/api/vasApi/vas.js'
import { getOrgCountryListApi } from '@/api/baseApi/org.js';
import { addOutstockOrderApi, outstockOrderCreateTypeApi, outstockOrderAddressTypeApi, outstockOrderStatusApi, outstockOrderTypeApi, outstockOrderEcommercePlatformApi, getGenerateCustomerOrderNoApi, outstockOrderAttachmentTypeApi } from '@/api/outstockApi/order.js'
import { getWhWarehouseApi } from '@/api/baseApi/wh.js'
import { getCustomerLikeQueryApi, getSkuSkuDataBySkuApi } from '@/api/baseApi/sku.js'

// 组件与工具导入
import generalAddTable from '@/components/table/generalAddTable.vue'
import { getLabel } from '@/utils/i18n/i18nLabels.js';
import { smartAlert } from '@/utils/genericMethods.js'
import skuSelectDialog from './skuSelectDialog.vue';
import addressSelectDialog from './addressSelectDialog.vue';
import { validateTableHelper, fieldCustomCheck } from './utils'
import { useRoute } from 'vue-router';
import router from '@/router/index.js'
import { ElMessage, ElLoading } from 'element-plus';

// Store 导入
import tagsStore from '@/store/tags.js'
import { useRefreshStore } from '@/store/refresh.js'

// ================== 2. 状态定义 ==================
const route = useRoute()
let useTagsStore = tagsStore()
const refreshStore = useRefreshStore()

// 折叠面板默认展开项
const activeNames = ref(['1', '2', '4', '5', '6'])

// 表单引用与数据
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

// 下拉框选项数据
const warehouseOptions = ref([])
const customerOptions = ref([])
const countryOptions = ref([])
const businessOptions = ref([])
const shipwayTypeOptions = ref([])
const shipwayOptions = ref([])
const carrierOptions = ref([])
const createWayOptions = ref([])
const addressTypeOptions = ref([])
const typeOptions = ref([])
const statusOptions = ref([])
const currencyOptions = ref([])
const qualityOptions = ref([])
const supplierOptions = ref([])
const serviceTypeOptions = ref([])
const unitOptions = ref([]);
const ecPlatformOptions = ref([])
const fileTypeOptions = ref([])
const consumablesOptions = ref([])

// 表格 Ref
const skuListTableRef = ref(null);
const fileListTableRef = ref(null);
const trackingNoListTableRef = ref(null);
const remarkListTableRef = ref(null);
const serviceTableRef = ref(null);

// ================== 3. 表格列定义与验证规则 ==================

// SKU表格列
const skuColumns = [
    { label: 'SKU', prop: 'sku', width: 285, slot: 'sku', required: true },
    { label: '品名', prop: 'name', width: 255 },
    { label: '品质', prop: 'qualityId', width: 250, slot: 'qualityId', required: true },
    { label: '数量', prop: 'qty', width: 250, slot: 'qty', required: true },
]
// 附件表格列
const filesColumns = [
    { label: '附件类型', prop: 'typeId', width: 240, slot: 'typeId', required: true },
    { label: '附件名称', prop: 'fileName', width: 350, slot: 'fileName', required: true },
    { label: '附件地址', prop: 'fileUrl', width: 450, slot: 'fileUrl' },
]
// 备注表格列
const remakeColumns = [
    { label: '备注', prop: 'remark', width: 1040, slot: 'remark' },
]
// 物流包裹表格列
const logisticsColumns = [
    { label: '长/宽/高(CM)', prop: 'size', width: 180, slot: 'size', required: true },
    { label: '包裹重量(KG)', prop: 'weight', width: 130, slot: 'weight', required: true },
    { label: '跟踪单号、运单/报关单URL', prop: 'trackingNo', width: 220, slot: 'trackingNo' },
    { label: 'SKU/数量', prop: 'skus', width: 260, slot: 'skus', required: true },
    { label: '耗材/数量', prop: 'consumablesList', width: 255, slot: 'consumables' },
]
// 任务与增值服务表格列
const serviceTableColumns = ref([
    { label: '服务类型', prop: 'serviceTypeId', required: true, slot: 'serviceTypeId', width: 150 },
    { label: '计划数量', prop: 'planQty', required: true, slot: 'planQty', width: 120 },
    { label: '单位', prop: 'unit', required: true, slot: 'unit', width: 100 },
    { label: 'SKU', prop: 'sku', slot: 'sku', width: 180 },
    { label: '附件', prop: 'attachments', slot: 'attachment', width: 150, },
    { label: '备注', prop: 'remark', slot: 'remark', width: 340 }
]);

// 表单验证规则
const rules = {
    name: [{ required: true, message: '请输入' + getLabel('receiverName'), trigger: 'change' }],
    phoneNumber1: [{ required: true, message: '请输入' + getLabel('receiverPhoneNumber1'), trigger: 'change' }],
    countryCode: [{ required: true, message: '请选择' + getLabel('countryCode'), trigger: 'change' }],
    city: [{ required: true, message: '请输入' + getLabel('city'), trigger: 'change' }],
    addressLine1: [{ required: true, message: '请输入' + getLabel('addressLine1'), trigger: 'change' }],
    customerOrderNo: [{ required: true, message: '请输入' + getLabel('customerOrderNo'), trigger: 'change' }],
    businessId: [{ required: true, message: '请选择' + getLabel('businessId'), trigger: 'change' }],
    customerCode: [{ required: true, message: '请选择' + getLabel('customerCode'), trigger: 'change' }],
    warehouseCode: [{ required: true, message: '请选择' + getLabel('warehouseCode'), trigger: 'change' }],
    typeId: [{ required: true, message: '请选择' + getLabel('typeId'), trigger: 'change' }],
    statusId: [{ required: true, message: '请选择' + getLabel('statusId'), trigger: 'change' }]
};

// ================== 4. 核心逻辑 (保存/关闭) ==================

// 保存处理
const handleSave = async () => {
    await formRef.value.validate(async (valid) => {
        if (valid) {

            // ---------------------------------------------------------
            // 1. 表格数据校验与获取
            // ---------------------------------------------------------

            // 1.1 商品信息 (SKU列表)
            const skuCheck = validateTableHelper(skuListTableRef, skuColumns, '商品信息');
            if (!skuCheck.success) return;

            // 1.2 任务与增值服务
            const serviceCheck = validateTableHelper(serviceTableRef, serviceTableColumns.value, '任务与增值服务');
            if (!serviceCheck.success) return;

            // 1.3 物流包裹 (需要传入特殊字段校验逻辑 fieldCustomCheck)
            const logisticsCheck = validateTableHelper(trackingNoListTableRef, logisticsColumns, '物流包裹', fieldCustomCheck);
            if (!logisticsCheck.success) return;

            // 1.4 附件列表
            const fileCheck = validateTableHelper(fileListTableRef, filesColumns, '附件');
            if (!fileCheck.success) return;

            // 1.5 备注列表
            const remarkCheck = validateTableHelper(remarkListTableRef, remakeColumns, '备注');
            if (!remarkCheck.success) return;

            // ---------------------------------------------------------
            // 2. SKU总数一致性校验 (产品列表 vs 物流包裹列表)
            // ---------------------------------------------------------

            const skuQtyMap1 = {};
            skuCheck.data.forEach(item => {
                if (!item.sku) return;
                const sku = item.sku.toLowerCase();
                const qty = Number(item.qty) || 0;
                skuQtyMap1[sku] = (skuQtyMap1[sku] || 0) + qty;
            });

            const skuQtyMap2 = {};
            logisticsCheck.data.forEach(trackingItem => {
                const trackingSkus = trackingItem.skuList || [];
                trackingSkus.forEach(skuItem => {
                    if (!skuItem.sku) return;
                    const sku = skuItem.sku.toLowerCase();
                    const qty = Number(skuItem.qty) || 0;
                    skuQtyMap2[sku] = (skuQtyMap2[sku] || 0) + qty;
                });
            });

            // 假设如果填了包裹信息，包裹内的SKU总数必须等于商品信息的SKU总数
            if (skuCheck.data.length > 0 && logisticsCheck.data.length > 0) {
                let isQtyMatch = true;
                const allSkus = new Set([...Object.keys(skuQtyMap1), ...Object.keys(skuQtyMap2)]);
                allSkus.forEach(sku => {
                    const qty1 = skuQtyMap1[sku] || 0;
                    const qty2 = skuQtyMap2[sku] || 0;
                    if (qty1 !== qty2) isQtyMatch = false;
                });

                if (!isQtyMatch) {
                    smartAlert('商品信息中的SKU总数量与物流包裹中的SKU总数量不匹配，请检查', false);
                    return;
                }
            }

            // ---------------------------------------------------------
            // 3. 数据组装
            // ---------------------------------------------------------

            const data = { ...formData.value };

            // 赋值经过校验的干净数据
            data.skuList = skuCheck.data;
            data.fileList = fileCheck.data;
            data.waybillList = logisticsCheck.data;
            data.remarkList = remarkCheck.data;

            // 特殊处理：任务与增值服务 (转换附件格式)
            if (serviceCheck.data.length > 0) {
                data.vasOrderItemList = serviceCheck.data.map(item => {
                    const attachments = Array.isArray(item.attachments) && item.attachments.length > 0 ? item.attachments : null;
                    return {
                        ...item,
                        serviceAttachment: attachments ? JSON.stringify(attachments) : null,
                        resultAttachment: item.resultAttachment || null
                    };
                });
            } else {
                data.vasOrderItemList = [];
            }

            // 特殊处理：物流包裹 (转换SKU列表格式)
            if (data.waybillList && data.waybillList.length > 0) {
                // 如果只有一个包裹且没有手动分配SKU，自动将总SKU列表填入 (智能辅助)
                if (data.waybillList.length === 1 && (!data.waybillList[0].skuList || data.waybillList[0].skuList.length === 0)) {
                    data.waybillList[0].skuList = data.skuList.map(item => ({ sku: item.sku, qty: item.qty }));
                }

                // 序列化 skus 字段供后端使用
                data.waybillList.forEach(item => {
                    if (item.skuList && item.skuList.length > 0) {
                        item.skus = JSON.stringify(item.skuList);
                    }
                });
            }

            // 清理空对象
            if (data.sender && typeof data.sender === 'object' && Object.keys(data.sender).length === 0) {
                data.sender = null;
            }

            // ---------------------------------------------------------
            // 4. 提交接口
            // ---------------------------------------------------------

            try {
                const res = await addOutstockOrderApi(data);
                smartAlert(res.msg, res.success, 1000);

                if (res.success) {
                    refreshStore.shouldRefreshOutOrderList = true;
                    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(
                        item => item.path !== route.fullPath
                    );
                    router.push('/outstock/order/outOrder/list');
                }
            } catch (error) {
                console.error(error);
                smartAlert('保存失败，请重试', false);
            }

        } else {
            // 表单基础校验失败
            console.log('Form validation failed.');
            ElMessage.error('请检查基本信息必填项');
        }
    });
};

// 关闭页面
const handleClose = () => {
    // 在标签页中删除当前页
    useTagsStore.tagsStore = useTagsStore.tagsStore.filter(item => item.path !== route.fullPath)
    router.push({ path: '/outstock/order/outOrder/list' })
}

// ================== 5. SKU 相关逻辑 ==================

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

// 已选择SKU列表 (用于下拉去重显示)
const selectSkuList = ref([]);
const isSkuLoading = ref(false);

// 处理SKU下拉框显示/隐藏事件 (去重逻辑)
const handleSkuVisibleChange = (visible) => {
    if (visible) {
        isSkuLoading.value = true;
        setTimeout(() => {
            const rawSkuList = skuListTableRef.value.getTableData();
            // 不区分大小写去重：以小写sku为键，保留完整对象
            const skuMap = {};
            rawSkuList.forEach(item => {
                if (!item?.sku) return;
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
function openSkuDialog() {
    if (!formData.value.customerCode) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    skuDialogVisible.value = true;
}

// 确定选择 SKU
async function handleSkuConfirm(selectedList) {
    if (!selectedList || !Array.isArray(selectedList) || selectedList.length === 0) return;

    try {
        for (const sku of selectedList) {
            try {
                // 调用接口获取当前 SKU 的详情
                const res = await getSkuSkuDataBySkuApi({
                    customerCode: formData.value.customerCode,
                    sku: sku
                });
                const rowData = {
                    sku: sku,
                    name: res.success && res.data ? res.data.nameCn : (res.msg || 'SKU 无效，请重新输入')
                };
                // 调用表格组件方法新增行
                skuListTableRef.value.addOrReplaceRow(rowData, ['sku']);
            } catch (e) {
                console.error(`获取 SKU [${sku}] 信息失败`, e);
                smartAlert(`获取 SKU [${sku}] 信息失败: ${e.msg}`, false);
            }
        }
    } finally {
        skuDialogVisible.value = false;
    }
}

// ================== 6. 地址簿相关逻辑 ==================

const addressDialogVisible = ref(false);
const isReceiver = ref(true); // 标记是发件人还是收件人

function openAddressDialog(type) {
    if (!formData.value.customerCode) {
        ElMessage.warning('请先选择客户代码');
        return;
    }
    isReceiver.value = type;
    addressDialogVisible.value = true;
}

function handleAddressConfirm(selectedAddress) {
    if (isReceiver.value) {
        formData.value.receiver = { ...selectedAddress, addressType: selectedAddress.typeId };
    } else {
        formData.value.sender = { ...selectedAddress, addressType: selectedAddress.typeId };
    }
}

// ================== 7. 文件上传逻辑 ==================

// 文件上传前校验 (仅限PDF)
const beforeUpload = (file) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
        smartAlert('请上传PDF格式的文件!', false);
        return false;
    }
    return true;
};

// 附件表格上传处理
const handleUpload = async (options) => {
    const currentFile = options.file;
    if (!currentFile) return;

    // 前端查重
    const isDuplicate = formData.value.fileList.some(
        item => item.fileName === currentFile.name && item.size === currentFile.size
    );
    if (isDuplicate) {
        ElMessage.warning(`文件 "${currentFile.name}" 已上传，无需重复添加`);
        return;
    }

    try {
        const res = await uploadApi(currentFile, { path: 'temp' });
        const rowData = res.success
            ? { fileName: currentFile.name, url: res.data }
            : { fileName: res.msg || '上传失败，请重试', url: '' };

        fileListTableRef.value.addOrReplaceRow(rowData, ['fileName']);
    } catch (error) {
        fileListTableRef.value.addOrReplaceRow({ fileName: '上传失败，请重试', url: '' }, ['fileName']);
        smartAlert(error.msg, false);
    }
};

// 任务与增值服务附件上传
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
            ElMessage.success('Success');
            params.onSuccess && params.onSuccess();
        } else {
            ElMessage.error(res.msg || '文件上传失败');
            params.onError && params.onError();
        }
    } catch (error) {
        console.error('文件上传失败：', error);
        ElMessage.error('文件上传失败，请重试');
        params.onError && params.onError();
    }
};

// 运单/报关单/退货单 上传 (复用逻辑)
const uploadHelper = async (file, row, fieldName, errorMsg) => {
    if (!file) return;
    try {
        const res = await uploadApi(file, { path: 'temp' });
        if (res.success) {
            row[fieldName] = res.data;
        } else {
            ElMessage.error(`${errorMsg}失败：${res.msg || '服务器异常'}`);
            row[fieldName] = '';
        }
    } catch (error) {
        ElMessage.error(`${errorMsg}出错：${error.msg || '网络异常'}`);
        row[fieldName] = '';
    }
}

const handleLabelUrlUpload = (options, row) => uploadHelper(options.file, row, 'labelUrl', '运单上传');
const handleCustomLabelUrlUpload = (options, row) => uploadHelper(options.file, row, 'customLabelUrl', '报关单上传');
const handleReturnLabelUrlUpload = (options, row) => uploadHelper(options.file, row, 'returnLabelUrl', '退货运单上传');


// ================== 8. 辅助业务逻辑 ==================

// 任务与增值服务类型改变时，联动单位
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

// 筛选物流产品
const selectChannel = async () => {
    const productRes = await getProductShipwayListApi({
        carrierCode: formData.value.carrierCode,
        statusId: 10
    })
    shipwayOptions.value = productRes.data
}

// 自动生成订单号
const getOrderNo = async () => {
    const res = await getGenerateCustomerOrderNoApi()
    if (res.success) {
        formData.value.customerOrderNo = res.data
    } else {
        smartAlert(res.msg, false);
    }
}

// 包裹内SKU操作
const addSku = (trackingNoRow) => {
    if (!trackingNoRow.skuList) trackingNoRow.skuList = [];
    trackingNoRow.skuList.push({ sku: '', qty: null });
};
const delSku = (trackingNoRow, skuIndex) => {
    if (!trackingNoRow.skuList || trackingNoRow.skuList.length <= 1) return;
    trackingNoRow.skuList.splice(skuIndex, 1);
};

// 包裹内耗材操作
const addConsumables = (trackingNoRow) => {
    if (!trackingNoRow.consumablesList) trackingNoRow.consumablesList = [];
    trackingNoRow.consumablesList.push({ consumablesCode: '', quantity: null });
};
const delConsumables = (trackingNoRow, index) => {
    if (!trackingNoRow.consumablesList || trackingNoRow.consumablesList.length <= 1) return;
    trackingNoRow.consumablesList.splice(index, 1);
};


// ================== 9. 生命周期 ==================

onMounted(async () => {
    try {
        // 定义所有需要并发请求的字典接口
        const apiTasks = [
            { key: "国家", api: getOrgCountryListApi(), handleSuccess: (data) => (countryOptions.value = data || []) },
            { key: "仓库", api: getWhWarehouseApi(), handleSuccess: (data) => (warehouseOptions.value = data || []) },
            { key: "业务类型", api: getInstockInOrderBusinessEnumApi(), handleSuccess: (data) => (businessOptions.value = data || []) },
            {
                key: "客户", api: getCustomerLikeQueryApi({ keyword: "*" }), handleSuccess: (data) =>
                    (customerOptions.value = data.map((item) => ({ value: item.code, label: `${item.code}(${item.name})` })))
            },
            { key: "运输方式类型", api: getProductShipwayTypeEnumApi(), handleSuccess: (data) => (shipwayTypeOptions.value = data || []) },
            { key: "物流方式", api: getProductShipwayListApi({ statusId: 10 }), handleSuccess: (data) => (shipwayOptions.value = data || []) },
            { key: "承运商", api: getProductShipwayBrandListApi({ statusId: 10 }), handleSuccess: (data) => (carrierOptions.value = data || []) },
            { key: "物流服务商", api: getProductSupplierListApi({ statusId: 10 }), handleSuccess: (data) => (supplierOptions.value = data || []) },
            {
                key: "货币类型", api: getCurrencyListApi(), handleSuccess: (data) => (currencyOptions.value = data.map(item => ({
                    id: item.currency, name: item.remark
                })) || [])
            },
            { key: "商品品质", api: getOrderQualityEnumApi(), handleSuccess: (data) => (qualityOptions.value = data || []) },
            { key: "出库类型", api: outstockOrderTypeApi(), handleSuccess: (data) => (typeOptions.value = data || []) },
            { key: "订单状态", api: outstockOrderStatusApi(), handleSuccess: (data) => (statusOptions.value = data || []) },
            { key: "创建方式", api: outstockOrderCreateTypeApi(), handleSuccess: (data) => (createWayOptions.value = data || []) },
            { key: "收件人地址类型", api: outstockOrderAddressTypeApi(), handleSuccess: (data) => (addressTypeOptions.value = data || []) },
            { key: "耗材类型", api: getBasicConsumablesListEnumApi(), handleSuccess: (data) => (consumablesOptions.value = data || []) },
            { key: "电商平台", api: outstockOrderEcommercePlatformApi(), handleSuccess: (data) => (ecPlatformOptions.value = data || []) },
            { key: "附件类型", api: outstockOrderAttachmentTypeApi({ atypeId: 2, btypeId: 402 }), handleSuccess: (data) => (fileTypeOptions.value = data || []) },
            { key: "服务类型", api: getVasServiceTypeListApi({ isActive: true }), handleSuccess: (data) => (serviceTypeOptions.value = data || []) },
            { key: "单位", api: getVasServiceTypeUnitEnumApi(), handleSuccess: (data) => (unitOptions.value = data || []) }
        ];

        // 并发执行所有请求
        const dropdownResults = await Promise.allSettled(
            apiTasks.map((task) => task.api)
        );

        // 统一处理结果
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
    } catch (error) {
        smartAlert('数据加载失败，请重试', false);
        console.error('数据加载失败:', error);
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

// 添加flex容器样式，使页面布局更合理
.flex-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 100px);
    padding-bottom: 0 !important;
}

// 底部按钮悬浮样式
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

// 错误状态样式覆盖
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

// 表格内加减号按钮样式
:deep(.is-circle) {
    padding: 5px !important;
    width: 30px !important;
    height: 30px !important;
    margin-left: 5px !important;
}
</style>