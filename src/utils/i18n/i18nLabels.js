import useUserMenuStore from '@/store/userMenu'

// 按钮文字映射表
export const buttonTextMap = {
    search: {
        zh: '查询',
        en: 'Search'
    },
    reset: {
        zh: '重置',
        en: 'Reset'
    },
    export: {
        zh: '导出',
        en: 'Export'
    },
    exportAttachment: {
        zh: '导出附件',
        en: 'Export Attachment'
    },
    import: {
        zh: '导入',
        en: 'Import'
    },
    add: {
        zh: '新增',
        en: 'Add'
    },
    del: {
        zh: '删除',
        en: 'Delete'
    },
    edit: {
        zh: '编辑',
        en: 'Edit'
    },
    detail: {
        zh: '详情',
        en: 'Detail'
    },
    more: {
        zh: '更多',
        en: 'More'
    },
    print: {
        zh: '打印',
        en: 'Print'
    },
    copy: {
        zh: '复制',
        en: 'Copy'
    },
    status: {
        zh: '更新状态',
        en: 'Update Status'
    },
    assignRole: {
        zh: '分配角色',
        en: 'Assign Role'
    },
    lock: {
        zh: '锁定',
        en: 'Lock'
    },
    unlock: {
        zh: '解锁',
        en: 'Unlock'
    },
    audit: {
        zh: '审核',
        en: 'Audit'
    },
    forceOffline: {
        zh: '强制下线',
        en: 'Force Offline'
    },
    cancel: {
        zh: '取消',
        en: 'Cancel'
    },
    freeze: {
        zh: '冻结',
        en: 'Freeze'
    },
    unfreeze: {
        zh: '解冻',
        en: 'Unfreeze'
    },
    log: {
        zh: '日志',
        en: 'Log'
    },
    destroy: {
        zh: '销毁',
        en: 'Destroy'
    },
    disable: {
        zh: '停用',
        en: 'Disable'
    },
    enable: {
        zh: '启用',
        en: 'Enable'
    },
    outbound: {
        zh: '出库',
        en: 'Outbound'
    },
    inbound: {
        zh: '入库',
        en: 'Inbound'
    },
    test: {
        zh: '测试',
        en: 'Test'
    },
    expand: {
        zh: '展开/折叠',
        en: 'Expand/Collapse'
    },
    apply: {
        zh: '应用',
        en: 'Apply'
    },
    columnSetting: {
        zh: '列设置',
        en: 'Column Setting'
    },
    cancelReceipt: {
        zh: '取消收货',
        en: 'Cancel Receipt'
    },
    printInboundOrder: {
        zh: '打印入库单',
        en: 'Print Inbound Order'
    },
    printBoxLabel: {
        zh: '打印箱唛',
        en: 'Print Box Label'
    },
    resetPassword: {
        zh: '重置密码',
        en: 'Reset Password'
    },
    viewPassword: {
        zh: '查看密码',
        en: 'View Password'
    },
    authorize: {
        zh: '授权',
        en: 'Authorize'
    },
    operate: {
        zh: '操作',
        en: 'Operate'
    },
    connect: {
        zh: '对接',
        en: 'Connect'
    },
    view: {
        zh: '查看',
        en: 'View'
    },
    download: {
        zh: '下载',
        en: 'Download'
    },
    attachment: {
        en: 'Attachment',
        zh: '附件'
    },
    auditPass: {
        zh: '审核通过',
        en: 'Audit Pass'
    },
    auditReject: {
        zh: '审核拒绝',
        en: 'Audit Reject'
    },
    shipped: {
        zh: '已发货',
        en: 'Shipped'
    },
    signIn: {
        zh: '签到',
        en: 'Sign In'
    },
    lockQuantity: {
        zh: '锁定数量',
        en: 'Lock Quantity'
    },
    adjustQuantity: {
        zh: '调整数量',
        en: 'Adjust Quantity'
    },
    processing: {
        zh: '处理',
        en: 'Processing'
    },
    claim: {
        zh: '认领',
        en: 'Claim'
    },
    importCreate: {
        zh: '导入创建',
        en: 'Import Create'
    },
    importUpdate: {
        zh: '导入更新',
        en: 'Import Update'
    },
    appointment: {
        zh: '预约情况',
        en: 'Appointment'
    },
    channelInfo: {
        zh: '渠道信息',
        en: 'Channel Info'
    },
    addChannel: {
        zh: '新增渠道',
        en: 'Add Channel'
    },
    config: {
        zh: "配置分区",
        en: "Config Zone"
    },
    save: {
        zh: '保存',
        en: 'Save'
    },
    close: {
        zh: '关闭',
        en: 'Close'
    },
    confirm: {
        zh: '确定',
        en: 'Confirm'
    },
    batchRead: {
        zh: '批量已读',
        en: 'Batch Read'
    },
    preview: {
        zh: '预览',
        en: 'Preview'
    },
    batchAssignRole: {
        zh: '批量分配角色',
        en: 'Batch Assign Role'
    },
    upload: {
        zh: '上传',
        en: 'Upload'
    },
    GotIt: {
        zh: '我知道了',
        en: 'Got It'
    },
    Prompt: {
        zh: '提示',
        en: 'Prompt'
    },
    // 批量设置
    batchSet: {
        zh: '批量设置',
        en: 'Batch Set'
    },
    // 设置仓库
    setWarehouse: {
        zh: '设置仓库',
        en: 'Set Warehouse'
    },
    // 设置渠道
    setChannel: {
        zh: '设置渠道',
        en: 'Set Channel'
    },
    // 物流单号
    trackingNo: {
        zh: '物流单号',
        en: 'Tracking No.'
    },
    // 申请单号
    applyNo: {
        zh: '申请单号',
        en: 'Apply No.'
    },
    // 导入运单
    importTrackingNo: {
        zh: '导入运单',
        en: 'Import Tracking No.'
    },
    // 取消单号
    cancelTrackingNo: {
        zh: '取消运单',
        en: 'Cancel Tracking No.'
    },
    // 取消拦截
    CancelHoldUp: {
        zh: '取消拦截',
        en: 'Cancel Intercept'
    },
    // 拦截
    intercept: {
        zh: '拦截',
        en: 'Intercept'
    },
    // 申请拦截
    ApplyHoldUp: {
        zh: '申请拦截',
        en: 'Apply Intercept'
    },
    // 取消拦截
    CancelHoldUp: {
        zh: '取消拦截',
        en: 'Cancel Intercept'
    },
    // 拦截成功
    CompleteHoldUp: {
        zh: '拦截成功',
        en: 'Intercept Success'
    },
    // 拦截失败
    FailHoldUp: {
        zh: '拦截失败',
        en: 'Intercept Failure'
    },
    // 地址簿
    addressBook: {
        zh: '地址簿',
        en: 'Address Book'
    },
    // 备注
    remark: {
        zh: '备注',
        en: 'Remark'
    },
    // 生效
    effective: {
        zh: '生效',
        en: 'Effective'
    },
    // 作废
    invalid: {
        zh: '作废',
        en: 'Invalid'
    },
    // 分配库存
    assignStock: {
        zh: '分配库存',
        en: 'Assign Stock'
    },
    // 取消分配
    cancelAssign: {
        zh: '取消分配',
        en: 'Cancel Assign'
    },
    //波次
    waveNo: {
        zh: '波次',
        en: 'Wave No.'
    },
    // 加入波次
    joinWave: {
        zh: '加入波次',
        en: 'Join Wave'
    },
    // 退出波次
    exitWave: {
        zh: '退出波次',
        en: 'Exit Wave'
    },
    // 新增波次
    addWave: {
        zh: '新增波次',
        en: 'Add Wave'
    },
    // 创建记录
    createRecord: {
        zh: '创建记录',
        en: 'Create Record'
    },
    // 打印拣货单
    printPickList: {
        zh: '打印拣货单',
        en: 'Print Pick List'
    },
    // 打印运单
    printTrackingNo: {
        zh: '打印运单',
        en: 'Print Tracking No.'
    },
    // 手工启动
    manualStart: {
        zh: '手工启动',
        en: 'Manual Start'
    },
    // 保存并添加到模板
    saveAndAddTemplate: {
        zh: '保存并添加到模板',
        en: 'Save and Add to Template'
    },
    // 新增问题
    addProblem: {
        zh: '新增问题',
        en: 'Add Problem'
    },
    // 关闭问题
    closeProblem: {
        zh: '关闭问题',
        en: 'Close Problem'
    },
    // 登记问题
    registerProblem: {
        zh: '登记问题',
        en: 'Register Problem'
    },
    // 分配拣货员
    assignPicker: {
        zh: '分配拣货员',
        en: 'Assign Picker'
    },
    // 分配
    assign: {
        zh: '分配',
        en: 'Assign'
    },
    // 取消分配
    cancelAssignPicker: {
        zh: '取消分配',
        en: 'Cancel Assign'
    },
    // 待分配
    pendingAssign: {
        zh: '待分配',
        en: 'Pending Assign'
    },
    // 草稿
    draft: {
        zh: '草稿',
        en: 'Draft'
    },
    // 离职
    resign: {
        zh: '离职',
        en: 'Resign'
    },
    // 收回
    recall: {
        zh: '收回',
        en: 'Recall'
    },
    // 查看凭证
    viewVoucher: {
        zh: '查看凭证',
        en: 'View Voucher'
    },
    // 强制完成
    forceComplete: {
        zh: '强制完成',
        en: 'Force Complete'
    },
    // 审批
    approve: {
        zh: '审批',
        en: 'Approve'
    },
    // 审批通过
    approvePass: {
        zh: '审批通过',
        en: 'Approve Pass'
    },
    // 审批拒绝
    approveReject: {
        zh: '审批拒绝',
        en: 'Approve Reject'
    },
    // 打印服务单
    printServiceOrder: {
        zh: '打印服务单',
        en: 'Print Service Order'
    },
    // 运单
    trackingNo: {
        zh: '运单',
        en: 'Tracking No.'
    },
    // 服务单
    serviceOrder: {
        zh: '服务单',
        en: 'Service Order'
    },
    // 附件
    attachment: {
        zh: '附件',
        en: 'Attachment'
    },
    // 商业发票
    commercialInvoice: {
        zh: '商业发票',
        en: 'Commercial Invoice'
    },
    // 优先抓取
    priorityGrab: {
        zh: '优先抓取',
        en: 'Priority Grab'
    },
    // 新增轨迹
    addTrack: {
        zh: '新增轨迹',
        en: 'Add Track'
    },
    // 删除轨迹
    deleteTrack: {
        zh: '删除轨迹',
        en: 'Delete Track'
    },
    // 轨迹详情
    trackDetail: {
        zh: '轨迹详情',
        en: 'Track Detail'
    },
    // 确定删除
    confirmDelete: {
        zh: '确定删除',
        en: 'Confirm Delete'
    },
    // 提交
    submit: {
        zh: '提交',
        en: 'Submit'
    },
    // 保存为草稿
    saveAsDraft: {
        zh: '保存为草稿',
        en: 'Save As Draft'
    },
    // 加入账单
    joinBill: {
        zh: '加入账单',
        en: 'Join Bill'
    },
    // 添加规则组
    addRuleGroup: {
        zh: '添加规则组',
        en: 'Add Rule Group'
    },
    // 删除规则组
    deleteRuleGroup: {
        zh: '删除规则组',
        en: 'Delete Rule Group'
    },
    //规则组
    ruleGroup: {
        zh: '规则组',
        en: 'Rule Group'
    },
    // 添加条件
    addCondition: {
        zh: '添加条件',
        en: 'Add Condition'
    },
    // 刷新缓存
    refreshCache: {
        zh: '刷新缓存',
        en: 'Refresh Cache'
    },
    // 授权
    authorize: {
        zh: '授权',
        en: 'Authorize'
    }
}
const labelsMap = {
    // 通用配置
    "general": {
        "createdTimeBegin": {
            "zh": "创建时间:",
            "en": "Creation Time:",
            "placeholderZh": "请选择开始时间",
            "placeholderEn": "Please Select Start Time"
        },
        "createdTimeEnd": {
            "zh": "截至时间:",
            "en": "End Time:",
            "placeholderZh": "请选择截至时间",
            "placeholderEn": "Please Select End Time"
        },
        "customerCode": {
            "zh": "客户:",
            "en": "Customer Code:",
            "placeholderEn": "Please Enter Customer Code",
            "placeholderZh": "请输入客户",
        },
        "customerId": {
            "zh": "客户:",
            "en": "Customer Code:",
            "placeholderEn": "Please Enter Customer Code",
            "placeholderZh": "请输入客户",
        },
        "warehouseCode": {
            "zh": "仓库:",
            "en": "Warehouse Code:",
            "placeholderEn": "Please Select Warehouse Code",
            "placeholderZh": "请选择仓库",
        },
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderEn": "Please Select Company",
            "placeholderZh": "请选择公司",
        },
        "remark": {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderEn": "Please Enter Remark",
            "placeholderZh": "请输入备注",
        },
        "barcode": {
            "zh": "条码:",
            "en": "Barcode:",
            "placeholderEn": "Please Enter Barcode",
            "placeholderZh": "请输入条码",
        },
        "warehouseCodeList": {
            "zh": "仓库:",
            "en": "Whse. Code:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse. Code"
        },
        "customerCodeList": {
            "zh": "客户:",
            "en": "Cust. Code:",
            "placeholderZh": "请输入客户",
            "placeholderEn": "Enter Cust. Code"
        },
        "inOrderIds": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "onShelfStartTime": {
            "zh": "上架开始日期:",
            "en": "On Shelf Start Time:",
            "placeholderZh": "请选择上架开始日期",
            "placeholderEn": "Select On Shelf Start Time"
        },
        "onShelfEndTime": {
            "zh": "上架截止日期:",
            "en": "On Shelf End Time:",
            "placeholderZh": "请选择上架截止日期",
            "placeholderEn": "Select On Shelf End Time"
        },
        "zoneCodes": {
            "zh": "指定库区:",
            "en": "Zone Codes:",
            "placeholderZh": "请输入要指定库区",
            "placeholderEn": "Enter Zone Codes"
        },
        "locationCodes": {
            "zh": "指定库位:",
            "en": "Location Codes:",
            "placeholderZh": "请输入要指定库位",
            "placeholderEn": "Enter Location Codes"
        },
        "excludeZoneCodes": {
            "zh": "排除库区:",
            "en": "Exclude Zone Codes:",
            "placeholderZh": "请输入要排除库区",
            "placeholderEn": "Enter Exclude Zone Codes"
        },
        "excludeLocationCodes": {
            "zh": "排除库位:",
            "en": "Exclude Location Codes:",
            "placeholderZh": "请输入要排除库位",
            "placeholderEn": "Enter Exclude Location Codes"
        },
        "isJoin": {
            "zh": "加入方式:",
            "en": "Join Method:",
            "placeholderZh": "请选择加入方式",
            "placeholderEn": "Select Join Method"
        }
    },
    "base_basic_country_list": {
        "continentId": {
            "zh": "洲名:",
            "en": "Continent:",
            "placeholderZh": "请选择洲名",
            "placeholderEn": "Select Continent"
        },
        "code": {
            "zh": "国家代码:",
            "en": "Country Code:",
            "placeholderZh": "请输入国家代码",
            "placeholderEn": "Enter Country Code"
        },
        "nameCn": {
            "zh": "国家中文名:",
            "en": "Chn. Name:",
            "placeholderZh": "请输入国家中文名",
            "placeholderEn": "Enter Chinese Name"
        },
        "nameEn": {
            "zh": "国家英文名:",
            "en": "Eng. Name:",
            "placeholderZh": "请输入国家英文名",
            "placeholderEn": "Enter English Name"
        },
        "code": {
            "zh": "二字码:",
            "en": "2L Code:",
            "placeholderZh": "请输入二字码",
            "placeholderEn": "Enter 2-letter Code"
        },
        "code3": {
            "zh": "三字码:",
            "en": "3L Code:",
            "placeholderZh": "请输入三字码",
            "placeholderEn": "Enter 3-letter Code"
        },
        "currency": {
            "zh": "币种代码:",
            "en": "Currency:",
            "placeholderZh": "请输入币种代码",
            "placeholderEn": "Enter Currency Code"
        },
        "phoneAreaCode": {
            "zh": "电话区号:",
            "en": "Area Code:",
            "placeholderZh": "请输入电话区号",
            "placeholderEn": "Enter Area Code"
        }
    },
    "base_basic_template_list": {
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "atypeId": {
            "zh": "模板类型:",
            "en": "Temp. Type:",
            "placeholderZh": "请选择模板类型",
            "placeholderEn": "Select Temp. Type"
        },
        "btypeId": {
            "zh": "数据类型:",
            "en": "Data Type:",
            "placeholderZh": "请先选择模板类型",
            "placeholderEn": "Select Temp. Type First"
        },
        "name": {
            "zh": "模板名称:",
            "en": "Temp. Name:",
            "placeholderZh": "请输入模板名称",
            "placeholderEn": "Enter Temp. Name"
        },
        "fileUrl": {
            "zh": "模板文件:",
            "en": "Temp. File:",
            "placeholderZh": "点击右侧上传文件",
            "placeholderEn": "Click to Upload File"
        },
        "sortNo": {
            "zh": "排序:",
            "en": "Sort:",
            "placeholderZh": "请输入排序",
            "placeholderEn": "Enter Sort No."
        }
    },
    "base_consumables_consumables_list": {
        "isPublic": {
            "zh": "是否公用:",
            "en": "Is Public:",
            "placeholderZh": "请选择是否公用",
            "placeholderEn": "Select Is Public"
        },
        "currency": {
            "zh": "币种代码:",
            "en": "Currency Code:",
            "placeholderZh": "请选择币种",
            "placeholderEn": "Select Currency"
        },
        "codeList": {
            "zh": "类型代码:",
            "en": "Type Code:",
            "placeholderZh": "请输入类型代码",
            "placeholderEn": "Enter Type Code"
        },
        "typeCode": {
            "zh": "类型代码:",
            "en": "Type Code:",
            "placeholderZh": "请输入类型代码",
            "placeholderEn": "Enter Type Code"
        },
        "name": {
            "zh": "类型名称:",
            "en": "Type Name:",
            "placeholderZh": "请输入类型名称",
            "placeholderEn": "Enter Type Name"
        },
        "code": {
            "zh": "类型代码:",
            "en": "Type Code:",
            "placeholderZh": "请输入类型代码",
            "placeholderEn": "Enter Type Code"
        },
        "costPrice": {
            "zh": "成本价格:",
            "en": "Cost Price:",
            "placeholderZh": "请输入成本价格",
            "placeholderEn": "Enter Cost Price"
        },
        "salePrice": {
            "zh": "销售价格:",
            "en": "Selling Price:",
            "placeholderZh": "请输入销售价格",
            "placeholderEn": "Enter Selling Price"
        },
        "length": {
            "zh": "长 (CM):",
            "en": "Length (CM):",
            "placeholderZh": "请输入长 (CM)",
            "placeholderEn": "Enter Length (CM)"
        },
        "width": {
            "zh": "宽 (CM):",
            "en": "Width (CM):",
            "placeholderZh": "请输入宽 (CM)",
            "placeholderEn": "Enter Width (CM)"
        },
        "height": {
            "zh": "高 (CM):",
            "en": "Height (CM):",
            "placeholderZh": "请输入高 (CM)",
            "placeholderEn": "Enter Height (CM)"
        },
        "unitWeight": {
            "zh": "单位重量:",
            "en": "Unit Wt (KG):",
            "placeholderZh": "请输入单位重量 (KG)",
            "placeholderEn": "Enter Unit Wt (KG)"
        },
        "sortNo": {
            "zh": "排序:",
            "en": "Sort:",
            "placeholderZh": "请输入排序",
            "placeholderEn": "Enter Sort No."
        }
    },
    "base_consumables_consumablesIn_list": {
        "consumablesCode": {
            "zh": "耗材类型:",
            "en": "Consum. Type:",
            "placeholderZh": "请选择耗材类型",
            "placeholderEn": "Select Consum. Type"
        },
        "isPublic": {
            "zh": "是否公用:",
            "en": "Is Public:",
            "placeholderZh": "请选择是否公用",
            "placeholderEn": "Select Is Public"
        },
        "billNoList": {
            "zh": "入库单号:",
            "en": "Receipt No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Receipt No."
        },
        "trackingNoList": {
            "zh": "跟踪单号:",
            "en": "Tracking No.:",
            "placeholderZh": "请输入跟踪单号",
            "placeholderEn": "Enter Tracking No."
        },
        "warehouseCode": {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Warehouse"
        },
        "billNo": {
            "zh": "入库单号:",
            "en": "Receipt No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Receipt No."
        },
        "trackingNo": {
            "zh": "跟踪单号:",
            "en": "Tracking No.:",
            "placeholderZh": "请输入跟踪单号",
            "placeholderEn": "Enter Tracking No."
        },
        "consumablesBarcode": {
            "zh": "耗材条码:",
            "en": "Consum. Barcode:",
            "placeholderZh": "请输入耗材条码",
            "placeholderEn": "Enter Consum. Barcode"
        },
        "quantity": {
            "zh": "入库数量:",
            "en": "Receipt Qty:",
            "placeholderZh": "请输入入库数量",
            "placeholderEn": "Enter Receipt Qty"
        }
    },



    "base_consumables_consumablesInventory_list": {
        "consumablesCodes": {
            "zh": "耗材类型:",
            "en": "Consum. Type:",
            "placeholderZh": "请选择耗材类型",
            "placeholderEn": "Select Consum. Type"
        },
        "isPublic": {
            "zh": "是否公用:",
            "en": "Is Public:",
            "placeholderZh": "请选择是否公用",
            "placeholderEn": "Select Is Public"
        },
        "consumablesName": {
            "zh": "耗材名称:",
            "en": "Consum. Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "consumablesCode": {
            "zh": "耗材代码:",
            "en": "Consum. Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        }
    },
    "base_consumables_consumablesOut_list": {
        "consumablesCodes": {
            "zh": "耗材类型:",
            "en": "Consum. Type:",
            "placeholderZh": "请选择耗材类型",
            "placeholderEn": "Select Consum. Type"
        },
        "isPublic": {
            "zh": "是否公用:",
            "en": "Is Public:",
            "placeholderZh": "请选择是否公用",
            "placeholderEn": "Select Is Public"
        },
        "outOrderNoList": {
            "zh": "出库单号:",
            "en": "Issue No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Enter Issue No."
        },
        "trackingNoList": {
            "zh": "跟踪单号:",
            "en": "Tracking No.:",
            "placeholderZh": "请输入跟踪单号",
            "placeholderEn": "Enter Tracking No."
        },
        "warehouseCode": {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Warehouse"
        },
        "outOrderNo": {
            "zh": "出库单号:",
            "en": "Delivery No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Enter Delivery No."
        },
        "consumablesBarcode": {
            "zh": "耗材条码:",
            "en": "Consum. Barcode:",
            "placeholderZh": "请输入耗材条码",
            "placeholderEn": "Enter Consum. Barcode"
        },
        "quantity": {
            "zh": "出库数量:",
            "en": "Delivery Qty:",
            "placeholderZh": "请输入出库数量",
            "placeholderEn": "Enter Delivery Qty"
        }
    },
    "base_cust_customer_list": {
        "financialUserCode": {
            "zh": "财务用户:",
            "en": "Finance User:",
            "placeholderZh": "请先选择公司",
            "placeholderEn": "Select Company First"
        },
        "salesUserCode": {
            "zh": "销售用户:",
            "en": "Sales User:",
            "placeholderZh": "请先选择公司",
            "placeholderEn": "Select Company First"
        },
        "code": {
            "zh": "客户代码:",
            "en": "Cust. Code:",
            "placeholderZh": "请输入客户代码",
            "placeholderEn": "Enter Cust. Code"
        },
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "请输入用户代码",
            "placeholderEn": "Enter User Code"
        },
        "statusId": {
            "zh": "客户状态:",
            "en": "Cust. Status:",
            "placeholderZh": "请选择客户状态",
            "placeholderEn": "Select Cust. Status"
        }
    },
    "base_cust_customer_add": {
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderZh": "请选择公司",
            "placeholderEn": "Select Company"
        },
        "code": {
            "zh": "客户代码:",
            "en": "Code:",
            "placeholderZh": "将自动增加公司代码前缀",
            "placeholderEn": "Company code prefix will be added automatically"
        },
        "name": {
            "zh": "客户名称:",
            "en": "Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "password": {
            "zh": "密码:",
            "en": "Password:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "salesUserCode": {
            "zh": "销售用户:",
            "en": "Sales User:",
            "placeholderZh": "请选择销售用户",
            "placeholderEn": "Select Sales User"
        },
        "financialUserCode": {
            "zh": "财务用户:",
            "en": "Financial User:",
            "placeholderZh": "请选择财务用户",
            "placeholderEn": "Select Financial User"
        },
        "levelId": {
            "zh": "客户等级:",
            "en": "Level:",
            "placeholderZh": "请选择客户等级",
            "placeholderEn": "Select Customer Level"
        },
        "remark": {
            "zh": "备注:",
            "en": "Remarks:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "countryCode": {
            "zh": "国家:",
            "en": "Country:",
            "placeholderZh": "请选择国家",
            "placeholderEn": "Select Country"
        },
        "province": {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "city": {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "address": {
            "zh": "详细地址:",
            "en": "Address:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "postcode": {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "contact": {
            "zh": "联系人:",
            "en": "Contact Person:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "mobilePhone": {
            "zh": "手机号:",
            "en": "Phone:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "email": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "",
            "placeholderEn": ""
        }
    },
    "base_cust_customer_upd": {
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderZh": "请选择公司",
            "placeholderEn": "Select Company"
        },
        "code": {
            "zh": "客户代码:",
            "en": "Code:",
            "placeholderZh": "将自动增加公司代码前缀",
            "placeholderEn": "Company code prefix will be added automatically"
        },
        "name": {
            "zh": "客户名称:",
            "en": "Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "password": {
            "zh": "密码:",
            "en": "Password:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "salesUserCode": {
            "zh": "销售用户:",
            "en": "Sales User:",
            "placeholderZh": "请选择销售用户",
            "placeholderEn": "Select Sales User"
        },
        "financialUserCode": {
            "zh": "财务用户:",
            "en": "Financial User:",
            "placeholderZh": "请选择财务用户",
            "placeholderEn": "Select Financial User"
        },
        "levelId": {
            "zh": "客户等级:",
            "en": "Level:",
            "placeholderZh": "请选择客户等级",
            "placeholderEn": "Select Customer Level"
        },
        "remark": {
            "zh": "备注:",
            "en": "Remarks:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "countryCode": {
            "zh": "国家:",
            "en": "Country:",
            "placeholderZh": "请选择国家",
            "placeholderEn": "Select Country"
        },
        "province": {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "city": {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "address": {
            "zh": "详细地址:",
            "en": "Address:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "postcode": {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "contact": {
            "zh": "联系人:",
            "en": "Contact Person:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "mobilePhone": {
            "zh": "手机号:",
            "en": "Phone:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "email": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "",
            "placeholderEn": ""
        }
    },
    "base_cust_customerApi_list": {
        "toUsToken": {
            "zh": "令牌:",
            "en": "Token:",
            "placeholderZh": "请输入令牌(Token)",
            "placeholderEn": "Enter Token"
        },
        "apiTypeId": {
            "zh": "接口类型:",
            "en": "API Type:",
            "placeholderZh": "请选择接口类型",
            "placeholderEn": "Select API Type"
        },
        "toUsSecretKey": {
            "zh": "密钥:",
            "en": "Secret Key:",
            "placeholderZh": "请输入密钥",
            "placeholderEn": "Enter Secret Key"
        },
        "sysName": {
            "zh": "客户系统名:",
            "en": "Cust. Sys Name:",
            "placeholderZh": "请输入客户系统名（如自研）",
            "placeholderEn": "Enter Cust. Sys Name (e.g., self-dev)"
        },
        "toCUrl": {
            "zh": "回调地址:",
            "en": "Callback URL:",
            "placeholderZh": "请输入回调地址",
            "placeholderEn": "Enter Callback URL"
        },
        "toCToken": {
            "zh": "回调令牌:",
            "en": "Callback Token:",
            "placeholderZh": "请输入回调令牌",
            "placeholderEn": "Enter Callback Token"
        },
        "toCSecretKey": {
            "zh": "回调密钥:",
            "en": "Callback Secret Key:",
            "placeholderZh": "请输入回调密钥",
            "placeholderEn": "Enter Callback Secret Key"
        },
        "onlineTime": {
            "zh": "上线时间:",
            "en": "Online Time:",
            "placeholderZh": "请选择上线时间",
            "placeholderEn": "Select Online Time"
        },
        "extend1": {
            "zh": "预留字段 1:",
            "en": "Reserved Field 1:",
            "placeholderZh": "请输入预留字段 1",
            "placeholderEn": "Enter Reserved Field 1"
        },
        "extend2": {
            "zh": "预留字段 2:",
            "en": "Reserved Field 2:",
            "placeholderZh": "请输入预留字段 2",
            "placeholderEn": "Enter Reserved Field 2"
        }
    },
    "base_org_employee_list": {
        "num": {
            "zh": "工号:",
            "en": "Emp. ID:",
            "placeholderZh": "请输入工号",
            "placeholderEn": "Enter Emp. ID"
        },
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "请输入用户代码",
            "placeholderEn": "Enter User Code"
        },
        "statusId": {
            "zh": "在职状态:",
            "en": "Emp. Status:",
            "placeholderZh": "请选择在职状态",
            "placeholderEn": "Select Emp. Status"
        },
        "departmentId": {
            "zh": "部门:",
            "en": "Dept.:",
            "placeholderZh": "请先选择公司",
            "placeholderEn": "Select Company First"
        }
    },
    "base_org_employee_add": {
        "departmentId": {
            "zh": "部门:",
            "en": "Department:",
            "placeholderZh": "请选择部门",
            "placeholderEn": "Select Department"
        },
        "name": {
            "zh": "姓名:",
            "en": "Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "num": {
            "zh": "工号:",
            "en": "Employee ID:",
            "placeholderZh": "将自动增加公司代码前缀",
            "placeholderEn": "Company code prefix will be added automatically"
        },
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "password": {
            "zh": "密码:",
            "en": "Password:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "sex": {
            "zh": "性别:",
            "en": "Gender:",
            "placeholderZh": "请选择性别",
            "placeholderEn": "Select Gender"
        },
        "nationId": {
            "zh": "民族:",
            "en": "Ethnic Group:",
            "placeholderZh": "请选择民族",
            "placeholderEn": "Select Ethnic Group"
        },
        "positionIdList": {
            "zh": "岗位:",
            "en": "Position:",
            "placeholderZh": "请选择岗位",
            "placeholderEn": "Select Position"
        },
        "roleIds": {
            "zh": "角色:",
            "en": "Role:",
            "placeholderZh": "请选择角色",
            "placeholderEn": "Select Role"
        },
        "entryTime": {
            "zh": "入职时间:",
            "en": "Entry Date:",
            "placeholderZh": "选择入职时间",
            "placeholderEn": "Select Entry Date"
        },
        "mobilePhone": {
            "zh": "手机号:",
            "en": "Phone:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "email": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "countryCode": {
            "zh": "国家:",
            "en": "Country:",
            "placeholderZh": "请选择国家",
            "placeholderEn": "Select Country"
        },
        "province": {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "city": {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "postcode": {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "address": {
            "zh": "街道地址:",
            "en": "Street Address:",
            "placeholderZh": "",
            "placeholderEn": ""
        }
    },
    "base_org_employee_upd": {
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderZh": "请选择公司",
            "placeholderEn": "Select Company"
        },
        "departmentId": {
            "zh": "部门:",
            "en": "Department:",
            "placeholderZh": "请选择部门",
            "placeholderEn": "Select Department"
        },
        "name": {
            "zh": "姓名:",
            "en": "Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "num": {
            "zh": "工号:",
            "en": "Employee ID:",
            "placeholderZh": "将自动增加公司代码前缀",
            "placeholderEn": "Company code prefix will be added automatically"
        },
        "sex": {
            "zh": "性别:",
            "en": "Gender:",
            "placeholderZh": "请选择性别",
            "placeholderEn": "Select Gender"
        },
        "nationId": {
            "zh": "民族:",
            "en": "Ethnic Group:",
            "placeholderZh": "请选择民族",
            "placeholderEn": "Select Ethnic Group"
        },
        "positionIdList": {
            "zh": "岗位:",
            "en": "Position:",
            "placeholderZh": "请选择岗位",
            "placeholderEn": "Select Position"
        },
        "roleIds": {
            "zh": "角色:",
            "en": "Role:",
            "placeholderZh": "请选择角色",
            "placeholderEn": "Select Role"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "entryTime": {
            "zh": "入职时间:",
            "en": "Entry Date:",
            "placeholderZh": "选择入职时间",
            "placeholderEn": "Select Entry Date"
        },
        "departureTime": {
            "zh": "离职时间:",
            "en": "Departure:",
            "placeholderZh": "选择离职时间",
            "placeholderEn": "Select Departure Date"
        },
        "mobilePhone": {
            "zh": "手机号:",
            "en": "Phone:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "email": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "countryCode": {
            "zh": "国家:",
            "en": "Country:",
            "placeholderZh": "请选择国家",
            "placeholderEn": "Select Country"
        },
        "province": {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "city": {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "postcode": {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "address": {
            "zh": "街道地址:",
            "en": "Street Address:",
            "placeholderZh": "",
            "placeholderEn": ""
        }
    },
    "base_cust_customerLevel_list": {
        "name": {
            "zh": "等级名称:",
            "en": "Level Name:",
            "placeholderZh": "请输入等级名称",
            "placeholderEn": "Enter Level Name"
        },
        "money": {
            "zh": "消费金额:",
            "en": "Consump. Amt:",
            "placeholderZh": "请输入消费金额(正整数)",
            "placeholderEn": "Enter Consump. Amt (Positive Integer)"
        },
        "days": {
            "zh": "统计天数:",
            "en": "Stat. Days:",
            "placeholderZh": "请输入统计天数(正整数)",
            "placeholderEn": "Enter Stat. Days (Positive Integer)"
        },
        "sortNo": {
            "zh": "排序:",
            "en": "Sort:",
            "placeholderZh": "请输入排序(正整数)",
            "placeholderEn": "Enter Sort No. (Positive Integer)"
        }
    },



    "base_org_organization_list": {
        "parentId": {
            "zh": "上级组织:",
            "en": "Parent Org.:",
            "placeholderZh": "请选择上级组织",
            "placeholderEn": "Select Parent Org."
        },
        "typeId": {
            "zh": "类型名称:",
            "en": "Type:",
            "placeholderZh": "请选择类型名称",
            "placeholderEn": "Select Type Name"
        },
        "nameCn": {
            "zh": "中文名称:",
            "en": "Chn. Name:",
            "placeholderZh": "请输入中文名称",
            "placeholderEn": "Enter Chn. Name"
        },
        "nameEn": {
            "zh": "英文名称:",
            "en": "Eng. Name:",
            "placeholderZh": "请输入英文名称",
            "placeholderEn": "Enter Eng. Name"
        },
        "leader": {
            "zh": "负责人:",
            "en": "Leader:",
            "placeholderZh": "请选择负责人",
            "placeholderEn": "Select Leader"
        },
        "code": {
            "zh": "公司代码:",
            "en": "Co. Code:",
            "placeholderZh": "请输入公司代码",
            "placeholderEn": "Enter Co. Code"
        },
        "warehouseId": {
            "zh": "绑定仓库:",
            "en": "Bind Whse.:",
            "placeholderZh": "请选择绑定仓库",
            "placeholderEn": "Select Bind Whse."
        }
    },
    "base_sku_sku_list": {
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "barcodeList": {
            "zh": "条码:",
            "en": "Barcode:",
            "placeholderZh": "请输入条码",
            "placeholderEn": "Enter Barcode"
        },
        "statusId": {
            "zh": "仓库审核:",
            "en": "Whse. Audit:",
            "placeholderZh": "请选择仓库审核状态",
            "placeholderEn": "Select Whse. Audit Status"
        },
        "cusStatusId": {
            "zh": "客户审核:",
            "en": "Cust. Audit:",
            "placeholderZh": "请选择客户审核状态",
            "placeholderEn": "Select Cust. Audit Status"
        },
        "isNew": {
            "zh": "是否新品:",
            "en": "Is New Prod.:",
            "placeholderZh": "请选择是否新品",
            "placeholderEn": "Select Is New Prod."
        },
        "isCheckedSize": {
            "zh": "是否复测:",
            "en": "Is Re-meas.:",
            "placeholderZh": "请选择是否复测",
            "placeholderEn": "Select Is Re-meas."
        },
        "dangerId": {
            "zh": "危险类型:",
            "en": "Danger Type:",
            "placeholderZh": "请选择危险类型",
            "placeholderEn": "Select Danger Type"
        },
        "electrifiedId": {
            "zh": "带电类型:",
            "en": "Electr. Type:",
            "placeholderZh": "请选择带电类型",
            "placeholderEn": "Select Electr. Type"
        }
    },
    "base_org_position_list": {
        "name": {
            "zh": "岗位名称:",
            "en": "Position:",
            "placeholderZh": "请输入岗位名称",
            "placeholderEn": "Enter Position Name"
        }
    },
    "base_sku_skuMapping_list": {
        "platformSkuList": {
            "zh": "平台SKU:",
            "en": "Plat. SKU:",
            "placeholderZh": "请输入平台SKU",
            "placeholderEn": "Enter Plat. SKU"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "platformSku": {
            "zh": "平台SKU:",
            "en": "Plat. SKU:",
            "placeholderZh": "请输入平台SKU",
            "placeholderEn": "Enter Plat. SKU"
        },
        "sku": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        }
    },
    "base_wh_location_list": {
        "zoneCode": {
            "zh": "库区:",
            "en": "Zone:",
            "placeholderZh": "请选择库区",
            "placeholderEn": "Select Zone"
        },
        "codeList": {
            "zh": "库位代码:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位号",
            "placeholderEn": "Enter Loc. No."
        },
        "sizeTypeCode": {
            "zh": "尺寸类型:",
            "en": "Size Type:",
            "placeholderZh": "请选择库位类型",
            "placeholderEn": "Select Loc. Type"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "saturation": {
            "zh": "饱和度:",
            "en": "Saturation:",
            "placeholderZh": "请选择饱和度",
            "placeholderEn": "Select Saturation"
        },
        "xcoord": {
            "zh": "x 坐标:",
            "en": "X Coord.:",
            "placeholderZh": "请输入 x 坐标",
            "placeholderEn": "Enter X Coord."
        },
        "ycoord": {
            "zh": "y 坐标:",
            "en": "Y Coord.:",
            "placeholderZh": "请输入 y 坐标",
            "placeholderEn": "Enter Y Coord."
        },
        "zcoord": {
            "zh": "z 坐标:",
            "en": "Z Coord.:",
            "placeholderZh": "z 坐标表示货架第几层",
            "placeholderEn": "Z Coord. = Shelf Layer"
        },
        "accessEase": {
            "zh": "存取难度:",
            "en": "Access Difficulty:",
            "placeholderZh": "1 = 极易，5 = 极难，基于物理位置/通道等",
            "placeholderEn": "1=Very Easy, 5=Very Difficult (Loc./Channel)"
        },
        "warehouseCode": {
            "zh": "仓库:",
            "en": "Whse.:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse."
        },
        "code": {
            "zh": "库位代码:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位代码",
            "placeholderEn": "Enter Loc. Code"
        },
        "lineNumber": {
            "zh": "动线号:",
            "en": "Line No.:",
            "placeholderZh": "请输入动线号",
            "placeholderEn": "Enter Line No."
        },
        "distanceToDock": {
            "zh": "与月台间距:",
            "en": "Dist. to Dock:",
            "placeholderZh": "请输入与出货月台的距离 (单位：米)",
            "placeholderEn": "Enter dist. to shipping dock (unit: m)"
        },
        "skuQty": {
            "zh": "最大SKU个数:",
            "en": "Max SKUs:",
            "placeholderZh": "请输入最大SKU个数",
            "placeholderEn": "Enter Max SKUs"
        },
        "batchNoQty": {
            "zh": "最大批次数:",
            "en": "Max Batches:",
            "placeholderZh": "请输入最大批次数",
            "placeholderEn": "Enter Max Batches"
        }
    },
    "base_wh_platform_list": {
        "platformName": {
            "zh": "月台名称:",
            "en": "PlatformName:",
            "placeholderZh": "请输入月台名称",
            "placeholderEn": "Enter Platform Name"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "warehouseId": {
            "zh": "仓库:",
            "en": "Whse.Code:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse. Code"
        },
        "platformCodeList": {
            "zh": "月台代码:",
            "en": "PlatformCode:",
            "placeholderZh": "请输入月台代码",
            "placeholderEn": "Enter Platform Code"
        },
        "platformCode": {
            "zh": "月台代码:",
            "en": "PlatformCode:",
            "placeholderZh": "请输入月台代码",
            "placeholderEn": "Enter Platform Code"
        },
        "warehouseCode": {
            "zh": "所属仓库:",
            "en": "BelongingWhse.:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse."
        },
        "startTime": {
            "zh": "开启时间:",
            "en": "Start Time:",
            "placeholderZh": "请选择开启时间",
            "placeholderEn": "Select Start Time"
        },
        "endTime": {
            "zh": "关闭时间:",
            "en": "End Time:",
            "placeholderZh": "请选择关闭时间",
            "placeholderEn": "Select End Time"
        },
        "weekdays": {
            "zh": "工作日:",
            "en": "Workdays:",
            "placeholderZh": "请选择工作日",
            "placeholderEn": "Select Workdays"
        },
        "maxCapacity": {
            "zh": "容纳车辆:",
            "en": "Veh. Capacity:",
            "placeholderZh": "请输入容纳车辆数量",
            "placeholderEn": "Enter Veh. Capacity"
        }
    },


    "base_wh_locationSizeType_list": {
        "name": {
            "zh": "名称:",
            "en": "Name:",
            "placeholderZh": "请输入名称",
            "placeholderEn": "Enter Name"
        },
        "code": {
            "zh": "代码:",
            "en": "Code:",
            "placeholderZh": "请输入代码",
            "placeholderEn": "Enter Code"
        },
        "length": {
            "zh": "长 (CM):",
            "en": "Length (CM):",
            "placeholderZh": "请输入长 (CM)",
            "placeholderEn": "Enter Length (CM)"
        },
        "width": {
            "zh": "宽 (CM):",
            "en": "Width (CM):",
            "placeholderZh": "请输入宽 (CM)",
            "placeholderEn": "Enter Width (CM)"
        },
        "height": {
            "zh": "高 (CM):",
            "en": "Height (CM):",
            "placeholderZh": "请输入高 (CM)",
            "placeholderEn": "Enter Height (CM)"
        },
        "volume": {
            "zh": "体积 (M³):",
            "en": "Volume (M³):",
            "placeholderZh": "系统自动计算",
            "placeholderEn": "Auto-Calculated by System"
        }
    },
    "base_wh_warehouse_list": {
        "typeId": {
            "zh": "类型:",
            "en": "Type:",
            "placeholderZh": "请选择类型",
            "placeholderEn": "Select Type"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "code": {
            "zh": "仓库代码:",
            "en": "Whse.Code:",
            "placeholderZh": "请输入仓库代码",
            "placeholderEn": "Enter Whse. Code"
        },
        "name": {
            "zh": "仓库名称:",
            "en": "Whse.Name:",
            "placeholderZh": "请输入仓库名称",
            "placeholderEn": "Enter Whse. Name"
        },
        "cargoSizeId": {
            "zh": "货型:",
            "en": "Cargo Size:",
            "placeholderZh": "请选择货型",
            "placeholderEn": "Select Cargo Size"
        },
        "isDanger": {
            "zh": "危险品仓:",
            "en": "DangerousWhse.:",
            "placeholderZh": "请选择是否危险品仓",
            "placeholderEn": "Select if Dangerous Goods Whse."
        },
        "squareMeter": {
            "zh": "平方米:",
            "en": "Sq. Meters:",
            "placeholderZh": "请输入平方米数",
            "placeholderEn": "Enter Sq. Meters"
        },
        "timeZoneId": {
            "zh": "时区:",
            "en": "Time Zone:",
            "placeholderZh": "请选择时区",
            "placeholderEn": "Select Time Zone"
        },
        "countryCode": {
            "zh": "国家:",
            "en": "Country:",
            "placeholderZh": "请选择国家",
            "placeholderEn": "Select Country"
        },
        "province": {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "请输入省/州",
            "placeholderEn": "Enter Province"
        },
        "city": {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "请输入城市",
            "placeholderEn": "Enter City"
        },
        "county": {
            "zh": "区:",
            "en": "District:",
            "placeholderZh": "请输入区",
            "placeholderEn": "Enter District"
        },
        "addressLine1": {
            "zh": "街道地址:",
            "en": "Street Addr.:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter Street Addr."
        },
        "addressLine2": {
            "zh": "街道地址 2:",
            "en": "Street Addr. 2:",
            "placeholderZh": "请输入街道地址 2",
            "placeholderEn": "Enter Street Addr. 2"
        },
        "postalCode": {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "请输入邮编",
            "placeholderEn": "Enter Postal Code"
        },
        "receiverName": {
            "zh": "收件人名:",
            "en": "Recipient Name:",
            "placeholderZh": "请输入收件人名",
            "placeholderEn": "Enter Recipient Name"
        },
        "phone": {
            "zh": "收件人电话:",
            "en": "Recipient Tel:",
            "placeholderZh": "请输入收件人电话",
            "placeholderEn": "Enter Recipient Tel"
        }
    },
    "base_wh_zone_list": {
        "typeId": {
            "zh": "库区类型:",
            "en": "Zone Type:",
            "placeholderZh": "请选择库区类型",
            "placeholderEn": "Select Zone Type"
        },
        "warehouseCode": {
            "zh": "仓库:",
            "en": "Whse.:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse."
        },
        "code": {
            "zh": "分区代码:",
            "en": "Zone Code:",
            "placeholderZh": "请输入分区代码",
            "placeholderEn": "Enter Zone Code"
        },
        "name": {
            "zh": "分区名称:",
            "en": "Zone Name:",
            "placeholderZh": "请输入分区名称",
            "placeholderEn": "Enter Zone Name"
        }
    },
    "instock_appointment_inAppointment_list": {
        "inOrderNo": {
            "zh": "入库单号:",
            "en": "Inb. Order No:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Order No"
        },
        "appointmentTypeId": {
            "zh": "预约类型:",
            "en": "Appt. Type:",
            "placeholderZh": "请选择预约类型",
            "placeholderEn": "Select Appt. Type"
        },
        "isLateCheckin": {
            "zh": "是否迟到:",
            "en": "Is Late:",
            "placeholderZh": "请选择是否迟到",
            "placeholderEn": "Select Is Late"
        },
        "deliveryTypeId": {
            "zh": "送仓类型:",
            "en": "Delivery Type:",
            "placeholderZh": "请选择送仓类型",
            "placeholderEn": "Select Delivery Type"
        },
        "warehouseId": {
            "zh": "仓库:",
            "en": "Whse.:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse."
        },
        "platformCode": {
            "zh": "月台代码:",
            "en": "Platform:",
            "placeholderZh": "请选择月台代码",
            "placeholderEn": "Select Platform"
        },
        "appointmentNoList": {
            "zh": "预约单号:",
            "en": "Appt. No.:",
            "placeholderZh": "请输入预约单号",
            "placeholderEn": "Enter Appt. No."
        },
        "date": {
            "zh": "预约日期:",
            "en": "Appt. Date:",
            "placeholderZh": "请选择预约日期",
            "placeholderEn": "Select Appt. Date"
        },
        "expectedStartTime": {
            "zh": "预约到仓时间:",
            "en": "Exp. Arr. Time:",
            "placeholderZh": "请选择预约到仓时间",
            "placeholderEn": "Select Exp. Arr. Time"
        },
        "contactPerson": {
            "zh": "联系人:",
            "en": "Contact:",
            "placeholderZh": "请输入联系人",
            "placeholderEn": "Enter Contact"
        },
        "contactPhone": {
            "zh": "联系电话:",
            "en": "Contact Tel:",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Enter Contact Tel"
        },
        "carNumber": {
            "zh": "车牌号:",
            "en": "Plate No:",
            "placeholderZh": "请输入车牌号",
            "placeholderEn": "Enter Plate No"
        },
        "containerType": {
            "zh": "货柜型号:",
            "en": "Container Type:",
            "placeholderZh": "请选择货柜型号",
            "placeholderEn": "Select Container Type"
        },
        "containerNumber": {
            "zh": "货柜号:",
            "en": "Container No:",
            "placeholderZh": "请输入货柜号",
            "placeholderEn": "Enter Container No"
        },
        "boxQty": {
            "zh": "计划箱数:",
            "en": "Planned Boxes:",
            "placeholderZh": "请输入计划箱数",
            "placeholderEn": "Enter Planned Boxes"
        },
        "skuQty": {
            "zh": "计划SKU个数:",
            "en": "Planned SKUs:",
            "placeholderZh": "请输入计划SKU个数",
            "placeholderEn": "Enter Planned SKUs"
        },
        "goodsQty": {
            "zh": "计划商品件数:",
            "en": "Planned Goods Qty:",
            "placeholderZh": "请输入计划商品件数",
            "placeholderEn": "Enter Planned Goods Qty"
        }
    },



    "instock_op_inReceipt_list": {
        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "receiptMethodId": {
            "zh": "收货方式:",
            "en": "Receipt Method:",
            "placeholderZh": "请输入收货方法",
            "placeholderEn": "Enter Receipt Method"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "boxNoList": {
            "zh": "箱号:",
            "en": "Box No.:",
            "placeholderZh": "请输入箱号",
            "placeholderEn": "Enter Box No."
        }
    },
    "instock_op_inShelf_list": {
        "qualityId": {
            "zh": "品质:",
            "en": "Quality:",
            "placeholderZh": "请选择品质",
            "placeholderEn": "Select Quality"
        },
        "inShelfMethodId": {
            "zh": "上架方法:",
            "en": "Shelf Method:",
            "placeholderZh": "请选择上架方法",
            "placeholderEn": "Select Shelf Method"
        },
        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入 SKU",
            "placeholderEn": "Enter SKU"
        },
        "boxNoList": {
            "zh": "箱号:",
            "en": "Box No.:",
            "placeholderZh": "请输入箱号",
            "placeholderEn": "Enter Box No."
        },
        "locationCodeList": {
            "zh": "库位号:",
            "en": "Loc. No.:",
            "placeholderZh": "请输入库位号",
            "placeholderEn": "Enter Loc. No."
        }
    },
    "instock_return_returnOrder_list": {
        "orderNoList": {
            "zh": "退件单号:",
            "en": "Return Ord. No.:",
            "placeholderZh": "请输入退件单号",
            "placeholderEn": "Enter Return Ord. No."
        },
        "trackingNo": {
            "zh": "跟踪单号:",
            "en": "Tracking No.:",
            "placeholderZh": "请输入跟踪单号",
            "placeholderEn": "Enter Tracking No."
        },
        "sourceOrderNoList": {
            "zh": "出库单号:",
            "en": "Issue No.:",
            "placeholderZh": "请输入原出库单号",
            "placeholderEn": "Enter Issue No."
        },
        "typeId": {
            "zh": "退件类型:",
            "en": "Return Type:",
            "placeholderZh": "请选择退件类型",
            "placeholderEn": "Select Return Type"
        },
        "statusId": {
            "zh": "处理状态:",
            "en": "Status:",
            "placeholderZh": "请选择处理状态",
            "placeholderEn": "Select Status"
        },
        "isCheck": {
            "zh": "是否清点:",
            "en": "Is Checked:",
            "placeholderZh": "请选择是否清点",
            "placeholderEn": "Select Is Checked"
        }
    },
    "instock_returned_returnClaim_list": {
        "carrierCode": {
            "zh": "承运商:",
            "en": "Carrier Code:",
            "placeholderZh": "请选择承运商代码",
            "placeholderEn": "Select Carrier Code"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "trackingNoList": {
            "zh": "物流单号:",
            "en": "Tracking No.:",
            "placeholderZh": "请输入物流单号",
            "placeholderEn": "Enter Tracking No."
        },
        "orderNo": {
            "zh": "退件单号:",
            "en": "Return Ord. No.:",
            "placeholderZh": "请输入退件单号",
            "placeholderEn": "Enter Return Ord. No."
        },
        "orderNoList": {
            "zh": "退件单号:",
            "en": "Return Ord. No.s:",
            "placeholderZh": "请输入退件单号",
            "placeholderEn": "Enter Return Ord. No.s"
        }
    },
    "instock_order_inOrder_list": {
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderZh": "请选择公司",
            "placeholderEn": "Select Company"
        },
        "warehouseCode": {
            "zh": "仓库:",
            "en": "Whse.:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse. Code"
        },
        "firstLeg": {
            "zh": "头程类型:",
            "en": "1st Leg Type:",
            "placeholderZh": "请选择头程类型",
            "placeholderEn": "Select 1st Leg Type"
        },
        "business": {
            "zh": "业务类型:",
            "en": "Biz Type:",
            "placeholderZh": "请选择业务类型",
            "placeholderEn": "Select Biz Type"
        },
        "type": {
            "zh": "入库类型:",
            "en": "Inb. Type:",
            "placeholderZh": "请选择入库单类型",
            "placeholderEn": "Select Inb. Ord. Type"
        },
        "arrivalType": {
            "zh": "到仓类型:",
            "en": "Arrival Type:",
            "placeholderZh": "请选择到货类型",
            "placeholderEn": "Select Arrival Type"
        },
        "orderNo": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "trackingNo1": {
            "zh": "头程单号:",
            "en": "1st No.:",
            "placeholderZh": "请输入头程单号",
            "placeholderEn": "Enter1st Leg Track. No."
        },
        "trackingNo2": {
            "zh": "尾程单号:",
            "en": "Last No.",
            "placeholderZh": "请输入尾程单号",
            "placeholderEn": "Enter Last Leg Track. No."
        },
        "containerNumber": {
            "zh": "货柜号:",
            "en": "Container No.:",
            "placeholderZh": "请输入货柜号",
            "placeholderEn": "Enter Container No."
        },
        "containerType": {
            "zh": "货柜型号:",
            "en": "Container Type:",
            "placeholderZh": "请选择货柜型号",
            "placeholderEn": "Select Container Type"
        },
        "totalNo": {
            "zh": "总单号:",
            "en": "Total No.:",
            "placeholderZh": "请输入总单号",
            "placeholderEn": "Enter Total No."
        },
        "sku": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "hasRemark": {
            "zh": "是否备注:",
            "en": "Has Remark:",
            "placeholderZh": "请选择是否有备注",
            "placeholderEn": "Select Has Remark"
        },
        "calculateFeeStatus": {
            "zh": "计费状态:",
            "en": "Billing Status:",
            "placeholderZh": "请选择计费状态",
            "placeholderEn": "Select Billing Status"
        },
        "receiptMethodId": {
            "zh": "收货方式:",
            "en": "Receipt Method:",
            "placeholderZh": "请选择收货方式",
            "placeholderEn": "Select Receipt Method"
        }
    },
    "outstock_order_outOrder_list": {
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderZh": "请选择公司",
            "placeholderEn": "Select Company"
        },
        "warehouseCode": {
            "zh": "仓库:",
            "en": "Whse.:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse. Code"
        },
        "orderNo": {
            "zh": "出库单号:",
            "en": "Outb. Ord. No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Enter Outb. Ord. No."
        },
        "customerOrderNo": {
            "zh": "客户单号:",
            "en": "Cust. Ord. No.:",
            "placeholderZh": "请输入客户订单号",
            "placeholderEn": "Enter Cust. Ord. No."
        },
        "ecOrderNo": {
            "zh": "电商单号:",
            "en": "E-commerce Order No.:",
            "placeholderZh": "请输入电商订单号",
            "placeholderEn": "Enter E-commerce Order No."
        },
        "ecPlatform": {
            "zh": "电商平台:",
            "en": "E-commerce Platform:",
            "placeholderZh": "请选择电商平台",
            "placeholderEn": "Select E-commerce Platform"
        },
        "trackingNo": {
            "zh": "跟踪单号:",
            "en": "Tracking No.:",
            "placeholderZh": "请输入跟踪单号",
            "placeholderEn": "Please enter Tracking No."
        },
        "countryCode": {
            "zh": "国家:",
            "en": "Country:",
            "placeholderZh": "请选择国家",
            "placeholderEn": "Select Country"
        },
        "shipwayTypeId": {
            "zh": "运输方式:",
            "en": "Shipping Method Type:",
            "placeholderZh": "请选择运输方式",
            "placeholderEn": "Select Shipping Method Type"
        },
        "carrierCode": {
            "zh": "承运商:",
            "en": "Carrier:",
            "placeholderZh": "请选择承运商",
            "placeholderEn": "Select Carrier"
        },
        "supplierId": {
            "zh": "服务商:",
            "en": "Supplier:",
            "placeholderZh": "请选择服务商",
            "placeholderEn": "Select Supplier"
        },
        "shipwayId": {
            "zh": "物流产品:",
            "en": "Logistics Product:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select Logistics Product"
        },
        "supplierPushStatusId": {
            "zh": "运单就绪:",
            "en": "Waybill Ready:",
            "placeholderZh": "请选择运单就绪状态",
            "placeholderEn": "Select Waybill Ready Status"
        },
        "apiTypeId": {
            "zh": "接口类型:",
            "en": "API Type:",
            "placeholderZh": "请选择接口类型",
            "placeholderEn": "Select API Type"
        },
        "createWay": {
            "zh": "创建方式:",
            "en": "Creation Method:",
            "placeholderZh": "请选择创建方式",
            "placeholderEn": "Select Creation Method"
        },
        "ecSaleAccount": {
            "zh": "店铺账号:",
            "en": "Store Account:",
            "placeholderZh": "请输入店铺账号",
            "placeholderEn": "Please enter Store Account"
        },
        "outWaveNo": {
            "zh": "波次号:",
            "en": "Wave No.:",
            "placeholderZh": "请输入波次号",
            "placeholderEn": "Please enter Wave No."
        },
        "fuzzySearch": {
            "zh": "模糊查询:",
            "en": "Fuzzy Search:",
            "placeholderZh": "收件人名/电话",
            "placeholderEn": "Recipient Name/Tel"
        },
        "zoneCode": {
            "zh": "库区:",
            "en": "Zone Code:",
            "placeholderZh": "请选择库区",
            "placeholderEn": "Select Zone Code"
        },
        "locationCode": {
            "zh": "库位:",
            "en": "Location Code:",
            "placeholderZh": "请输入库位",
            "placeholderEn": "Please enter Location Code"
        },
        "sku": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Please enter SKU"
        },
        "platformSku": {
            "zh": "平台SKU:",
            "en": "Platform SKU:",
            "placeholderZh": "请输入平台SKU",
            "placeholderEn": "Please enter Platform SKU"
        },
        "pickupCode": {
            "zh": "自提代码:",
            "en": "Pickup Code:",
            "placeholderZh": "请输入自提代码",
            "placeholderEn": "Please enter Pickup Code"
        },
        "skuQty": {
            "zh": "SKU个数:",
            "en": "SKU Quantity:",
            "placeholderZh": "请选择SKU个数",
            "placeholderEn": "Please enter SKU Quantity"
        },
        "productQty": {
            "zh": "商品个数:",
            "en": "Product Quantity:",
            "placeholderZh": "请选择商品个数",
            "placeholderEn": "Please enter Product Quantity"
        },
        "isPrint": {
            "zh": "打印运单:",
            "en": "Print Waybill:",
            "placeholderZh": "请选择是否打印运单",
            "placeholderEn": "Select Print Waybill"
        },
        "isPremium": {
            "zh": "是否保险:",
            "en": "Insured:",
            "placeholderZh": "请选择是否保险",
            "placeholderEn": "Select Insured"
        },
        "isShortage": {
            "zh": "是否缺货:",
            "en": "Out of Stock:",
            "placeholderZh": "请选择是否缺货",
            "placeholderEn": "Select Out of Stock"
        },
        "holdUpStatus": {
            "zh": "拦截状态:",
            "en": "Intercept Status:",
            "placeholderZh": "请选择拦截状态",
            "placeholderEn": "Select Intercept Status"
        },
        "calculateFeeStatus": {
            "zh": "计费状态:",
            "en": "Billing Status:",
            "placeholderZh": "请选择计费状态",
            "placeholderEn": "Select Billing Status"
        },
        "printTime": {
            "zh": "打印时间:",
            "en": "Print Time:",
            "placeholderZh": "请选择打印时间",
            "placeholderEn": "Please Select Print Time"
        },
        "createWaveTime": {
            "zh": "波次时间:",
            "en": "Wave Creation Time:",
            "placeholderZh": "请选择创建波次时间",
            "placeholderEn": "Please Select Wave Creation Time"
        },
        "outShelfTimeEndTime": {
            "zh": "截止时间:",
            "en": "Outbound Deadline Time:",
            "placeholderZh": "请选择出库截止时间",
            "placeholderEn": "Please Select Outbound Deadline Time"
        },
        "shippedTime": {
            "zh": "发货时间:",
            "en": "Shipped Time:",
            "placeholderZh": "请选择发货时间",
            "placeholderEn": "Please Select Shipped Time"
        },
        "updateTime": {
            "zh": "更新时间:",
            "en": "Update Time:",
            "placeholderZh": "请选择更新时间",
            "placeholderEn": "Please Select Update Time"
        },
        "remark": {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderZh": "请输入备注",
            "placeholderEn": "Please enter Remark"
        },
        "fileType": {
            "zh": "附件类型:",
            "en": "File Type:",
            "placeholderZh": "请选择附件类型",
            "placeholderEn": "Please Select File Type"
        },
        "fileName": {
            "zh": "附件名称:",
            "en": "File Name:",
            "placeholderZh": "请输入附件名称",
            "placeholderEn": "Please enter File Name"
        },
        "waybillTypeId": {
            "zh": "申请类型:",
            "en": "Apply Type:",
            "placeholderZh": "请选择申请类型",
            "placeholderEn": "Please Select Apply Type"
        },
        "pickupTime": {
            "zh": "自提时间:",
            "en": "Pickup Time:",
            "placeholderZh": "请选择自提时间",
            "placeholderEn": "Please Select Pickup Time"
        },
        "isPhoneReserved": {
            "zh": "预约派件:",
            "en": "Reserved Delivery:",
            "placeholderZh": "请选择预约派件",
            "placeholderEn": "Please Select Reserved Delivery"
        },
        "palletSizeCm": {
            "zh": "托盘尺寸(CM):",
            "en": "Pallet Size(CM):",
            "placeholderZh": "请输入托盘尺寸",
            "placeholderEn": "Please enter Pallet Size"
        },
        "palletQty": {
            "zh": "托盘数量:",
            "en": "Pallet Quantity:",
            "placeholderZh": "请输入托盘数量",
            "placeholderEn": "Please enter Pallet Quantity"
        },
        "palletWeight": {
            "zh": "托盘重量(KG):",
            "en": "Pallet Weight(KG):",
            "placeholderZh": "请输入托盘重量",
            "placeholderEn": "Please enter Pallet Weight"
        },
        "typeId": {
            "zh": "问题类型:",
            "en": "Problem Type:",
            "placeholderZh": "请选择问题类型",
            "placeholderEn": "Select Problem Type"
        },
        "msg": {
            "zh": "问题描述:",
            "en": "Problem Description:",
            "placeholderZh": "请输入问题描述",
            "placeholderEn": "Enter Problem Description"
        },
        "waybillTypeId": {
            "zh": "运单类型:",
            "en": "Waybill Type:",
            "placeholderZh": "请选择运单类型",
            "placeholderEn": "Select Waybill Type"
        }
    },
    "outstock_order_outOrderHoldup_list": {
        "outOrder": {
            "zh": "出库单号:",
            "en": "Outb. Ord. No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Enter Outb. Ord. No."
        },
        "holdUpStatus": {
            "zh": "拦截状态:",
            "en": "Hold Up Status:",
            "placeholderZh": "请选择拦截状态",
            "placeholderEn": "Select Hold Up Status"
        },
        "createdTimeBegin": {
            "zh": "申请时间:",
            "en": "Created Time:",
            "placeholderZh": "请选择申请时间",
            "placeholderEn": "Select Created Time"
        },
    },
    "outstock_order_outOrderProblem_list": {
        "outOrder": {
            "zh": "出库单号:",
            "en": "Outb. Ord. No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Enter Outb. Ord. No."
        },
        "trackingNo": {
            "zh": "跟踪单号:",
            "en": "Tracking No.:",
            "placeholderZh": "请输入跟踪单号",
            "placeholderEn": "Enter Tracking No."
        },
        "status": {
            "zh": "问题状态:",
            "en": "Problem Status:",
            "placeholderZh": "请选择问题状态",
            "placeholderEn": "Select Problem Status"
        },
        "typeId": {
            "zh": "问题类型:",
            "en": "Problem Type:",
            "placeholderZh": "请选择问题类型",
            "placeholderEn": "Select Problem Type"
        },
        "msg": {
            "zh": "问题描述:",
            "en": "Problem Description:",
            "placeholderZh": "请输入问题描述",
            "placeholderEn": "Enter Problem Description"
        }
    },
    "outstock_wave_outWave_list": {
        "waveNo": {
            "zh": "波次号:",
            "en": "Wave No.:",
            "placeholderZh": "请输入波次号",
            "placeholderEn": "Enter Wave No."
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "waveTypeId": {
            "zh": "波次类型:",
            "en": "Wave Type:",
            "placeholderZh": "请选择波次类型",
            "placeholderEn": "Select Wave Type"
        },
        "taskNo": {
            "zh": "任务号:",
            "en": "Task No.:",
            "placeholderZh": "请输入任务号",
            "placeholderEn": "Enter Task No."
        },
        "name": {
            "zh": "姓名:",
            "en": "Name:",
            "placeholderZh": "请输入姓名",
            "placeholderEn": "Enter Name"
        },
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "请输入用户代码",
            "placeholderEn": "Enter User Code"
        },
        "allocatedEmployeeNum": {
            "zh": "拣货员:",
            "en": "Picking Employee:",
            "placeholderZh": "请输入拣货员工号",
            "placeholderEn": "Enter Picking Employee No."
        },
        "allocatedStatus": {
            "zh": "分配状态:",
            "en": "Allocated Status:",
            "placeholderZh": "请选择分配状态",
            "placeholderEn": "Select Allocated Status"
        }
    },
    "product_shipway_carrier_list": {
        "name": {
            "zh": "承运名称:",
            "en": "Carrier Name:",
            "placeholderZh": "请输入承运名称",
            "placeholderEn": "Enter Carrier Name"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "codeList": {
            "zh": "承运代码:",
            "en": "Carrier Code:",
            "placeholderZh": "请输入承运商代码",
            "placeholderEn": "Enter Carrier Code"
        },
        "code": {
            "zh": "承运商代码:",
            "en": "Carrier Code:",
            "placeholderZh": "请输入承运商代码",
            "placeholderEn": "Enter Carrier Code"
        },
        "serviceCode": {
            "zh": "服务代码:",
            "en": "Service Code:",
            "placeholderZh": "请输入服务代码",
            "placeholderEn": "Enter Service Code"
        },
        "serviceName": {
            "zh": "服务名称:",
            "en": "Service Name:",
            "placeholderZh": "请输入服务名称",
            "placeholderEn": "Enter Service Name"
        },
        "serviceStatusId": {
            "zh": "服务状态:",
            "en": "Service Status:",
            "placeholderZh": "请选择服务状态",
            "placeholderEn": "Select Service Status"
        },
        "serviceCode": {
            "zh": "服务代码:",
            "en": "Service Code:",
            "placeholderZh": "请输入服务代码",
            "placeholderEn": "Enter Service Code"
        },
        "serviceName": {
            "zh": "服务名称:",
            "en": "Service Name:",
            "placeholderZh": "请输入服务名称",
            "placeholderEn": "Enter Service Name"
        }
    },
    "product_shipway_shipwaySender_list": {
        'addressLine1': {
            "zh": "街道地址1:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'addressLine2': {
            "zh": "街道地址2:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'city': {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "请输入城市",
            "placeholderEn": "Enter city"
        },
        'company': {
            "zh": "公司名:",
            "en": "Company:",
            "placeholderZh": "请输入公司名称",
            "placeholderEn": "Enter company name"
        },
        'configTypeId': {
            "zh": "配置类型:",
            "en": "Config Type:",
            "placeholderZh": "请选择配置类型",
            "placeholderEn": "Select config type"
        },
        'countryCode': {
            "zh": "国家代码:",
            "en": "Country Code:",
            "placeholderZh": "请选择国家代码",
            "placeholderEn": "Select country code"
        },
        'county': {
            "zh": "区/县:",
            "en": "County:",
            "placeholderZh": "请输入区/县",
            "placeholderEn": "Enter county"
        },
        'email': {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱地址",
            "placeholderEn": "Enter email address"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'identityNumber': {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        'name': {
            "zh": "联系人名:",
            "en": "Contact Name:",
            "placeholderZh": "请输入联系人姓名",
            "placeholderEn": "Enter contact name"
        },
        'phoneNumber1': {
            "zh": "电话1:",
            "en": "Phone:",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Enter phone number"
        },
        'phoneNumber2': {
            "zh": "电话2:",
            "en": "Phone2:",
            "placeholderZh": "请输入备用电话",
            "placeholderEn": "Enter alternative phone"
        },
        'postalCode': {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "请输入邮政编码",
            "placeholderEn": "Enter postal code"
        },
        'province': {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "请输入省/州",
            "placeholderEn": "Enter province"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'remark': {
            "zh": "地址备注:",
            "en": "Address Remarks:",
            "placeholderZh": "请输入地址备注",
            "placeholderEn": "Enter Address Remarks"
        },
        'shipwayCode': {
            "zh": "物流产品:",
            "en": "Shipway Code:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        'warehouseId': {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select warehouse"
        },
        'warehouseId': {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select warehouse"
        },
        'shipwayId': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        }
    },
    "base_basic_address_list": {
        'addressCode': {
            "zh": "地址代码:",
            "en": "addressCode:",
            "placeholderZh": "请输入地址代码",
            "placeholderEn": "Enter addressCode"
        },
        'addressLine1': {
            "zh": "街道地址1:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'addressLine2': {
            "zh": "街道地址2:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'city': {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "请输入城市",
            "placeholderEn": "Enter city"
        },
        'company': {
            "zh": "公司名:",
            "en": "Company:",
            "placeholderZh": "请输入公司名称",
            "placeholderEn": "Enter company name"
        },
        'typeId': {
            "zh": "地址类型:",
            "en": "Address Type:",
            "placeholderZh": "请选择地址类型",
            "placeholderEn": "Select Address Type"
        },
        'countryCode': {
            "zh": "国家代码:",
            "en": "Country Code:",
            "placeholderZh": "请选择国家代码",
            "placeholderEn": "Select country code"
        },
        'county': {
            "zh": "区/县:",
            "en": "County:",
            "placeholderZh": "请输入区/县",
            "placeholderEn": "Enter county"
        },
        'email': {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱地址",
            "placeholderEn": "Enter email address"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'identityNumber': {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        'name': {
            "zh": "联系人名:",
            "en": "Contact Name:",
            "placeholderZh": "请输入联系人姓名",
            "placeholderEn": "Enter contact name"
        },
        'phoneNumber1': {
            "zh": "电话1:",
            "en": "Phone:",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Enter phone number"
        },
        'phoneNumber2': {
            "zh": "电话2:",
            "en": "Phone2:",
            "placeholderZh": "请输入备用电话",
            "placeholderEn": "Enter alternative phone"
        },
        'postalCode': {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "请输入邮政编码",
            "placeholderEn": "Enter postal code"
        },
        'province': {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "请输入省/州",
            "placeholderEn": "Enter province"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'remark': {
            "zh": "地址备注:",
            "en": "Address Remarks:",
            "placeholderZh": "请输入地址备注",
            "placeholderEn": "Enter Address Remarks"
        },
        'warehouseId': {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select warehouse"
        },
        'shipwayId': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        }
    },
    "outstock_order_outOrder_add": {
        'addressCode': {
            "zh": "地址代码:",
            "en": "addressCode:",
            "placeholderZh": "请输入地址代码",
            "placeholderEn": "Enter addressCode"
        },
        'addressLine1': {
            "zh": "街道地址1:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'addressLine2': {
            "zh": "街道地址2:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'city': {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "请输入城市",
            "placeholderEn": "Enter city"
        },
        'company': {
            "zh": "公司名:",
            "en": "Company:",
            "placeholderZh": "请输入公司名称",
            "placeholderEn": "Enter company name"
        },
        'typeId': {
            "zh": "出库单类型:",
            "en": "Outstock Type:",
            "placeholderZh": "请选择出库单类型",
            "placeholderEn": "Select Outstock Type"
        },
        'countryCode': {
            "zh": "国家代码:",
            "en": "Country Code:",
            "placeholderZh": "请选择国家代码",
            "placeholderEn": "Select country code"
        },
        'county': {
            "zh": "区/县:",
            "en": "County:",
            "placeholderZh": "请输入区/县",
            "placeholderEn": "Enter county"
        },
        'email': {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱地址",
            "placeholderEn": "Enter email address"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'identityNumber': {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        'name': {
            "zh": "联系人名:",
            "en": "Contact Name:",
            "placeholderZh": "请输入联系人姓名",
            "placeholderEn": "Enter contact name"
        },
        'phoneNumber1': {
            "zh": "电话1:",
            "en": "Phone:",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Enter phone number"
        },
        'phoneNumber2': {
            "zh": "电话2:",
            "en": "Phone2:",
            "placeholderZh": "请输入备用电话",
            "placeholderEn": "Enter alternative phone"
        },
        'postalCode': {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "请输入邮政编码",
            "placeholderEn": "Enter postal code"
        },
        'province': {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "请输入省/州",
            "placeholderEn": "Enter province"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'warehouseId': {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select warehouse"
        },
        'shipwayId': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 客户订单号（输入框）
        'customerOrderNo': {
            "zh": "客户订单号:",
            "en": "Customer Order No.:",
            "placeholderZh": "请输入客户订单号",
            "placeholderEn": "Enter customer order no."
        },
        // 状态（下拉框）
        'statusId': {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态代码",
            "placeholderEn": "Select status code"
        },
        // 电商平台（下拉框）
        'ecPlatform': {
            "zh": "电商平台:",
            "en": "E-commerce Platform:",
            "placeholderZh": "请选择电商平台",
            "placeholderEn": "Select e-commerce platform"
        },
        // 电商订单号（输入框）
        'ecOrderNo': {
            "zh": "电商订单号:",
            "en": "E-commerce Order No.:",
            "placeholderZh": "请输入电商订单号",
            "placeholderEn": "Enter e-commerce order no."
        },
        // 电商店铺账号（输入框）
        'ecSaleAccount': {
            "zh": "电商店铺账号:",
            "en": "E-commerce Store Account:",
            "placeholderZh": "请输入电商店铺账号",
            "placeholderEn": "Enter e-commerce store account"
        },
        // 业务类型（下拉框）
        'businessId': {
            "zh": "业务类型:",
            "en": "Business Type:",
            "placeholderZh": "请选择业务类型",
            "placeholderEn": "Select business type"
        },
        // 运输方式（下拉框）
        'shipwayTypeId': {
            "zh": "运输方式:",
            "en": "Shipping Method:",
            "placeholderZh": "请选择运输方式",
            "placeholderEn": "Select shipping method"
        },
        // 到仓类型（下拉框）
        'arrivalTypeId': {
            "zh": "到仓类型:",
            "en": "Arrival Type:",
            "placeholderZh": "请选择到仓类型",
            "placeholderEn": "Select arrival type"
        },
        // 物流产品代码（下拉框）
        'shipwayCode': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 物流品牌代码（下拉框）
        'carrierCode': {
            "zh": "承运商:",
            "en": "Carrier:",
            "placeholderZh": "请选择承运商",
            "placeholderEn": "Select carrier"
        },
        // 承运商服务
        'carrierServiceCode': {
            "zh": "承运商服务:",
            "en": "Carrier Service:",
            "placeholderZh": "请选择承运商服务",
            "placeholderEn": "Select carrier service"
        },
        // 接口id（下拉框）
        'apiId': {
            "zh": "接口id:",
            "en": "API ID:",
            "placeholderZh": "请选择接口",
            "placeholderEn": "Select API"
        },
        // 接口类型（下拉框）
        'apiTypeId': {
            "zh": "接口类型:",
            "en": "API Type:",
            "placeholderZh": "请选择接口类型",
            "placeholderEn": "Select API type"
        },
        // 承保金额币种（下拉框）
        'insuranceCurrency': {
            "zh": "承保金额币种:",
            "en": "Insurance Currency:",
            "placeholderZh": "请选择承保金额币种",
            "placeholderEn": "Select insurance currency"
        },
        // 承保金额（输入框，带数字校验）
        'insurancePremium': {
            "zh": "承保金额:",
            "en": "Insurance Premium:",
            "placeholderZh": "请输入承保金额",
            "placeholderEn": "Enter insurance premium"
        },
        // SKU个数（输入框，数字类型）
        'skuQty': {
            "zh": "SKU个数:",
            "en": "SKU Qty.:",
            "placeholderZh": "请输入SKU个数",
            "placeholderEn": "Enter SKU quantity"
        },
        'remark': {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderZh": "请输入备注",
            "placeholderEn": "Enter remark"
        },
        "senderName": {
            "zh": "发件人:",
            "en": "Sender:",
            "placeholderZh": "请输入发件人",
            "placeholderEn": "Enter sender"
        },
        "senderCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "senderIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "senderPhone1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "senderPhone2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "senderEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverName": {
            "zh": "收件人:",
            "en": "Receiver:",
            "placeholderZh": "请输入收件人",
            "placeholderEn": "Enter receiver"
        },
        "receiverCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "receiverIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "receiverPhoneNumber1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "receiverPhoneNumber2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "receiverEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverAddressType": {
            "zh": "地址类型:",
            "en": "Address Type:",
            "placeholderZh": "请选择地址类型",
            "placeholderEn": "Select address type"
        },
        "receiverIsFbaAddress": {
            "zh": "预设FBA地址:",
            "en": "Preset FBA Address:",
            "placeholderZh": "选择是否为预设FBA地址",
            "placeholderEn": "Select whether it's a preset FBA address"
        },
        "receiverIsAvis": {
            "zh": "电话预约:",
            "en": "Phone Appointment:",
            "placeholderZh": "选择是否需要电话预约",
            "placeholderEn": "Select whether phone appointment is needed"
        }
    },
    "outstock_order_outOrder_copyAdd": {
        'addressCode': {
            "zh": "地址代码:",
            "en": "addressCode:",
            "placeholderZh": "请输入地址代码",
            "placeholderEn": "Enter addressCode"
        },
        'addressLine1': {
            "zh": "街道地址1:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'addressLine2': {
            "zh": "街道地址2:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'city': {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "请输入城市",
            "placeholderEn": "Enter city"
        },
        'company': {
            "zh": "公司名:",
            "en": "Company:",
            "placeholderZh": "请输入公司名称",
            "placeholderEn": "Enter company name"
        },
        'typeId': {
            "zh": "出库单类型:",
            "en": "Outstock Type:",
            "placeholderZh": "请选择出库单类型",
            "placeholderEn": "Select Outstock Type"
        },
        'countryCode': {
            "zh": "国家代码:",
            "en": "Country Code:",
            "placeholderZh": "请选择国家代码",
            "placeholderEn": "Select country code"
        },
        'county': {
            "zh": "区/县:",
            "en": "County:",
            "placeholderZh": "请输入区/县",
            "placeholderEn": "Enter county"
        },
        'email': {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱地址",
            "placeholderEn": "Enter email address"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'identityNumber': {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        'name': {
            "zh": "联系人名:",
            "en": "Contact Name:",
            "placeholderZh": "请输入联系人姓名",
            "placeholderEn": "Enter contact name"
        },
        'phoneNumber1': {
            "zh": "电话1:",
            "en": "Phone:",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Enter phone number"
        },
        'phoneNumber2': {
            "zh": "电话2:",
            "en": "Phone2:",
            "placeholderZh": "请输入备用电话",
            "placeholderEn": "Enter alternative phone"
        },
        'postalCode': {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "请输入邮政编码",
            "placeholderEn": "Enter postal code"
        },
        'province': {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "请输入省/州",
            "placeholderEn": "Enter province"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'warehouseId': {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select warehouse"
        },
        'shipwayId': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 客户订单号（输入框）
        'customerOrderNo': {
            "zh": "客户订单号:",
            "en": "Customer Order No.:",
            "placeholderZh": "请输入客户订单号",
            "placeholderEn": "Enter customer order no."
        },
        // 状态（下拉框）
        'statusId': {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态代码",
            "placeholderEn": "Select status code"
        },
        // 电商平台（下拉框）
        'ecPlatform': {
            "zh": "电商平台:",
            "en": "E-commerce Platform:",
            "placeholderZh": "请选择电商平台",
            "placeholderEn": "Select e-commerce platform"
        },
        // 电商订单号（输入框）
        'ecOrderNo': {
            "zh": "电商订单号:",
            "en": "E-commerce Order No.:",
            "placeholderZh": "请输入电商订单号",
            "placeholderEn": "Enter e-commerce order no."
        },
        // 电商店铺账号（输入框）
        'ecSaleAccount': {
            "zh": "电商店铺账号:",
            "en": "E-commerce Store Account:",
            "placeholderZh": "请输入电商店铺账号",
            "placeholderEn": "Enter e-commerce store account"
        },
        // 业务类型（下拉框）
        'businessId': {
            "zh": "业务类型:",
            "en": "Business Type:",
            "placeholderZh": "请选择业务类型",
            "placeholderEn": "Select business type"
        },
        // 运输方式（下拉框）
        'shipwayTypeId': {
            "zh": "运输方式:",
            "en": "Shipping Method:",
            "placeholderZh": "请选择运输方式",
            "placeholderEn": "Select shipping method"
        },
        // 到仓类型（下拉框）
        'arrivalTypeId': {
            "zh": "到仓类型:",
            "en": "Arrival Type:",
            "placeholderZh": "请选择到仓类型",
            "placeholderEn": "Select arrival type"
        },
        // 物流产品代码（下拉框）
        'shipwayCode': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 物流品牌代码（下拉框）
        'carrierCode': {
            "zh": "承运商:",
            "en": "Carrier:",
            "placeholderZh": "请选择承运商",
            "placeholderEn": "Select carrier"
        },
        // 承运商服务
        'carrierServiceCode': {
            "zh": "承运商服务:",
            "en": "Carrier Service:",
            "placeholderZh": "请选择承运商服务",
            "placeholderEn": "Select carrier service"
        },
        // 接口id（下拉框）
        'apiId': {
            "zh": "接口id:",
            "en": "API ID:",
            "placeholderZh": "请选择接口",
            "placeholderEn": "Select API"
        },
        // 接口类型（下拉框）
        'apiTypeId': {
            "zh": "接口类型:",
            "en": "API Type:",
            "placeholderZh": "请选择接口类型",
            "placeholderEn": "Select API type"
        },
        // 承保金额币种（下拉框）
        'insuranceCurrency': {
            "zh": "承保金额币种:",
            "en": "Insurance Currency:",
            "placeholderZh": "请选择承保金额币种",
            "placeholderEn": "Select insurance currency"
        },
        // 承保金额（输入框，带数字校验）
        'insurancePremium': {
            "zh": "承保金额:",
            "en": "Insurance Premium:",
            "placeholderZh": "请输入承保金额",
            "placeholderEn": "Enter insurance premium"
        },
        // SKU个数（输入框，数字类型）
        'skuQty': {
            "zh": "SKU个数:",
            "en": "SKU Qty.:",
            "placeholderZh": "请输入SKU个数",
            "placeholderEn": "Enter SKU quantity"
        },
        'remark': {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderZh": "请输入备注",
            "placeholderEn": "Enter remark"
        },
        "senderName": {
            "zh": "发件人:",
            "en": "Sender:",
            "placeholderZh": "请输入发件人",
            "placeholderEn": "Enter sender"
        },
        "senderCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "senderIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "senderPhone1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "senderPhone2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "senderEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverName": {
            "zh": "收件人:",
            "en": "Receiver:",
            "placeholderZh": "请输入收件人",
            "placeholderEn": "Enter receiver"
        },
        "receiverCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "receiverIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "receiverPhoneNumber1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "receiverPhoneNumber2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "receiverEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverAddressType": {
            "zh": "地址类型:",
            "en": "Address Type:",
            "placeholderZh": "请选择地址类型",
            "placeholderEn": "Select address type"
        },
        "receiverIsFbaAddress": {
            "zh": "预设FBA地址:",
            "en": "Preset FBA Address:",
            "placeholderZh": "选择是否为预设FBA地址",
            "placeholderEn": "Select whether it's a preset FBA address"
        },
        "receiverIsAvis": {
            "zh": "电话预约:",
            "en": "Phone Appointment:",
            "placeholderZh": "选择是否需要电话预约",
            "placeholderEn": "Select whether phone appointment is needed"
        }
    },
    "outstock_order_outOrder_upd": {
        'addressCode': {
            "zh": "地址代码:",
            "en": "addressCode:",
            "placeholderZh": "请输入地址代码",
            "placeholderEn": "Enter addressCode"
        },
        'addressLine1': {
            "zh": "街道地址1:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'addressLine2': {
            "zh": "街道地址2:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'city': {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "请输入城市",
            "placeholderEn": "Enter city"
        },
        'company': {
            "zh": "公司名:",
            "en": "Company:",
            "placeholderZh": "请输入公司名称",
            "placeholderEn": "Enter company name"
        },
        'typeId': {
            "zh": "出库单类型:",
            "en": "Outstock Type:",
            "placeholderZh": "请选择出库单类型",
            "placeholderEn": "Select Outstock Type"
        },
        'countryCode': {
            "zh": "国家代码:",
            "en": "Country Code:",
            "placeholderZh": "请选择国家代码",
            "placeholderEn": "Select country code"
        },
        'county': {
            "zh": "区/县:",
            "en": "County:",
            "placeholderZh": "请输入区/县",
            "placeholderEn": "Enter county"
        },
        'email': {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱地址",
            "placeholderEn": "Enter email address"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'identityNumber': {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        'name': {
            "zh": "联系人名:",
            "en": "Contact Name:",
            "placeholderZh": "请输入联系人姓名",
            "placeholderEn": "Enter contact name"
        },
        'phoneNumber1': {
            "zh": "电话1:",
            "en": "Phone:",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Enter phone number"
        },
        'phoneNumber2': {
            "zh": "电话2:",
            "en": "Phone2:",
            "placeholderZh": "请输入备用电话",
            "placeholderEn": "Enter alternative phone"
        },
        'postalCode': {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "请输入邮政编码",
            "placeholderEn": "Enter postal code"
        },
        'province': {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "请输入省/州",
            "placeholderEn": "Enter province"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'warehouseId': {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select warehouse"
        },
        'shipwayId': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 客户订单号（输入框）
        'customerOrderNo': {
            "zh": "客户订单号:",
            "en": "Customer Order No.:",
            "placeholderZh": "请输入客户订单号",
            "placeholderEn": "Enter customer order no."
        },
        // 状态（下拉框）
        'statusId': {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态代码",
            "placeholderEn": "Select status code"
        },
        // 电商平台（下拉框）
        'ecPlatform': {
            "zh": "电商平台:",
            "en": "E-commerce Platform:",
            "placeholderZh": "请选择电商平台",
            "placeholderEn": "Select e-commerce platform"
        },
        // 电商订单号（输入框）
        'ecOrderNo': {
            "zh": "电商订单号:",
            "en": "E-commerce Order No.:",
            "placeholderZh": "请输入电商订单号",
            "placeholderEn": "Enter e-commerce order no."
        },
        // 电商店铺账号（输入框）
        'ecSaleAccount': {
            "zh": "电商店铺账号:",
            "en": "E-commerce Store Account:",
            "placeholderZh": "请输入电商店铺账号",
            "placeholderEn": "Enter e-commerce store account"
        },
        // 业务类型（下拉框）
        'businessId': {
            "zh": "业务类型:",
            "en": "Business Type:",
            "placeholderZh": "请选择业务类型",
            "placeholderEn": "Select business type"
        },
        // 运输方式（下拉框）
        'shipwayTypeId': {
            "zh": "运输方式:",
            "en": "Shipping Method:",
            "placeholderZh": "请选择运输方式",
            "placeholderEn": "Select shipping method"
        },
        // 到仓类型（下拉框）
        'arrivalTypeId': {
            "zh": "到仓类型:",
            "en": "Arrival Type:",
            "placeholderZh": "请选择到仓类型",
            "placeholderEn": "Select arrival type"
        },
        // 物流产品代码（下拉框）
        'shipwayCode': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 物流品牌代码（下拉框）
        'carrierCode': {
            "zh": "承运商:",
            "en": "Carrier:",
            "placeholderZh": "请选择承运商",
            "placeholderEn": "Select carrier"
        },
        // 承运商服务
        'carrierServiceCode': {
            "zh": "承运商服务:",
            "en": "Carrier Service:",
            "placeholderZh": "请选择承运商服务",
            "placeholderEn": "Select carrier service"
        },
        // 接口id（下拉框）
        'apiId': {
            "zh": "接口id:",
            "en": "API ID:",
            "placeholderZh": "请选择接口",
            "placeholderEn": "Select API"
        },
        // 接口类型（下拉框）
        'apiTypeId': {
            "zh": "接口类型:",
            "en": "API Type:",
            "placeholderZh": "请选择接口类型",
            "placeholderEn": "Select API type"
        },
        // 承保金额币种（下拉框）
        'insuranceCurrency': {
            "zh": "承保金额币种:",
            "en": "Insurance Currency:",
            "placeholderZh": "请选择承保金额币种",
            "placeholderEn": "Select insurance currency"
        },
        // 承保金额（输入框，带数字校验）
        'insurancePremium': {
            "zh": "承保金额:",
            "en": "Insurance Premium:",
            "placeholderZh": "请输入承保金额",
            "placeholderEn": "Enter insurance premium"
        },
        // SKU个数（输入框，数字类型）
        'skuQty': {
            "zh": "SKU个数:",
            "en": "SKU Qty.:",
            "placeholderZh": "请输入SKU个数",
            "placeholderEn": "Enter SKU quantity"
        },
        'remark': {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderZh": "请输入备注",
            "placeholderEn": "Enter remark"
        },
        "senderName": {
            "zh": "发件人:",
            "en": "Sender:",
            "placeholderZh": "请输入发件人",
            "placeholderEn": "Enter sender"
        },
        "senderCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "senderIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "senderPhone1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "senderPhone2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "senderEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverName": {
            "zh": "收件人:",
            "en": "Receiver:",
            "placeholderZh": "请输入收件人",
            "placeholderEn": "Enter receiver"
        },
        "receiverCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "receiverIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "receiverPhoneNumber1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "receiverPhoneNumber2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "receiverEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverAddressType": {
            "zh": "地址类型:",
            "en": "Address Type:",
            "placeholderZh": "请选择地址类型",
            "placeholderEn": "Select address type"
        },
        "receiverIsFbaAddress": {
            "zh": "预设FBA地址:",
            "en": "Preset FBA Address:",
            "placeholderZh": "选择是否为预设FBA地址",
            "placeholderEn": "Select whether it's a preset FBA address"
        },
        "receiverIsAvis": {
            "zh": "电话预约:",
            "en": "Phone Appointment:",
            "placeholderZh": "选择是否需要电话预约",
            "placeholderEn": "Select whether phone appointment is needed"
        }
    },
    "outstock_order_outOrder_info": {
        'addressCode': {
            "zh": "地址代码:",
            "en": "addressCode:",
            "placeholderZh": "请输入地址代码",
            "placeholderEn": "Enter addressCode"
        },
        'addressLine1': {
            "zh": "街道地址1:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'addressLine2': {
            "zh": "街道地址2:",
            "en": "Address2:",
            "placeholderZh": "请输入街道地址",
            "placeholderEn": "Enter address"
        },
        'city': {
            "zh": "城市:",
            "en": "City:",
            "placeholderZh": "请输入城市",
            "placeholderEn": "Enter city"
        },
        'company': {
            "zh": "公司名:",
            "en": "Company:",
            "placeholderZh": "请输入公司名称",
            "placeholderEn": "Enter company name"
        },
        'typeId': {
            "zh": "出库单类型:",
            "en": "Outstock Type:",
            "placeholderZh": "请选择出库单类型",
            "placeholderEn": "Select Outstock Type"
        },
        'countryCode': {
            "zh": "国家代码:",
            "en": "Country Code:",
            "placeholderZh": "请选择国家代码",
            "placeholderEn": "Select country code"
        },
        'county': {
            "zh": "区/县:",
            "en": "County:",
            "placeholderZh": "请输入区/县",
            "placeholderEn": "Enter county"
        },
        'email': {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱地址",
            "placeholderEn": "Enter email address"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'identityNumber': {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        'name': {
            "zh": "联系人名:",
            "en": "Contact Name:",
            "placeholderZh": "请输入联系人姓名",
            "placeholderEn": "Enter contact name"
        },
        'phoneNumber1': {
            "zh": "电话1:",
            "en": "Phone:",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Enter phone number"
        },
        'phoneNumber2': {
            "zh": "电话2:",
            "en": "Phone2:",
            "placeholderZh": "请输入备用电话",
            "placeholderEn": "Enter alternative phone"
        },
        'postalCode': {
            "zh": "邮编:",
            "en": "Postal Code:",
            "placeholderZh": "请输入邮政编码",
            "placeholderEn": "Enter postal code"
        },
        'province': {
            "zh": "省/州:",
            "en": "Province:",
            "placeholderZh": "请输入省/州",
            "placeholderEn": "Enter province"
        },
        'houseNumber': {
            "zh": "门牌号:",
            "en": "House Number:",
            "placeholderZh": "请输入门牌号",
            "placeholderEn": "Enter house number"
        },
        'warehouseId': {
            "zh": "仓库:",
            "en": "Warehouse:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select warehouse"
        },
        'shipwayId': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 客户订单号（输入框）
        'customerOrderNo': {
            "zh": "客户订单号:",
            "en": "Customer Order No.:",
            "placeholderZh": "请输入客户订单号",
            "placeholderEn": "Enter customer order no."
        },
        // 状态（下拉框）
        'statusId': {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态代码",
            "placeholderEn": "Select status code"
        },
        // 电商平台（下拉框）
        'ecPlatform': {
            "zh": "电商平台:",
            "en": "E-commerce Platform:",
            "placeholderZh": "请选择电商平台",
            "placeholderEn": "Select e-commerce platform"
        },
        // 电商订单号（输入框）
        'ecOrderNo': {
            "zh": "电商订单号:",
            "en": "E-commerce Order No.:",
            "placeholderZh": "请输入电商订单号",
            "placeholderEn": "Enter e-commerce order no."
        },
        // 电商店铺账号（输入框）
        'ecSaleAccount': {
            "zh": "电商店铺账号:",
            "en": "E-commerce Store Account:",
            "placeholderZh": "请输入电商店铺账号",
            "placeholderEn": "Enter e-commerce store account"
        },
        // 业务类型（下拉框）
        'businessId': {
            "zh": "业务类型:",
            "en": "Business Type:",
            "placeholderZh": "请选择业务类型",
            "placeholderEn": "Select business type"
        },
        // 运输方式（下拉框）
        'shipwayTypeId': {
            "zh": "运输方式:",
            "en": "Shipping Method:",
            "placeholderZh": "请选择运输方式",
            "placeholderEn": "Select shipping method"
        },
        // 到仓类型（下拉框）
        'arrivalTypeId': {
            "zh": "到仓类型:",
            "en": "Arrival Type:",
            "placeholderZh": "请选择到仓类型",
            "placeholderEn": "Select arrival type"
        },
        // 物流产品代码（下拉框）
        'shipwayCode': {
            "zh": "物流产品:",
            "en": "Shipway:",
            "placeholderZh": "请选择物流产品",
            "placeholderEn": "Select shipway"
        },
        // 物流品牌代码（下拉框）
        'carrierCode': {
            "zh": "承运商:",
            "en": "Carrier:",
            "placeholderZh": "请选择承运商",
            "placeholderEn": "Select carrier"
        },
        // 承运商服务
        'carrierServiceCode': {
            "zh": "承运商服务:",
            "en": "Carrier Service:",
            "placeholderZh": "请选择承运商服务",
            "placeholderEn": "Select carrier service"
        },
        // 接口id（下拉框）
        'apiId': {
            "zh": "接口id:",
            "en": "API ID:",
            "placeholderZh": "请选择接口",
            "placeholderEn": "Select API"
        },
        // 接口类型（下拉框）
        'apiTypeId': {
            "zh": "接口类型:",
            "en": "API Type:",
            "placeholderZh": "请选择接口类型",
            "placeholderEn": "Select API type"
        },
        // 承保金额币种（下拉框）
        'insuranceCurrency': {
            "zh": "承保金额币种:",
            "en": "Insurance Currency:",
            "placeholderZh": "请选择承保金额币种",
            "placeholderEn": "Select insurance currency"
        },
        // 承保金额（输入框，带数字校验）
        'insurancePremium': {
            "zh": "承保金额:",
            "en": "Insurance Premium:",
            "placeholderZh": "请输入承保金额",
            "placeholderEn": "Enter insurance premium"
        },
        // SKU个数（输入框，数字类型）
        'skuQty': {
            "zh": "SKU个数:",
            "en": "SKU Qty.:",
            "placeholderZh": "请输入SKU个数",
            "placeholderEn": "Enter SKU quantity"
        },
        'remark': {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderZh": "请输入备注",
            "placeholderEn": "Enter remark"
        },
        "senderName": {
            "zh": "发件人:",
            "en": "Sender:",
            "placeholderZh": "请输入发件人",
            "placeholderEn": "Enter sender"
        },
        "senderCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "senderIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "senderPhone1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "senderPhone2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "senderEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverName": {
            "zh": "收件人:",
            "en": "Receiver:",
            "placeholderZh": "请输入收件人",
            "placeholderEn": "Enter receiver"
        },
        "receiverCompany": {
            "zh": "公司名:",
            "en": "Company Name:",
            "placeholderZh": "请输入公司名",
            "placeholderEn": "Enter company name"
        },
        "receiverIdentityNumber": {
            "zh": "证件号码:",
            "en": "ID Number:",
            "placeholderZh": "请输入证件号码",
            "placeholderEn": "Enter ID number"
        },
        "receiverPhoneNumber1": {
            "zh": "电话1:",
            "en": "Phone 1:",
            "placeholderZh": "请输入电话1",
            "placeholderEn": "Enter phone 1"
        },
        "receiverPhoneNumber2": {
            "zh": "电话2:",
            "en": "Phone 2:",
            "placeholderZh": "请输入电话2",
            "placeholderEn": "Enter phone 2"
        },
        "receiverEmail": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter email"
        },
        "receiverAddressType": {
            "zh": "地址类型:",
            "en": "Address Type:",
            "placeholderZh": "请选择地址类型",
            "placeholderEn": "Select address type"
        },
        "receiverIsFbaAddress": {
            "zh": "预设FBA地址:",
            "en": "Preset FBA Address:",
            "placeholderZh": "选择是否为预设FBA地址",
            "placeholderEn": "Select whether it's a preset FBA address"
        },
        "receiverIsAvis": {
            "zh": "电话预约:",
            "en": "Phone Appointment:",
            "placeholderZh": "选择是否需要电话预约",
            "placeholderEn": "Select whether phone appointment is needed"
        }
    },
    "product_price_fuel_list": {
        "name": {
            "zh": "模板名称:",
            "en": "Temp.Name:",
            "placeholderZh": "请输入模板名称",
            "placeholderEn": "Enter Temp. Name"
        }
    },
    "product_price_regionProject_list": {
        "name": {
            "zh": "模板名称:",
            "en": "Temp. Name:",
            "placeholderZh": "请输入模板名称",
            "placeholderEn": "Enter Temp. Name"
        },
        "typeId": {
            "zh": "模板类型:",
            "en": "Temp. Type:",
            "placeholderZh": "请选择模板类型",
            "placeholderEn": "Select Temp. Type"
        }
    },
    "product_price_remote_list": {
        "name": {
            "zh": "偏远库名称:",
            "en": "Remote Whse. Name:",
            "placeholderZh": "请输入偏远库名称",
            "placeholderEn": "Enter Remote Whse. Name"
        }
    },
    "product_shipway_shipway_list": {
        "name": {
            "zh": "产品名称:",
            "en": "Prod. Name:",
            "placeholderZh": "请输入产品名称",
            "placeholderEn": "Enter Prod. Name"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "typeId": {
            "zh": "运输方式:",
            "en": "Transp. Method:",
            "placeholderZh": "请选择运输方式",
            "placeholderEn": "Select Transp. Method"
        },
        "carrierCode": {
            "zh": "承运商:",
            "en": "Carrier:",
            "placeholderZh": "请选择承运商",
            "placeholderEn": "Select Carrier"
        },
        "codeList": {
            "zh": "产品代码:",
            "en": "Prod. Code:",
            "placeholderZh": "请输入产品代码",
            "placeholderEn": "Enter Prod. Code"
        },
        "code": {
            "zh": "产品代码:",
            "en": "Prod. Code:",
            "placeholderZh": "请输入产品代码",
            "placeholderEn": "Enter Prod. Code"
        },
        "channelSelect": {
            "zh": "渠道模式:",
            "en": "Channel Mode:",
            "placeholderZh": "请选择到仓类型",
            "placeholderEn": "Select Whse. Arrival Type"
        },
        "warehouseCodeList": {
            "zh": "仓库:",
            "en": "Whse.:",
            "placeholderZh": "请选择仓库",
            "placeholderEn": "Select Whse."
        },
        "minDay": {
            "zh": "最小时效:",
            "en": "Min. Timeliness:",
            "placeholderZh": "请输入最小时效",
            "placeholderEn": "Enter Min. Timeliness"
        },
        "maxDay": {
            "zh": "最大时效:",
            "en": "Max. Timeliness:",
            "placeholderZh": "请输入最大时效",
            "placeholderEn": "Enter Max. Timeliness"
        },
        "minVolume": {
            "zh": "最小体积:",
            "en": "Min. Volume:",
            "placeholderZh": "请输入最小体积",
            "placeholderEn": "Enter Min. Volume"
        },
        "maxVolume": {
            "zh": "最大体积:",
            "en": "Max. Volume:",
            "placeholderZh": "请输入最大体积",
            "placeholderEn": "Enter Max. Volume"
        },
        "minWeight": {
            "zh": "最小重量:",
            "en": "Min. Weight:",
            "placeholderZh": "请输入最小重量",
            "placeholderEn": "Enter Min. Weight"
        },
        "maxWeight": {
            "zh": "最大重量:",
            "en": "Max. Weight:",
            "placeholderZh": "请输入最大重量",
            "placeholderEn": "Enter Max. Weight"
        },
        "insuranceId": {
            "zh": "保险服务:",
            "en": "Ins. Service:",
            "placeholderZh": "请选择保险服务",
            "placeholderEn": "Select Ins. Service"
        },
        "signatureId": {
            "zh": "签名服务:",
            "en": "Sig. Service:",
            "placeholderZh": "请选择签名服务",
            "placeholderEn": "Select Sig. Service"
        },
        "uploadWaybillId": {
            "zh": "上传面单:",
            "en": "Upload Waybill:",
            "placeholderZh": "请选择上传面单",
            "placeholderEn": "Select Upload Waybill"
        },
        "description": {
            "zh": "渠道描述:",
            "en": "Channel Desc.:",
            "placeholderZh": "请输入渠道描述",
            "placeholderEn": "Enter Channel Desc."
        }
    },



    "product_shipway_supplier_list": {
        "typeId": {
            "zh": "类型:",
            "en": "Type:",
            "placeholderZh": "请选择类型",
            "placeholderEn": "Select Type"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "codeList": {
            "zh": "服务商:",
            "en": "Supplier:",
            "placeholderZh": "请输入服务商代码",
            "placeholderEn": "Enter Supplier Code"
        },
        "code": {
            "zh": "服务商代码:",
            "en": "Supplier Code:",
            "placeholderZh": "请输入服务商代码",
            "placeholderEn": "Enter Supplier Code"
        },
        "name": {
            "zh": "服务商名称:",
            "en": "Supplier Name:",
            "placeholderZh": "请输入服务商名称",
            "placeholderEn": "Enter Supplier Name"
        },
        "website": {
            "zh": "登录网站:",
            "en": "Login Site:",
            "placeholderZh": "请输入登录网站",
            "placeholderEn": "Enter Login Site"
        },
        "contactName": {
            "zh": "联系人:",
            "en": "Contact:",
            "placeholderZh": "请输入联系人",
            "placeholderEn": "Enter Contact"
        },
        "mobilePhone": {
            "zh": "手机号:",
            "en": "Mobile:",
            "placeholderZh": "请输入手机号",
            "placeholderEn": "Enter Mobile"
        },
        "email": {
            "zh": "邮箱:",
            "en": "Email:",
            "placeholderZh": "请输入邮箱",
            "placeholderEn": "Enter Email"
        },
        "contactAddress": {
            "zh": "联系地址:",
            "en": "Contact Addr.:",
            "placeholderZh": "请输入联系地址",
            "placeholderEn": "Enter Contact Addr."
        },
        "account": {
            "zh": "账号:",
            "en": "Account:",
            "placeholderZh": "请输入账号",
            "placeholderEn": "Enter Account"
        },
        "password": {
            "zh": "密码:",
            "en": "Password:",
            "placeholderZh": "请输入密码",
            "placeholderEn": "Enter Password"
        },
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderZh": "请选择账号所属公司",
            "placeholderEn": "Select Account's Company"
        },
        "owner": {
            "zh": "拥有者:",
            "en": "Owner:",
            "placeholderZh": "请输入拥有者",
            "placeholderEn": "Enter Owner"
        },
        "apiId": {
            "zh": "api 接口:",
            "en": "API Interface:",
            "placeholderZh": "请选择 api 接口",
            "placeholderEn": "Select API Interface"
        },
        "apiConfig": {
            "zh": "api 配置:",
            "en": "API Config:",
            "placeholderZh": "请输入 api 配置",
            "placeholderEn": "Enter API Config"
        }
    },
    "sys_job_exportJob_list": {
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "createdBy": {
            "zh": "创建人:",
            "en": "Created By:",
            "placeholderZh": "请输入创建人",
            "placeholderEn": "Enter Created By"
        },
        "jobNo": {
            "zh": "导入编号:",
            "en": "Import No.:",
            "placeholderZh": "请输入导入编号",
            "placeholderEn": "Enter Import No."
        },
        "typeId": {
            "zh": "类型:",
            "en": "Type:",
            "placeholderZh": "请选择类型",
            "placeholderEn": "Select Type"
        },
        "templateName": {
            "zh": "模板名称:",
            "en": "Temp. Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "typeName": {
            "zh": "导出类型:",
            "en": "Export Type:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "exportTotal": {
            "zh": "导出总数:",
            "en": "Total Export Qty.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "exportAlready": {
            "zh": "已导出数:",
            "en": "Exported Qty.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "statusName": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "exportParade": {
            "zh": "导出参数:",
            "en": "Export Params:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "customerName": {
            "zh": "客户名称:",
            "en": "Cust. Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "fileSize": {
            "zh": "文件大小:",
            "en": "File Size:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "fileUrl": {
            "zh": "导出文件路径:",
            "en": "Export File Path:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "feedbackMsg": {
            "zh": "进度反馈消息:",
            "en": "Progress Feedback:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "feedbackTime": {
            "zh": "进度反馈时间:",
            "en": "Feedback Time:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "startTime": {
            "zh": "开始时间:",
            "en": "Start Time:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "endTime": {
            "zh": "结束时间:",
            "en": "End Time:",
            "placeholderZh": "",
            "placeholderEn": ""
        }
    },
    "inventory_inventory_inventory_list1": {

        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "zoneCode": {
            "zh": "库区:",
            "en": "Zone Code:",
            "placeholderZh": "请输入库区代码",
            "placeholderEn": "Enter Zone Code"
        },
        "locationCodeList": {
            "zh": "库位:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位代码",
            "placeholderEn": "Enter Loc. Code"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "qualityId": {
            "zh": "品质:",
            "en": "Quality:",
            "placeholderZh": "请选择品质",
            "placeholderEn": "Select Quality"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "qtyTotalMin": {
            "zh": "最小数量:",
            "en": "Min. Qty.:",
            "placeholderZh": "请输入最小数量",
            "placeholderEn": "Enter Min. Qty."
        },
        "inShelfDate": {
            "zh": "上架日期:",
            "en": "Shelf Date:",
            "placeholderZh": "请选择上架日期",
            "placeholderEn": "Select Shelf Date"
        }
    },
    "inventory_inventory_inventory_list2": {
        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "zoneCode": {
            "zh": "库区:",
            "en": "Zone Code:",
            "placeholderZh": "请输入库区代码",
            "placeholderEn": "Enter Zone Code"
        },
        "locationCodeList": {
            "zh": "库位:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位代码",
            "placeholderEn": "Enter Loc. Code"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "qualityId": {
            "zh": "品质:",
            "en": "Quality:",
            "placeholderZh": "请选择品质",
            "placeholderEn": "Select Quality"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "qtyTotalMin": {
            "zh": "最小数量:",
            "en": "Min. Qty.:",
            "placeholderZh": "请输入最小数量",
            "placeholderEn": "Enter Min. Qty."
        },
        "inShelfDate": {
            "zh": "上架日期:",
            "en": "Shelf Date:",
            "placeholderZh": "请选择上架日期",
            "placeholderEn": "Select Shelf Date"
        }
    },
    "inventory_inventory_inventory_list3": {
        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "zoneCode": {
            "zh": "库区:",
            "en": "Zone Code:",
            "placeholderZh": "请输入库区代码",
            "placeholderEn": "Enter Zone Code"
        },
        "locationCodeList": {
            "zh": "库位:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位代码",
            "placeholderEn": "Enter Loc. Code"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "qualityId": {
            "zh": "品质:",
            "en": "Quality:",
            "placeholderZh": "请选择品质",
            "placeholderEn": "Select Quality"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "qtyTotalMin": {
            "zh": "最小数量:",
            "en": "Min. Qty.:",
            "placeholderZh": "请输入最小数量",
            "placeholderEn": "Enter Min. Qty."
        },
        "inShelfDate": {
            "zh": "上架日期:",
            "en": "Shelf Date:",
            "placeholderZh": "请选择上架日期",
            "placeholderEn": "Select Shelf Date"
        }
    },

    "inventory_adjust_inventoryAdjust_list": {
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "inventoryCheckNo": {
            "zh": "盘点单号:",
            "en": "Inv. Check No.:",
            "placeholderZh": "请输入盘点单号",
            "placeholderEn": "Enter Inv. Check No."
        },
        "typeId": {
            "zh": "盘点类型:",
            "en": "Check Type:",
            "placeholderZh": "请选择盘点类型",
            "placeholderEn": "Select Check Type"
        },
        "adjustNoList": {
            "zh": "调整单号:",
            "en": "Adj. No.:",
            "placeholderZh": "请输入调整单号",
            "placeholderEn": "Enter Adj. No."
        }
    },
    "inventory_inventory_inventorySn_list": {
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "outOrderNoList": {
            "zh": "出库单号:",
            "en": "Outb. Ord. No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Enter Outb. Ord. No."
        },
        "locationCodeList": {
            "zh": "库位:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位代码",
            "placeholderEn": "Enter Loc. Code"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "inOrderNo": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "sku": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "sn": {
            "zh": "序列号:",
            "en": "Serial No.:",
            "placeholderZh": "请输入序列号",
            "placeholderEn": "Enter Serial No."
        },
        "receiptTime": {
            "zh": "收货时间:",
            "en": "Receipt Time:",
            "placeholderZh": "请选择收货时间",
            "placeholderEn": "Select Receipt Time"
        },
        "inshelfTime": {
            "zh": "上架时间:",
            "en": "Shelf Time:",
            "placeholderZh": "请选择上架时间",
            "placeholderEn": "Select Shelf Time"
        },
        "locationCode": {
            "zh": "库位:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位代码",
            "placeholderEn": "Enter Loc. Code"
        },
        "outOrderNo": {
            "zh": "出库单号:",
            "en": "Outb. Ord. No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Enter Outb. Ord. No."
        },
        "shippedTime": {
            "zh": "发货时间:",
            "en": "Shipped Time:",
            "placeholderZh": "请选择发货时间",
            "placeholderEn": "Select Shipped Time"
        },
        "inventoryId": {
            "zh": "库存ID:",
            "en": "Inventory ID:",
            "placeholderZh": "请输入库存ID",
            "placeholderEn": "Enter Inventory ID"
        }
    },
    "inventory_inventory_inventoryLog_list": {
        "qtyType": {
            "zh": "数量类型:",
            "en": "Qty. Type:",
            "placeholderZh": "请选择数量类型",
            "placeholderEn": "Select Qty. Type"
        },
        "opTypeId": {
            "zh": "操作类型:",
            "en": "Op. Type:",
            "placeholderZh": "请选择操作类型",
            "placeholderEn": "Select Op. Type"
        },
        "opRefNo": {
            "zh": "相关单据:",
            "en": "Related Doc.:",
            "placeholderZh": "请输入相关单据",
            "placeholderEn": "Enter Related Doc."
        },
        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "inShelfDate": {
            "zh": "上架日期:",
            "en": "Shelf Date:",
            "placeholderZh": "请选择上架日期",
            "placeholderEn": "Select Shelf Date"
        },
        "zoneCode": {
            "zh": "库区:",
            "en": "Zone Code:",
            "placeholderZh": "请输入库区代码",
            "placeholderEn": "Enter Zone Code"
        },
        "locationCodeList": {
            "zh": "库位:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位代码",
            "placeholderEn": "Enter Loc. Code"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "qualityId": {
            "zh": "品质:",
            "en": "Quality:",
            "placeholderZh": "请选择品质",
            "placeholderEn": "Select Quality"
        }
    },
    "inventory_inventory_inventorySnapshot_list": {
        "snapshotDate": {
            "zh": "快照日期:",
            "en": "Snapshot Date:",
            "placeholderZh": "请选择快照日期",
            "placeholderEn": "Select Snapshot Date"
        },
        "inOrderNoList": {
            "zh": "入库单号:",
            "en": "Inb. Ord. No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Enter Inb. Ord. No."
        },
        "inShelfDate": {
            "zh": "上架日期:",
            "en": "Shelf Date:",
            "placeholderZh": "请选择上架日期",
            "placeholderEn": "Select Shelf Date"
        },
        "zoneCode": {
            "zh": "库区:",
            "en": "Zone Code:",
            "placeholderZh": "请选择库区",
            "placeholderEn": "Select Zone Code"
        },
        "locationCodeList": {
            "zh": "库位:",
            "en": "Loc. Code:",
            "placeholderZh": "请输入库位",
            "placeholderEn": "Enter Loc. Code"
        },
        "skuList": {
            "zh": "SKU:",
            "en": "SKU:",
            "placeholderZh": "请输入SKU",
            "placeholderEn": "Enter SKU"
        },
        "qualityId": {
            "zh": "品质:",
            "en": "Quality:",
            "placeholderZh": "请选择品质",
            "placeholderEn": "Select Quality"
        }
    },
    "sys_job_importJob_list": {
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "createdBy": {
            "zh": "创建人:",
            "en": "Created By:",
            "placeholderZh": "请输入创建人",
            "placeholderEn": "Enter Created By"
        },
        "jobNo": {
            "zh": "导入编号:",
            "en": "Import No.:",
            "placeholderZh": "请输入导入编号",
            "placeholderEn": "Enter Import No."
        },
        "typeId": {
            "zh": "类型:",
            "en": "Type:",
            "placeholderZh": "请选择类型",
            "placeholderEn": "Select Type"
        },
        "templateName": {
            "zh": "模板名称:",
            "en": "Temp. Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "typeName": {
            "zh": "导入类型:",
            "en": "Import Type:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "statusName": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "importParam": {
            "zh": "导入参数:",
            "en": "Import Params:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "importTotal": {
            "zh": "导入总数:",
            "en": "Total Import Qty.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "customerName": {
            "zh": "客户名称:",
            "en": "Cust. Name:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "fileSize": {
            "zh": "文件大小:",
            "en": "File Size:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "handlerWayName": {
            "zh": "处理方式:",
            "en": "Proc. Meth.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "fileUrl": {
            "zh": "文件路径:",
            "en": "File Path:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "returnMessage": {
            "zh": "返回消息:",
            "en": "Return Msg.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "feedbackMsg": {
            "zh": "进度反馈消息:",
            "en": "Prog. Fdbk. Msg.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "feedbackTime": {
            "zh": "进度反馈时间:",
            "en": "Prog. Fdbk. Time:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "async": {
            "zh": "是否异步:",
            "en": "Is Async:",
            "placeholderZh": "请选择是否异步",
            "placeholderEn": "Select Is Async"
        },
        "localFileUrl": {
            "zh": "本地文件路径:",
            "en": "Local File Path:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "startTime": {
            "zh": "开始时间:",
            "en": "Start Time:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "endTime": {
            "zh": "结束时间:",
            "en": "End Time:",
            "placeholderZh": "",
            "placeholderEn": ""
        }
    },



    "sys_job_scheduleJob_list": {
        "jobGroupId": {
            "zh": "任务分组:",
            "en": "Job Group:",
            "placeholderZh": "请选择任务分组",
            "placeholderEn": "Select Job Group"
        },
        "jobStatusId": {
            "zh": "任务状态:",
            "en": "Job Status:",
            "placeholderZh": "请选择任务状态",
            "placeholderEn": "Select Job Status"
        },
        "springId": {
            "zh": "执行 Id:",
            "en": "Exec. ID:",
            "placeholderZh": "请输入执行 Id",
            "placeholderEn": "Enter Exec. ID"
        },
        "jobName": {
            "zh": "任务名称:",
            "en": "Task Name:",
            "placeholderZh": "请输入任务名称",
            "placeholderEn": "Enter Task Name"
        },
        "jobStatusId": {
            "zh": "是否启动:",
            "en": "Is Activated:",
            "placeholderZh": "请选择是否启动",
            "placeholderEn": "Select Is Activated"
        },
        "cronExpression": {
            "zh": "cron 表达式:",
            "en": "Cron Expr.:",
            "placeholderZh": "秒 分 时 日 月 ？",
            "placeholderEn": "s min h d mo ?"
        },
        "description": {
            "zh": "任务描述:",
            "en": "Task Desc.:",
            "placeholderZh": "请输入任务描述",
            "placeholderEn": "Enter Task Desc."
        },
        "isConcurrent": {
            "zh": "是否并发:",
            "en": "Is Concurrent:",
            "placeholderZh": "请选择是否并发",
            "placeholderEn": "Select Is Concurrent"
        },
        "methodName": {
            "zh": "执行方法名:",
            "en": "Exec. Method Name:",
            "placeholderZh": "执行 bean 方法名",
            "placeholderEn": "Exec. Bean Method Name"
        },
        "args": {
            "zh": "参数:",
            "en": "Params:",
            "placeholderZh": "请输入参数",
            "placeholderEn": "Enter Params"
        }
    },
    "sys_log_loginLog_list": {
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "请输入用户代码",
            "placeholderEn": "Enter User Code"
        },
        "mobilePhone": {
            "zh": "手机号码:",
            "en": "Mobile:",
            "placeholderZh": "请输入手机号码",
            "placeholderEn": "Enter Mobile"
        },
        "isSuccess": {
            "zh": "登录结果:",
            "en": "Login Result:",
            "placeholderZh": "请选择登录结果",
            "placeholderEn": "Select Login Result"
        }
    },
    "sys_msg_messageContent_list": {
        "notifyScopeId": {
            "zh": "通知范围:",
            "en": "Notif. Scope:",
            "placeholderZh": "请选择通知范围",
            "placeholderEn": "Select Notif. Scope"
        },
        "typeId": {
            "zh": "消息类型:",
            "en": "Msg. Type:",
            "placeholderZh": "请选择消息类型",
            "placeholderEn": "Select Msg. Type"
        },
        "title": {
            "zh": "标题:",
            "en": "Title:",
            "placeholderZh": "请输入标题",
            "placeholderEn": "Enter Title"
        },
        "notifyWayId": {
            "zh": "提醒方式:",
            "en": "Remind Meth.:",
            "placeholderZh": "请选择提醒方式",
            "placeholderEn": "Select Remind Meth."
        },
        "link": {
            "zh": "链接:",
            "en": "Link:",
            "placeholderZh": "请输入链接",
            "placeholderEn": "Enter Link"
        },
        "fileUrl": {
            "zh": "附件上传:",
            "en": "Attachment:",
            "placeholderZh": "点击右侧上传文件",
            "placeholderEn": "Click right to upload file"
        },
        "content": {
            "zh": "内容:",
            "en": "Content:",
            "placeholderZh": "请输入内容",
            "placeholderEn": "Enter Content"
        },
        "notifyUser": {
            "zh": "指定用户:",
            "en": "Designated User:",
            "placeholderZh": "点击右侧选择用户",
            "placeholderEn": "Click right to select user"
        },
        "totalQty": {
            "zh": "总通知数:",
            "en": "Total Notif. Cnt.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "readedQty": {
            "zh": "阅读数:",
            "en": "Read Cnt.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "deletedQty": {
            "zh": "删除数:",
            "en": "Deleted Cnt.:",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "codeFuzzy": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "请输入用户代码",
            "placeholderEn": "Enter User Code"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "userTypeId": {
            "zh": "用户类型:",
            "en": "User Type:",
            "placeholderZh": "请选择用户类型",
            "placeholderEn": "Select User Type"
        }
    },



    "sys_setting_menu_list": {
        "parentId": {
            "zh": "上级菜单:",
            "en": "Parent Menu:",
            "placeholderZh": "请选择上级菜单",
            "placeholderEn": "Select Parent Menu"
        },
        "nameCn": {
            "zh": "中文名称:",
            "en": "Chinese Name:",
            "placeholderZh": "请输入中文名称",
            "placeholderEn": "Enter Chinese Name"
        },
        "nameEn": {
            "zh": "英文名称:",
            "en": "English Name:",
            "placeholderZh": "请输入英文名称",
            "placeholderEn": "Enter English Name"
        },
        "typeId": {
            "zh": "类型:",
            "en": "Type:",
            "placeholderZh": "请选择类型",
            "placeholderEn": "Select Type"
        },
        "terminal": {
            "zh": "用户端:",
            "en": "User Terminal:",
            "placeholderZh": "请选择用户端",
            "placeholderEn": "Select User Terminal"
        },
        "iconCls": {
            "zh": "菜单图标:",
            "en": "Menu Icon:",
            "placeholderZh": "请输入菜单图标",
            "placeholderEn": "Enter Menu Icon"
        },
        "url": {
            "zh": "菜单 URL:",
            "en": "Menu URL:",
            "placeholderZh": "请输入菜单 URL",
            "placeholderEn": "Enter Menu URL"
        },
        "permissionCode": {
            "zh": "权限代码:",
            "en": "Perm. Code:",
            "placeholderZh": "请输入权限代码",
            "placeholderEn": "Enter Perm. Code"
        },
        "display": {
            "zh": "是否隐藏:",
            "en": "Is Hidden:",
            "placeholderZh": "请选择是否隐藏",
            "placeholderEn": "Select Is Hidden"
        },
        "sortNo": {
            "zh": "序号:",
            "en": "Seq. No.:",
            "placeholderZh": "请输入序号",
            "placeholderEn": "Enter Seq. No."
        }
    },
    "sys_user_user_list": {
        "code": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "请输入用户代码",
            "placeholderEn": "Enter User Code"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "userTypeId": {
            "zh": "类型:",
            "en": "User Type:",
            "placeholderZh": "请选择类型",
            "placeholderEn": "Select User Type"
        },
        "orgId": {
            "zh": "公司:",
            "en": "Company:",
            "placeholderZh": "请选择公司",
            "placeholderEn": "Select Company"
        }
    },
    "exportJob": {
        "jobNo": {
            "zh": "任务编号:",
            "en": "Job No.:",
            "placeholderZh": "请输入任务编号",
            "placeholderEn": "Enter Job No."
        },
        "typeId": {
            "zh": "导出类型:",
            "en": "Export Type:",
            "placeholderZh": "请选择导出类型",
            "placeholderEn": "Select Export Type"
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        }
    },
    "messageNotices": {
        "messageTypeId": {
            "zh": "消息类型:",
            "en": "Msg. Type:",
            "placeholderZh": "请选择消息类型",
            "placeholderEn": "Select Msg. Type"
        },
        "title": {
            "zh": "标题:",
            "en": "Title:",
            "placeholderZh": "请输入标题",
            "placeholderEn": "Enter Title"
        },
        "isReaded": {
            "zh": "是否已读:",
            "en": "Is Read:",
            "placeholderZh": "请选择是否已读",
            "placeholderEn": "Select Is Read"
        }
    },
    "print": {
        "btypeId": {
            "zh": "类型:",
            "en": "Type:",
            "placeholderZh": "请选择类型",
            "placeholderEn": "Select Type"
        },
        "templateId": {
            "zh": "选择格式:",
            "en": "Select Format:",
            "placeholderZh": "请选择格式",
            "placeholderEn": "Select Format"
        },
        "barcodes": {
            "zh": "内容:",
            "en": "Content:",
            "placeholderZh": "请输入内容",
            "placeholderEn": "Enter Content"
        },
        "printQty": {
            "zh": "打印张数:",
            "en": "Print Qty.:",
            "placeholderZh": "打印份数1——100",
            "placeholderEn": "Print Qty. 1-100"
        }
    },
    "sys_user_role_list": {
        "name": {
            "zh": "角色名称:",
            "en": "Role Name:",
            "placeholderZh": "请输入角色名称",
            "placeholderEn": "Enter Role Name"
        }
    },
    "sys_log_opLog_list": {
        "userCode": {
            "zh": "用户代码:",
            "en": "User Code:",
            "placeholderZh": "请输入用户代码",
            "placeholderEn": "Enter User Code"
        },
        "createdTime": {
            "zh": "操作时间:",
            "en": "Op. Time:",
            "placeholderZh": "请选择操作时间",
            "placeholderEn": "Select Op. Time"
        },
        "objTypeName": {
            "zh": "数据类型:",
            "en": "Data Type:",
            "placeholderZh": "请选择数据类型",
            "placeholderEn": "Select Data Type"
        },
        "objNo": {
            "zh": "关键单号:",
            "en": "Key Doc. No.:",
            "placeholderZh": "请输入关键单号",
            "placeholderEn": "Enter Key Doc. No."
        },
        "indexNo1": {
            "zh": "相关单号:",
            "en": "Related Doc. No.:",
            "placeholderZh": "请输入相关单号",
            "placeholderEn": "Enter Related Doc. No."
        },
        "isSuccess": {
            "zh": "操作结果:",
            "en": "Op. Result:",
            "placeholderZh": "请选择操作结果",
            "placeholderEn": "Select Op. Result"
        },
        "message": {
            "zh": "操作信息:",
            "en": "Op. Info:",
            "placeholderZh": "请输入操作信息",
            "placeholderEn": "Enter Op. Info"
        },
        "objTypeId": {
            "zh": "对象类型:",
            "en": "Obj. Type:",
            "placeholderZh": "请选择对象类型",
            "placeholderEn": "Select Obj. Type"
        },
        "opType": {
            "zh": "操作类型:",
            "en": "Op. Type:",
            "placeholderZh": "请选择操作类型",
            "placeholderEn": "Select Op. Type"
        }
    },
    "instock_order_inOrder_add": {
        "nameCn": {
            "zh": "中文品名:",
            "en": "Chinese Prod. Name:",
            "placeholderZh": "请输入中文品名",
            "placeholderEn": "Enter Chinese Prod. Name"
        }
    },
    "outstock_wave_outWaveTask_list": {
        "taskNo": {
            "zh": "任务编号:",
            "en": "Task No.:",
            "placeholderZh": "请输入任务编号",
            "placeholderEn": "Enter Task No."
        },
        "statusId": {
            "zh": "状态:",
            "en": "Status:",
            "placeholderZh": "请选择状态",
            "placeholderEn": "Select Status"
        },
        "isTemplate": {
            "zh": "是否模板:",
            "en": "Is Template:",
            "placeholderZh": "请选择是否模板",
            "placeholderEn": "Select Is Template"
        }
    },
    "finance_basic_collectionAccount_list": {
        paywayId: {
            zh: '付款方式:',
            en: 'Payment Method:',
            placeholderZh: '请选择付款方式',
            placeholderEn: 'Select payment method'
        },
        statusId: {
            zh: '状态:',
            en: 'Status:',
            placeholderZh: '请选择状态',
            placeholderEn: 'Select status'
        },
        accountNo: {
            zh: '账户账号:',
            en: 'Account Number:',
            placeholderZh: '请输入账户账号',
            placeholderEn: 'Enter account number'
        },
        accountNoLike: {
            zh: '账户账号:',
            en: 'Account Number:',
            placeholderZh: '请输入账户账号',
            placeholderEn: 'Enter account number'
        },
        accountHolderName: {
            zh: '账户持有人:',
            en: 'Account Holder Name:',
            placeholderZh: '请输入账户持有人名称',
            placeholderEn: 'Enter account holder name'
        },
        accountHolderId: {
            zh: '账户持有人身份证:',
            en: 'Account Holder:',
            placeholderZh: '请输入账户持有人身份证ID',
            placeholderEn: 'Enter account holder ID'
        },
        currency: {
            zh: '币种代码:',
            en: 'Currency Code:',
            placeholderZh: '请选择币种代码',
            placeholderEn: 'Select currency code'
        },
        bankCode: {
            zh: '银行代码:',
            en: 'Bank Code:',
            placeholderZh: '请输入银行代码',
            placeholderEn: 'Enter bank code'
        },
        swiftCode: {
            zh: 'SWIFT:',
            en: 'SWIFT:',
            placeholderZh: '请输入银行跨国转账SWIFT',
            placeholderEn: 'Enter SWIFT'
        },
        bankName: {
            zh: '银行名称:',
            en: 'Bank Name:',
            placeholderZh: '请输入银行名称',
            placeholderEn: 'Enter bank name'
        },
        alipayAppid: {
            zh: '应用ID:',
            en: 'AppID:',
            placeholderZh: '请输入支付宝应用ID',
            placeholderEn: 'Enter Alipay AppID'
        },
        alipayPublicKey: {
            zh: '公钥:',
            en: 'Public Key:',
            placeholderZh: '请输入支付宝公钥',
            placeholderEn: 'Enter Alipay public key'
        },
        alipayAppPrivateKey: {
            zh: '私钥:',
            en: 'Private Key:',
            placeholderZh: '请输入支付宝应用私钥',
            placeholderEn: 'Enter Alipay private key'
        },
        alipayNotifyurl: {
            zh: '通知回调地址:',
            en: 'Notify URL:',
            placeholderZh: '请输入支付宝通知回调地址',
            placeholderEn: 'Enter Alipay notify URL'
        },
        wxAppid: {
            zh: 'AppID:',
            en: 'AppID:',
            placeholderZh: '请输入微信支付载体',
            placeholderEn: 'Enter WeChat AppID'
        },
        wxMcid: {
            zh: '商家ID:',
            en: 'Merchant ID:',
            placeholderZh: '请输入微信支付商家id',
            placeholderEn: 'Enter WeChat merchant ID'
        },
        wxApiV3Key: {
            zh: 'API v3密钥:',
            en: 'API v3 Key:',
            placeholderZh: '请输入微信支付API v3密钥',
            placeholderEn: 'Enter WeChat API v3 key'
        },
        wxPrivateKey: {
            zh: '商户证书:',
            en: 'Merchant Certificate:',
            placeholderZh: '请输入微信支付商户证书',
            placeholderEn: 'Enter WeChat merchant certificate'
        },
        wxMchSerialNo: {
            zh: '证书序列号:',
            en: 'Cert Serial No:',
            placeholderZh: '请输入微信支付证书序列号',
            placeholderEn: 'Enter WeChat cert serial number'
        },
        wxPayNotify: {
            zh: '结果通知地址:',
            en: 'Notify URL:',
            placeholderZh: '请输入微信支付结果通知回调地址',
            placeholderEn: 'Enter WeChat pay notify URL'
        },
        remark: {
            zh: '备注:',
            en: 'Remark:',
            placeholderZh: '请输入备注',
            placeholderEn: 'Enter remark'
        }
    },
    "finance_basic_currency_list": {
        currency: {
            zh: '币种代码:',
            en: 'Currency Code:',
            placeholderZh: '请输入币种代码',
            placeholderEn: 'Enter currency code'
        },
        rate: {
            zh: '汇率:',
            en: 'Exchange Rate:',
            placeholderZh: '请输入汇率',
            placeholderEn: 'Enter exchange rate'
        },
        isStandardCurrency: {
            zh: '本位币:',
            en: 'Standard Currency:',
            placeholderZh: '请选择本位币',
            placeholderEn: 'Select standard currency'
        }
    },
    "finance_receivables_customerAccount_list": {
        currency: {
            zh: '币种代码:',
            en: 'Currency Code:',
            placeholderZh: '请输入币种代码',
            placeholderEn: 'Enter currency code'
        },
        balance: {
            zh: '余额:',
            en: 'Balance:',
            placeholderZh: '请输入余额',
            placeholderEn: 'Enter balance'
        },
        creditAmount: {
            zh: '信用额度:',
            en: 'Credit Limit:',
            placeholderZh: '请输入信用额度',
            placeholderEn: 'Enter credit limit'
        },
        preLockAmount: {
            zh: '预锁定金额:',
            en: 'Pre-Locked Amount:',
            placeholderZh: '请输入预锁定金额',
            placeholderEn: 'Enter pre-locked amount'
        },
        usedCredit: {
            zh: '已用信用额度:',
            en: 'Used Credit:',
            placeholderZh: '请输入已使用信用额度',
            placeholderEn: 'Enter used credit'
        },
        remainingCredit: {
            zh: '剩余信用额度:',
            en: 'Remaining Credit:',
            placeholderZh: '请输入剩余信用额度',
            placeholderEn: 'Enter remaining credit'
        },
        availableAmount: {
            zh: '可用金额:',
            en: 'Available Amount:',
            placeholderZh: '请输入可用金额',
            placeholderEn: 'Enter available amount'
        },
    },
    "finance_receivables_customerCredit_list": {
        currency: {
            zh: '币种代码:',
            en: 'Currency Code:',
            placeholderZh: '请选择币种代码',
            placeholderEn: 'Select currency code'
        },
        customerCode: {
            zh: '客户代码:',
            en: 'Customer Code:',
            placeholderZh: '请选择客户代码',
            placeholderEn: 'Select customer code'
        },
        creditAmount: {
            zh: '信用额度:',
            en: 'Credit Amount:',
            placeholderZh: '请输入信用额度',
            placeholderEn: 'Enter credit amount'
        },
        creditStartTime: {
            zh: '生效时间:',
            en: 'Credit Effective Time:',
            placeholderZh: '请选择授信生效时间',
            placeholderEn: 'Select credit effective time'
        },
        creditEndTime: {
            zh: '到期时间:',
            en: 'Credit Expiration Time:',
            placeholderZh: '请选择授信到期时间',
            placeholderEn: 'Select credit expiration time'
        },
        creditTypeId: {
            zh: '授信类型:',
            en: 'Credit Type:',
            placeholderZh: '请选择授信类型',
            placeholderEn: 'Select credit type'
        },
        auditStatusId: {
            zh: '审批状态:',
            en: 'Approval Status:',
            placeholderZh: '请选择审批状态',
            placeholderEn: 'Select approval status'
        },
        effectiveStatusId: {
            zh: '生效状态:',
            en: 'Effective Status:',
            placeholderZh: '请选择生效状态',
            placeholderEn: 'Select effective status'
        }
    },
    "vas_vas_vasServiceType_list": {
        "code": {
            "zh": "类型编码:",
            "en": "Type Code:",
            "placeholderEn": "Please Enter Service Type Code",
            "placeholderZh": "请输入服务类型编码"
        },
        "name": {
            "zh": "类型名称:",
            "en": "Type Name:",
            "placeholderEn": "Please Enter Service Type Name",
            "placeholderZh": "请输入服务类型名称"
        },
        "sceneId": {
            "zh": "适用场景:",
            "en": "Applicable Scene:",
            "placeholderEn": "Please Select Applicable Scene",
            "placeholderZh": "请选择适用场景"
        },
        "description": {
            "zh": "类型描述:",
            "en": "Type Description:",
            "placeholderEn": "Please Enter Service Type Description",
            "placeholderZh": "请输入服务类型描述"
        },
        "isActive": {
            "zh": "是否启用:",
            "en": "Is Active:",
            "placeholderEn": "Please Select Activation Status",
            "placeholderZh": "请选择启用状态"
        },
        "defaultUnit": {
            "zh": "默认单位:",
            "en": "Default Unit:",
            "placeholderEn": "Please Enter Default Unit",
            "placeholderZh": "请输入默认单位"
        },
        "currency": {
            "zh": "币种:",
            "en": "Currency:",
            "placeholderEn": "Please Select Currency",
            "placeholderZh": "请选择币种"
        },
        "defaultPrice": {
            "zh": "默认单价:",
            "en": "Default Unit Price:",
            "placeholderEn": "Please Enter Default Unit Price",
            "placeholderZh": "请输入默认单价"
        },
        "sortNo": {
            "zh": "序号:",
            "en": "Sort Number:",
            "placeholderEn": "Please Enter Sort Number",
            "placeholderZh": "请输入序号"
        }
    },
    "finance_receivables_recharge_list": {
        "platformCallbackTime": {
            "zh": "回调时间:",
            "en": "Platform Callback Time:",
            "placeholderEn": "Please Select Platform Callback Time",
            "placeholderZh": "请选择平台回调时间"
        },
        "customerCode": {
            "zh": "客户代码:",
            "en": "Customer Code:",
            "placeholderEn": "Please Select Customer Code",
            "placeholderZh": "请选择客户代码"
        },
        "paywayId": {
            "zh": "付款方式:",
            "en": "Payment Method:",
            "placeholderEn": "Please Select Payment Method",
            "placeholderZh": "请选择付款方式"
        },
        "currency": {
            "zh": "币种:",
            "en": "Currency:",
            "placeholderEn": "Please Select Currency",
            "placeholderZh": "请选择币种"
        },
        "collectionAccountId": {
            "zh": "收款账户:",
            "en": "Collection Account:",
            "placeholderEn": "Please Select Collection Account",
            "placeholderZh": "请选择收款账户"
        },
        "payAmount": {
            "zh": "充值金额:",
            "en": "Recharge Amount:",
            "placeholderEn": "Please Enter Recharge Amount",
            "placeholderZh": "请输入充值金额"
        },
        "transactionId": {
            "zh": "交易ID:",
            "en": "Transaction ID:",
            "placeholderEn": "Please Enter Transaction ID",
            "placeholderZh": "请输入交易ID"
        },
        "platformStatusId": {
            "zh": "回调结果:",
            "en": "Platform Callback Status:",
            "placeholderEn": "Please Select Platform Callback Status",
            "placeholderZh": "请选择平台回调支付结果"
        },
        "certificate": {
            "zh": "充值凭证:",
            "en": "Recharge Voucher:",
            "placeholderEn": "Please Upload Recharge Voucher",
            "placeholderZh": "请上传充值凭证"
        },
        "statusId": {
            "zh": "充值状态:",
            "en": "Recharge Status:",
            "placeholderEn": "Please Select Recharge Status",
            "placeholderZh": "请选择充值状态"
        }
    },
    "vas_vas_vasOrder_list": {
        "relatedBizType": {
            "zh": "业务类型:",
            "en": "Business Type:",
            "placeholderZh": "请选择业务类型",
            "placeholderEn": "Please Select Business Type"
        },
        "statusId": {
            "zh": "服务状态:",
            "en": "Service Status:",
            "placeholderZh": "请选择服务状态",
            "placeholderEn": "Please Select Service Status"
        },
        "vasOrderNoList": {
            "zh": "服务单号:",
            "en": "Service Order No.:",
            "placeholderZh": "请输入服务单号",
            "placeholderEn": "Please Enter Service Order No."
        },
        "relatedBizNo": {
            "zh": "关联单号:",
            "en": "Related Doc. No.:",
            "placeholderZh": "请输入关联业务单号",
            "placeholderEn": "Please Enter Related Business Doc. No."
        }
    },
    outstock_trace_outTrack_list: {
        'outOrderNo': {
            zh: '订单号:',
            en: 'Outbound Order No.:',
            placeholderZh: '请输入订单号',
            placeholderEn: 'Please Enter Outbound Order No.'
        },
        'isUnlinked': {
            zh: '关联包裹:',
            en: 'Linked Package:',
            placeholderZh: '请选择是否关联包裹',
            placeholderEn: 'Please Select Linked Package'
        },
        'trackingNo': {
            zh: '跟踪单号:',
            en: 'Tracking No.:',
            placeholderZh: '请输入跟踪单号',
            placeholderEn: 'Please Enter Tracking No.'
        },
        'destCountryCode': {
            zh: '目的国家:',
            en: 'Destination Country:',
            placeholderZh: '请输入目的国家代码',
            placeholderEn: 'Please Enter Destination Country Code'
        },
        'supplierId': {
            zh: '服务商:',
            en: 'Supplier:',
            placeholderZh: '请选择服务商',
            placeholderEn: 'Please Select Supplier'
        },
        'shipwayId': {
            zh: '渠道:',
            en: 'Channel:',
            placeholderZh: '请选择渠道',
            placeholderEn: 'Please Select Channel'
        },
        'carrierCode': {
            zh: '承运商:',
            en: 'Carrier:',
            placeholderZh: '请输入承运商',
            placeholderEn: 'Please Enter Carrier'
        },
        'isDelivered': {
            zh: '是否签收:',
            en: 'Is Delivered:',
            placeholderZh: '请选择是否签收',
            placeholderEn: 'Please Select Is Delivered'
        },
        'finished': {
            zh: '是否完结:',
            en: 'Is Finished:',
            placeholderZh: '请选择是否完结',
            placeholderEn: 'Please Select Is Finished'
        },
        'traceTime': {
            zh: '轨迹时间:',
            en: 'Trace Time:',
            placeholderZh: '请选择轨迹时间',
            placeholderEn: 'Please Select Trace Time'
        },
        'traceLocation': {
            zh: '轨迹地点:',
            en: 'Trace Location:',
            placeholderZh: '请输入轨迹地点',
            placeholderEn: 'Please Enter Trace Location'
        },
        'traceEvent': {
            zh: '轨迹详情:',
            en: 'Trace Event:',
            placeholderZh: '请输入轨迹详情',
            placeholderEn: 'Please Enter Trace Event'
        },
        'fileJson': {
            zh: '附件:',
            en: 'Attachment:',
            placeholderZh: '请上传附件',
            placeholderEn: 'Please Upload Attachment'
        },
        'traceTimeBegin': {
            zh: '起始时间:',
            en: 'Start Time:',
            placeholderZh: '请选择起始时间',
            placeholderEn: 'Please Select Start Time'
        },
        'traceTimeEnd': {
            zh: '结束时间:',
            en: 'End Time:',
            placeholderZh: '请选择结束时间',
            placeholderEn: 'Please Select End Time'
        },
        "waybillTypeId": {
            "zh": "运单类型:",
            "en": "Waybill Type:",
            "placeholderZh": "请选择运单类型",
            "placeholderEn": "Select Waybill Type"
        }
    },
    "vas_wo_workOrder_list": {
        "workOrderNo": {
            "zh": "工单单号:",
            "en": "Work Order No.:",
            "placeholderZh": "请输入工单单号",
            "placeholderEn": "Please Enter Work Order No."
        },
        "secondTypeId": {
            "zh": "工单类型：",
            "en": "Work Order Type：",
            "placeholderZh": "请选择工单类型：",
            "placeholderEn": "Please select work order type"
        },
        "priorityId": {
            "zh": "优先级：",
            "en": "Priority：",
            "placeholderZh": "请选择优先级",
            "placeholderEn": "Please select priority"
        },
        "orgId": {
            "zh": "公司：",
            "en": "Company：",
            "placeholderZh": "请选择公司",
            "placeholderEn": "Please select company"
        },
        "customerId": {
            "zh": "客户：",
            "en": "Customer：",
            "placeholderZh": "请选择客户",
            "placeholderEn": "Please select customer"
        },
        "relatedBizType": {
            "zh": "业务类型：",
            "en": "Business Type：",
            "placeholderZh": "请选择关联业务类型",
            "placeholderEn": "Please select related business type"
        },
        "relatedBizNo": {
            "zh": "关联单号：",
            "en": "Related Doc. No.:",
            "placeholderZh": "请输入关联业务单号",
            "placeholderEn": "Please Enter Related Business Doc. No."
        },
        "templateId": {
            "zh": "问题模板：",
            "en": "Problem Template：",
            "placeholderZh": "选择模板自动填充",
            "placeholderEn": "Select template to auto-fill"
        },
        "title": {
            "zh": "标题：",
            "en": "Title：",
            "placeholderZh": "请输入标题",
            "placeholderEn": "Please enter title"
        },
        "content": {
            "zh": "内容：",
            "en": "Content：",
            "placeholderZh": "请输入详细内容",
            "placeholderEn": "Please enter detailed content"
        },
        "isSolved": {
            "zh": "是否解决：",
            "en": "Is Solved：",
            "placeholderZh": "请选择是否解决",
            "placeholderEn": "Please select if solved"
        },
        "isRelated": {
            "zh": "与我有关：",
            "en": "Related to Me：",
            "placeholderZh": "请选择是否与我有关",
            "placeholderEn": "Please select if related to me"
        },
        "typeId": {
            "zh": "一级问题：",
            "en": "First Problem：",
            "placeholderZh": "请选择一级问题类型",
            "placeholderEn": "Please select first problem type"
        },
    },
    "vas_wo_workOrder_add": {
        "secondTypeId": {
            "zh": "工单类型：",
            "en": "Work Order Type：",
            "placeholderZh": "请选择二级类型（仅二级可选）",
            "placeholderEn": "Please select secondary type (only secondary optional)"
        },
        "priorityId": {
            "zh": "优先级：",
            "en": "Priority：",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "relatedBizType": {
            "zh": "单号类型：",
            "en": "Related Business Type：",
            "placeholderZh": "请选择关联业务单号类型",
            "placeholderEn": "Please select related business type"
        },
        "relatedBizNo": {
            "zh": "单号：",
            "en": "Order No.：",
            "placeholderZh": "输入单号后失焦获取详情",
            "placeholderEn": "Enter order no. and lose focus to get details"
        },
        "templateId": {
            "zh": "问题模板：",
            "en": "Problem Template：",
            "placeholderZh": "选择模板自动填充",
            "placeholderEn": "Select template to auto-fill"
        },
        "title": {
            "zh": "标题：",
            "en": "Title：",
            "placeholderZh": "请输入标题",
            "placeholderEn": "Please enter title"
        },
        "content": {
            "zh": "内容：",
            "en": "Content：",
            "placeholderZh": "请输入详细内容",
            "placeholderEn": "Please enter detailed content"
        },
        "fileUrl": {
            "zh": "附件：",
            "en": "Attachment：",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "contact": {
            "zh": "联系人：",
            "en": "Contact Person：",
            "placeholderZh": "请输入联系人",
            "placeholderEn": "Please enter contact person"
        },
        "phone": {
            "zh": "联系电话：",
            "en": "Contact Phone：",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Please enter contact phone"
        }
    },
    "vas_wo_workOrder_upd": {
        "secondTypeId": {
            "zh": "工单类型：",
            "en": "Work Order Type：",
            "placeholderZh": "请选择二级类型（仅二级可选）",
            "placeholderEn": "Please select secondary type (only secondary optional)"
        },
        "priorityId": {
            "zh": "优先级：",
            "en": "Priority：",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "relatedBizType": {
            "zh": "单号类型：",
            "en": "Related Business Type：",
            "placeholderZh": "请选择关联业务单号类型",
            "placeholderEn": "Please select related business type"
        },
        "relatedBizNo": {
            "zh": "单号：",
            "en": "Order No.：",
            "placeholderZh": "输入单号后失焦获取详情",
            "placeholderEn": "Enter order no. and lose focus to get details"
        },
        "templateId": {
            "zh": "问题模板：",
            "en": "Problem Template：",
            "placeholderZh": "选择模板自动填充",
            "placeholderEn": "Select template to auto-fill"
        },
        "title": {
            "zh": "标题：",
            "en": "Title：",
            "placeholderZh": "请输入标题",
            "placeholderEn": "Please enter title"
        },
        "content": {
            "zh": "内容：",
            "en": "Content：",
            "placeholderZh": "请输入详细内容",
            "placeholderEn": "Please enter detailed content"
        },
        "fileUrl": {
            "zh": "附件：",
            "en": "Attachment：",
            "placeholderZh": "",
            "placeholderEn": ""
        },
        "contact": {
            "zh": "联系人：",
            "en": "Contact Person：",
            "placeholderZh": "请输入联系人",
            "placeholderEn": "Please enter contact person"
        },
        "phone": {
            "zh": "联系电话：",
            "en": "Contact Phone：",
            "placeholderZh": "请输入联系电话",
            "placeholderEn": "Please enter contact phone"
        }
    },
    "finance_receivables_fee_list": {
        "inOrderNo": {
            "zh": "入库单号:",
            "en": "Inbound Order No.:",
            "placeholderZh": "请输入入库单号",
            "placeholderEn": "Please Enter Inbound Order No."
        },
        "feeTypeId": {
            "zh": "费用类型:",
            "en": "Fee Type:",
            "placeholderZh": "请选择费用类型",
            "placeholderEn": "Please Select Fee Type"
        },
        "statusId": {
            "zh": "费用状态:",
            "en": "Fee Status:",
            "placeholderZh": "请选择费用状态",
            "placeholderEn": "Please Select Fee Status"
        },
        "createWayId": {
            "zh": "创建方式:",
            "en": "Creation Way:",
            "placeholderZh": "请选择创建方式",
            "placeholderEn": "Please Select Creation Way"
        },
        "outOrderNo": {
            "zh": "出库单号:",
            "en": "Outbound Order No.:",
            "placeholderZh": "请输入出库单号",
            "placeholderEn": "Please Enter Outbound Order No."
        },
        "vasOrderNo": {
            "zh": "服务单号:",
            "en": "VAS Order No.:",
            "placeholderZh": "请输入增值服务单号",
            "placeholderEn": "Please Enter VAS Order No."
        },
        "feeMainTypeId": {
            "zh": "费用大类:",
            "en": "Fee Main Type:",
            "placeholderZh": "请选择费用大类",
            "placeholderEn": "Please Select Fee Main Type"
        },
        "feeSubTypeId": {
            "zh": "费用小类:",
            "en": "Fee Sub Type:",
            "placeholderZh": "请选择费用小类",
            "placeholderEn": "Please Select Fee Sub Type"
        },
        "orderNo": {
            "zh": "关联单号:",
            "en": "Related Doc. No.:",
            "placeholderZh": "请输入关联业务单号",
            "placeholderEn": "Please Enter Related Business Doc. No."
        },
        "billNo": {
            "zh": "账单编号:",
            "en": "Bill No.:",
            "placeholderZh": "请输入账单编号",
            "placeholderEn": "Please Enter Bill No."
        }
    },
    "vas_wo_workOrderType_list": {
        "name": {
            "zh": "类型名称:",
            "en": "Type Name:",
            "placeholderZh": "请输入类型名称",
            "placeholderEn": "Please Enter Type Name"
        },
        "parentId": {
            "zh": "父级类型:",
            "en": "Parent Type:",
            "placeholderZh": "请选择父级类型",
            "placeholderEn": "Please Select Parent Type"
        },
        "sortNo": {
            "zh": "排序:",
            "en": "Sort Number:",
            "placeholderZh": "请输入排序",
            "placeholderEn": "Please Enter Sort Number"
        }
    },
    "product_shipway_traceStatus_list": {
        "remark": {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderZh": "请输入备注",
            "placeholderEn": "Please Enter Remark"
        },
        "statusId": {
            "zh": "状态名称:",
            "en": "Status Name:",
            "placeholderZh": "请输入状态名称",
            "placeholderEn": "Please Enter Status Name"
        },
        "isEnable": {
            "zh": "是否启用:",
            "en": "Is Enable:",
            "placeholderZh": "请选择是否启用",
            "placeholderEn": "Please Select Is Enable"
        },
        "conditionValue": {
            "zh": "条件值:",
            "en": "Condition Value:",
            "placeholderZh": "请输入条件值",
            "placeholderEn": "Please Enter Condition Value"
        }
    },
    "product_price_priceItem_list": {
        "feeMainTypeId": {
            "zh": "费用大类:",
            "en": "Fee Main Type:",
            "placeholderZh": "请选择费用大类",
            "placeholderEn": "Please Select Fee Main Type"
        },
        "feeSubTypeId": {
            "zh": "费用小类:",
            "en": "Fee Sub Type:",
            "placeholderZh": "请选择费用小类",
            "placeholderEn": "Please Select Fee Sub Type"
        },
        "feeUnitTypeId": {
            "zh": "费用单位:",
            "en": "Fee Unit Type:",
            "placeholderZh": "请选择费用单位",
            "placeholderEn": "Please Select Fee Unit Type"
        },
        "priceDimension": {
            "zh": "价格维度:",
            "en": "Price Dimension:",
            "placeholderZh": "请选择价格维度",
            "placeholderEn": "Please Select Price Dimension"
        },
        "chargeCondition": {
            "zh": "收费条件:",
            "en": "Charge Condition:",
            "placeholderZh": "请选择收费条件",
            "placeholderEn": "Please Select Charge Condition"
        },
        "conditionDesc": {
            "zh": "条件说明:",
            "en": "Condition Description:",
            "placeholderZh": "请输入条件说明",
            "placeholderEn": "Please Enter Condition Description"
        },
        "isMandatory": {
            "zh": "是否必填:",
            "en": "Is Mandatory:",
            "placeholderZh": "请选择是否必填",
            "placeholderEn": "Please Select Is Mandatory"
        },
        "sortNo": {
            "zh": "序号:",
            "en": "Sort No.:",
            "placeholderZh": "请输入序号",
            "placeholderEn": "Please Enter Sort No."
        },
        "remark": {
            "zh": "备注:",
            "en": "Remark:",
            "placeholderZh": "请输入备注",
            "placeholderEn": "Please Enter Remark"
        }
    }
}
import router from '@/router/index.js'

// 获取当前路由
const getCurrentRoute = () => {
    const route = router.currentRoute.value
    return route.fullPath // 获取当前路由路径
}

// 转换路由为key
const getRouteKey = () => {
    const currentRoute = getCurrentRoute()
    // 基础转换：去除开头斜杠，替换中间斜杠为下划线
    let routeKey = currentRoute.replace(/^\//, '').replace(/\//g, '_')

    // 关键修改：将非贪婪匹配+?改为贪婪匹配+，确保匹配到最后一个符合条件的后缀
    const suffixMatch = routeKey.match(/^(.+_(list1|list2|list3|list|upd|add|info|copyAdd)).*$/)
    if (suffixMatch) {
        routeKey = suffixMatch[1]
    }

    return routeKey
}

// 自动获取路由的label获取函数
export const getLabel = (key) => {
    const userMenuStore = useUserMenuStore()
    const lang = userMenuStore.lang
    const routeKey = getRouteKey() // 自动获取当前路由key
    // 优先匹配当前路由下的配置
    if (labelsMap[routeKey] && labelsMap[routeKey][key]) {
        return labelsMap[routeKey][key][lang] || key
    }

    // 再匹配general通用配置
    if (labelsMap.general && labelsMap.general[key]) {
        return labelsMap.general[key][lang] || key
    }

    // 都没有则返回原key或默认提示
    return ''
}

// 获取 placeholder
export const getPlaceholder = (key) => {
    const userMenuStore = useUserMenuStore()
    const routeKey = getRouteKey() // 自动获取当前路由key
    const getPlaceholderKey = () => {
        const langSuffix = userMenuStore.lang.slice(-2);
        const capitalizedLangSuffix = langSuffix.charAt(0).toUpperCase() + langSuffix.slice(1);
        return `placeholder${capitalizedLangSuffix}`;
    }

    // 优先匹配当前路由下的配置
    if (labelsMap[routeKey] && labelsMap[routeKey][key]) {
        const placeholderKey = getPlaceholderKey()
        return labelsMap[routeKey][key][placeholderKey] || key;
    }

    // 再匹配general通用配置
    if (labelsMap.general && labelsMap.general[key]) {
        const placeholderKey = getPlaceholderKey()
        return labelsMap.general[key][placeholderKey] || key;
    }

    // 都没有则返回原key或默认提示
    return ''
}

// 获取按钮文字
export const getButtonText = (key) => {
    const userMenuStore = useUserMenuStore()
    const langSuffix = userMenuStore.lang.slice(-2);
    return buttonTextMap[key]?.[langSuffix] || '';
}
