<template>
    <div class="viewArea">
        <div class="filterDiv">
            <hydFilterBox :form-items="formConfig" :initial-value="initValues" @search="handleSearch"
                @reset="handleReset">
                <!-- <template #custom-form="{ formData }">
          <el-col >
            <el-form-item label="插槽测试：" class="compact-item">
              <el-input v-model="formData.customInput" placeholder="请输入测试内容" />
            </el-form-item>
          </el-col>
        </template> -->
                <!-- <template #custom-form="{ formData, getColSpan }">
                    <el-col >
                        <el-form-item label="自定义:" class="compact-item">
                            <el-select v-model="formData.customSelect" placeholder="请选择选项" clearable>
                                <el-option v-for="option in customOptions" :key="option.value" :label="option.label"
                                    :value="option.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template> -->
                <template #custom-form="{ formData }">
                    <el-col>
                        <el-form-item label="自定义:" class="compact-item">
                            <el-select v-model="formData.customSelect" placeholder="请选择选项" clearable>
                                <el-option v-for="option in customOptions" :key="option.value" :label="option.label"
                                    :value="option.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </template>
            </hydFilterBox>
        </div>
        <div class="tableDiv">
            <hydTable :footer="footer" :tableData="tableData" :columns="columns" :pagination="pagination"
                :enableSelection="true" :loading="loading" :pageSizes="[10, 20, 50]" :is-tree="true" :row-key="id"
                :tree-props="{ children: 'children' }" @selection-change="handleSelectionChange"
                @row-click="handleRowClick" @page-change="handlePageChange" @sort-change="handleTableSort">
                <!-- 在表格上方通过 slot 插入按钮 -->
                <template #table-buttons>
                    <el-button type="primary" @click="handleAdd" v-permission="'inReceipt:add'">{{getButtonText ('add') }}</el-button>
                    <el-button type="warning" @click="handleBatchDelete" v-permission="'inReceipt:edit'">{{getButtonText ('edit') }}</el-button>
                    <el-button type="success" @click="handleExport" v-permission="'inReceipt:delete'">{{getButtonText ('del') }}</el-button>
                </template>
                <!-- 使用插槽来自定义列内容，假如我们需要在操作列中添加按钮 -->
                <template #customBtn="{ row, column, index }">
                    <a href="#" style="margin: 0 2px;">{{getButtonText ('log') }}</a>
                    <a href="#" style="margin: 0 2px;">备注</a>
                    <a href="#" style="margin: 0 2px;">任务单</a>
                    <a href="#" style="margin: 0 2px;">货运参数</a>
                    <!-- <el-button size="mini" type="primary" @click="handleEdit(row)">{{getButtonText ('edit') }}</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(row)">{{getButtonText ('del') }}</el-button> -->
                </template>
                <template #name="{ row }">
                    <span>{{ row.name }}</span>
                </template>
            </hydTable>
        </div>

    </div>
</template>
<script setup name="上架">
import hydFilterBox from "@/components/table/hyd-filterBox.vue";
import hydTable from "@/components/table/hyd-table.vue";
import { smartAlert } from '@/utils/genericMethods.js'
// 搜索表单配置项------------------------------------------------
// 配置表单项，使用所有支持的类型
const formConfig = ref([
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    { type: 'input', label: '用户名', prop: 'username' },
    {
        type: 'select', label: '用户角色', prop: 'role', options: [
            { label: '管理员', value: 'admin' },
            { label: '用户', value: 'user' },
            { label: '访客', value: 'guest' }
        ]
    },
    { type: 'date', label: '注册日期', prop: 'registerDate', mode: 'single' }, // 单选日期
    { type: 'date', label: '活动时间', prop: 'eventDate', mode: 'range' }, // 选择日期范围
    {
        type: 'radio', label: '性别', prop: 'gender', options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
        ]
    },
    { type: 'switch', label: '是否启用', prop: 'isActive' },

    { type: 'date', label: '注册日期', prop: 'registerDate', mode: 'single' }, // 单选日期
    { type: 'date', label: '活动时间', prop: 'eventDate', mode: 'range' }, // 选择日期范围
    {
        type: 'radio', label: '性别', prop: 'gender', options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
        ]
    },
    { type: 'switch', label: '是否启用', prop: 'isActive' },
    { type: 'date', label: '注册日期', prop: 'registerDate', mode: 'single' }, // 单选日期
    { type: 'date', label: '活动时间', prop: 'eventDate', mode: 'range' }, // 选择日期范围
    { type: 'switch', label: '是否启用', prop: 'isActive' },
    {
        type: 'radio', label: '性别', prop: 'gender', options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
        ]
    },
    {
        type: 'checkbox', label: '兴趣爱好', prop: 'hobbies', options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '旅行', value: 'travel' }
        ]
    }
])

// 初始化表单数据
const initValues = ref({
    username: '',
    role: '',
    registerDate: '',
    eventDate: [],
    isActive: false,
    gender: '',
    hobbies: [],
    customSelect: '' // 插槽中的下拉框
})

// 插槽下拉框的选项
const customOptions = ref([
    { label: '选项 A', value: 'A' },
    { label: '选项 B', value: 'B' },
    { label: '选项 C', value: 'C' }
])

// 搜索事件
const handleSearch = (data) => {
    console.log('搜索数据:', data)
    smartAlert('提示内容', true, 2000)
}
// 重置事件
const handleReset = () => {
    console.log('重置表单')
    // smartAlert('提示内容', false)
}
// 表格数据--------------------------------------
const tableData = ref([
    {
        id: 15,
        name: '沈十七',
        age: 26,
        gender: '男',
        status: '正常',
        test: '测试',
        email: 'shen17@example.com',
        phone: '13800138015',
        address: '地址1',
        department: '部门1',
        position: '职位1',
        salary: 5000,
        entryDate: '2025-01-01',
        children: [
            { id: 151, name: '沈十七-子1', age: 20, gender: '男', status: '正常', test: '测试', email: 'shen17-1@example.com', phone: '138001380151', address: '地址1-子1', department: '部门1-子1', position: '职位1-子1', salary: 3000, entryDate: '2025-02-01' },
            { id: 152, name: '沈十七-子2', age: 22, gender: '女', status: '冻结', test: '测试', email: 'shen17-2@example.com', phone: '138001380152', address: '地址1-子2', department: '部门1-子2', position: '职位1-子2', salary: 3500, entryDate: '2025-03-01' }
        ]
    },
    {
        id: 16,
        name: '韩十八',
        age: 35,
        gender: '女',
        status: '冻结',
        test: '测试',
        email: 'han18@example.com',
        phone: '13800138016',
        address: '地址2',
        department: '部门2',
        position: '职位2',
        salary: 6000,
        entryDate: '2025-02-01',
        children: [
            { id: 161, name: '韩十八-子1', age: 21, gender: '男', status: '正常', test: '测试', email: 'han18-1@example.com', phone: '138001380161', address: '地址2-子1', department: '部门2-子1', position: '职位2-子1', salary: 3200, entryDate: '2025-04-01' },
            { id: 162, name: '韩十八-子2', age: 23, gender: '女', status: '冻结', test: '测试', email: 'han18-2@example.com', phone: '138001380162', address: '地址2-子2', department: '部门2-子2', position: '职位2-子2', salary: 3700, entryDate: '2025-05-01' }
        ]
    },
    { id: 17, name: '杨十九', age: 29, gender: '男', status: '正常', test: '测试', email: 'yang19@example.com', phone: '13800138017', address: '地址3', department: '部门3', position: '职位3', salary: 5500, entryDate: '2025-03-01' },
    { id: 18, name: '朱二十', age: 31, gender: '女', status: '冻结', test: '测试', email: 'zhu20@example.com', phone: '13800138018', address: '地址4', department: '部门4', position: '职位4', salary: 6500, entryDate: '2025-04-01' },
    { id: 19, name: '秦二十一', age: 27, gender: '男', status: '正常', test: '测试', email: 'qin21@example.com', phone: '13800138019', address: '地址5', department: '部门5', position: '职位5', salary: 5200, entryDate: '2025-05-01' },
    { id: 20, name: '尤二十二', age: 33, gender: '女', status: '冻结', test: '测试', email: 'you22@example.com', phone: '13800138020', address: '地址6', department: '部门6', position: '职位6', salary: 6200, entryDate: '2025-06-01' },
    { id: 1, name: '张三', age: 28, gender: '男', status: '正常', test: '测试' },
    { id: 2, name: '李四', age: 32, gender: '女', status: '冻结', test: '测试' },
    { id: 3, name: '王五', age: 25, gender: '男', status: '正常', test: '测试' },
    { id: 4, name: '赵六', age: 30, gender: '女', status: '冻结', test: '测试' },
    { id: 5, name: '钱七', age: 27, gender: '男', status: '正常', test: '测试' },
    { id: 6, name: '孙八', age: 31, gender: '女', status: '冻结', test: '测试' },
    { id: 7, name: '周九', age: 26, gender: '男', status: '正常', test: '测试' },
    { id: 8, name: '吴十', age: 33, gender: '女', status: '冻结', test: '测试' },
    { id: 9, name: '郑十一', age: 29, gender: '男', status: '正常', test: '测试' },
    { id: 10, name: '冯十二', age: 34, gender: '女', status: '冻结', test: '测试' },
    { id: 11, name: '陈十三', age: 28, gender: '男', status: '正常', test: '测试' },
    { id: 12, name: '褚十四', age: 32, gender: '女', status: '冻结', test: '测试' },
    { id: 13, name: '卫十五', age: 25, gender: '男', status: '正常', test: '测试' },
    { id: 14, name: '蒋十六', age: 30, gender: '女', status: '冻结', test: '测试' },
    { id: 14, name: '蒋十六', age: 30, gender: '女', status: '冻结', test: '测试' },
])
// 表格列配置
const columns = ref([
    { label: '姓名', prop: 'name', width: '120', sortable: true },
    { label: '年龄', prop: 'age', width: '80', sortable: true },
    { label: '性别', prop: 'gender', width: '80' },
    { label: '测试', prop: 'test', width: '100' },
    { label: '状态', prop: 'status', width: '100' },
    { label: '状态', prop: 'status', width: '100' },
    { label: '邮箱', prop: 'email', width: '200' },
    { label: '电话', prop: 'phone', width: '120' },
    { label: '地址', prop: 'address', width: '200' },
    { label: '部门', prop: 'department', width: '120' },
    { label: '职位', prop: 'position', width: '120' },
    { label: '薪资', prop: 'salary', width: '100' },
    { label: '入职日期', prop: 'entryDate', width: '120' },
    // 使用插槽定制操作列，指定 slot 名称，与 CustomTable 内部 <slot name="customBtn"> 对应\n
    { label: '操作', prop: 'action', width: '220', fixed: 'right', slot: 'customBtn' }
])

const footer = ref({
    age: '25',
    gender: '男',
    id: '合计'
})

const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 99 // 假设共有100条数据
})

const loading = ref(false)

// 事件回调
const handleSelectionChange = (selection) => {
    console.log('选中的行：', selection)
}

const handleRowClick = (row) => {
    console.log('点击的行数据：', row)
}

const handlePageChange = ({ pageSize, currentPage }) => {
    console.log('分页变化：', pageSize, currentPage)
    // 这里可以重新获取数据
}
// 点滴表格排序
const handleTableSort = (sortString) => {
    console.log('排序条件返回:', sortString)
    // 根据 sortString 请求后端数据，例如：
    // fetchData({ sort: sortString })
}

const handleEdit = (row) => {
    console.log('编辑：', row)
}

const handleDelete = (row) => {
    console.log('删除：', row)
}
</script>

<style scoped lang="scss">
.viewArea {
    display: flex;
    flex-direction: column;
}

.tableDiv {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    // 四周阴影
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex: 1;
    overflow: hidden;
    background-color: white;
    // 圆角
    border-radius: 4px;
    padding: 0 16px;
    min-height: 300px;
}
</style>