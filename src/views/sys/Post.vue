<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input
                        v-model="searchForm.title"
                        placeholder="标题"
                        clearable
                >
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getPostList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-popconfirm title="确定批量删除吗？" @confirm="delHandle(null)">
                    <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
                </el-popconfirm>
            </el-form-item>
        </el-form>

        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                border
                stripe
                @selection-change="handleSelectionChange">

            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>

<!--            <el-table-column-->
<!--                    label="图片"-->
<!--                    width="120"-->
<!--                    prop="pictures[0].url"-->
<!--            >-->
<!--            <template scope="scope">-->
<!--                <el-image :src="scope.row.cover"></el-image>-->
<!--            </template>-->
<!--            </el-table-column>-->

            <el-table-column label="图片" width="220px">
                <template slot-scope="scope">
                    <img :src="scope.row.cover" width="200" height="100" class="tableImg"/>
                    <el-button @click="onpreview(scope.row.cover)">预览</el-button>
                    <el-image-viewer
                            v-if="showviewer"
                            :on-close="closeviewer"
                            :url-list="urlList"
                            style="width: 80%; height: 80%; margin-left: 10%; margin-top: 5%"/>
                </template>
            </el-table-column>

            <el-table-column
                    prop="title"
                    label="标题"
                    width="120">
            </el-table-column>

            <el-table-column
                    prop="text"
                    label="文字内容">
            </el-table-column>

            <el-table-column
                    prop="created"
                    width="200"
                    label="创建时间"
            >
            </el-table-column>
            <el-table-column
                    prop="statue"
                    label="状态"
                    width="100"
            >
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statue === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statue === 0" type="danger">禁用</el-tag>
                </template>

            </el-table-column>
            <el-table-column
                    prop="icon"
                    width="130px"
                    label="操作"

            >

                <template slot-scope="scope"  >

                    <template>
                        <el-popconfirm title="确定删除吗？" @confirm="delHandle(scope.row.id)">
                            <el-button type="text" slot="reference">删除</el-button>
                        </el-popconfirm>
                    </template>

                </template>
            </el-table-column>

        </el-table>

        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="current"
                :page-size="size"
                :total="total">
        </el-pagination>


    </div>
</template>

<script>

    import elImageViewer from 'element-ui/packages/image/src/image-viewer'
    import qs from 'qs'
    export default {
        name: "Post",
        components: { elImageViewer },
        data() {
            return {
                searchForm: {},
                delBtlStatu: true,

                showviewer: false,
                urlList: [],

                total: 0,
                size: 10,
                current: 1,
                dialogVisible: false,

                tableData: [],

                multipleSelection: [],

                roleDialogFormVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleForm: {},
                roleTreeData:  [],
                treeCheckedKeys: [],
                checkStrictly: true,
                pictures: []

            }
        },
        created() {
            this.getPostList()

            this.$axios.get("/sys/role/list").then(res => {
                this.roleTreeData = res.data.data.records;

            })
        },
        methods: {
            // 关闭查看器
            closeviewer() {
                this.showviewer = false
                this.urlList = []
            },
            onpreview(url) {
                this.urlList.push(url)
                this.showviewer = true
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                console.log("勾选")
                console.log(val)
                this.multipleSelection = val;
                this.delBtlStatu = val.length == 0
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getUserList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getUserList()
            },

            handleClose() {
                this.resetForm('editForm')
            },

            getPostList() {
                this.$axios.get("/sys/post/list", {
                    params: {
                        title: this.searchForm.title,
                        current: this.current,
                        size: this.size
                    }
                }).then(res => {

                    this.tableData = res.data.data.records
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                    //this.pictures = res.data.data.records.pictures;
                    //console.log(res.data.data)
                    // console.log(JSON.parse(qs.stringify(res.data.data)).pictures);
                    // console.log("tabledata")
                     console.log(res.data.data.records)
                    // console.log(this.tableData);
                })
            },


            editHandle(id) {
                this.$axios.get('/sys/post/info/' + id).then(res => {
                    this.editForm = res.data.data

                    this.dialogVisible = true
                })
            },
            delHandle(id) {

                var ids = []

                if (id) {
                    ids.push(id)
                } else {
                    this.multipleSelection.forEach(row => {
                        ids.push(row.id)
                    })
                }

                console.log(ids)

                this.$axios.post("/sys/post/delete", ids).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功',
                        type: 'success',
                        onClose:() => {
                            this.getPostList()
                        }
                    });
                })
            },


            picturesHandler(picture){
                return picture.url;
            }
        }
    }
</script>

<style scoped>

    .el-pagination {
        float: right;
        margin-top: 22px;
    }

</style>