<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-box">
      <input
        type="text"
        class="search-input"
        placeholder="搜索学习资料"
        @blur="handleSearchInput"
      />
      <text class="search-icon">🔍</text>
    </view>

    <!-- 筛选条件 -->
    <view class="filter-box">
      <view
        class="filter-item"
        @click="showCategoryDropdown = !showCategoryDropdown"
      >
        <text>{{ selectedCategory || "资料分类" }}</text>
        <text class="arrow" :class="{ 'arrow-up': showCategoryDropdown }"
          >▼</text
        >
        <!-- 分类下拉框 -->
        <view v-if="showCategoryDropdown" class="dropdown-menu">
          <view
            v-for="category in categoryOptions"
            :key="category"
            class="dropdown-item"
            @click.stop="handleCategorySelect(category)"
          >
            {{ category }}
          </view>
        </view>
      </view>

      <view
        class="filter-item"
        @click="showSubjectDropdown = !showSubjectDropdown"
      >
        <text>{{ selectedSubject || "学科分类" }}</text>
        <text class="arrow" :class="{ 'arrow-up': showSubjectDropdown }"
          >▼</text
        >
        <!-- 学科下拉框 -->
        <view v-if="showSubjectDropdown" class="dropdown-menu">
          <view
            v-for="subject in subjectOptions"
            :key="subject"
            class="dropdown-item"
            @click.stop="handleSubjectSelect(subject)"
          >
            {{ subject }}
          </view>
        </view>
      </view>
    </view>

    <!-- 资料列表 -->
    <view class="material-list">
      <view
        class="material-item"
        v-for="material in materials"
        :key="material.id"
      >
        <image
          class="material-logo"
          :src="`https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/study.svg`"
          mode="aspectFit"
        />
        <view class="material-info">
          <text class="material-name">{{ material.name }}</text>
          <view class="material-tags">
            <text class="tag">{{ material.fileType }}</text>
            <text class="tag">{{ material.materialType }}</text>
          </view>
        </view>
        <view>
          <button
            class="download-button"
            @click="downloadStudyFile(material.name)"
          >
            下载
          </button>
          <text class="m-memory">{{ material.memorySize }}</text>
          <text class="m-time">{{ material.createTime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { fileApi, studyApi } from "@/api";
import { page } from "hexo/dist/plugins/helper/is";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";

// 筛选选项数据
const categoryOptions = ["课件", "真题", "资料", "笔记"];
const subjectOptions = ["高数", "英语", "政治", "专业课"];
const fileTypeMap = { 1: "课件", 2: "真题", 3: "资料", 4: "笔记" };
const studyTypeMap = { 1: "高数", 2: "英语", 3: "政治", 4: "专业课" };
const mapFileType = { "课件": 1, "真题": 2, "资料": 3, "笔记": 4 };
const mapStudyTypeMap = { "高数": 1, "英语": 2, "政治": 3, "专业课": 4 };
const currentPage = ref(1);
const pageSize = ref(10);
const fileType = ref("");
const materialType = ref("");
const fileName = ref("");
const loading = ref(false);

// 下拉框显示状态
const showCategoryDropdown = ref(false);
const showSubjectDropdown = ref(false);

// 选中的筛选条件
const selectedCategory = ref("");
const selectedSubject = ref("");

// 处理筛选条件选择
const handleCategorySelect = (category: string) => {
  selectedCategory.value = category;
  fileType.value = category;
  showCategoryDropdown.value = false;
  queryMaterials(true);
};
const handleSubjectSelect = (subject: string) => {
  selectedSubject.value = subject;
  materialType.value = subject;
  showSubjectDropdown.value = false;
  queryMaterials(true);
};

const downloadStudyFile = (fileName: string) => {
  fileApi.download(fileName).then((res) => {
    uni.showToast({
      title: "下载成功",
      icon: "success",
    });
  });
};

interface Material {
  id: number;
  name: string;
  fileType: string;
  materialType: string;
  memorySize: string;
  createTime: string;
}

const materials = ref<Material[]>([
  {
    id: 0,
    name: "高等数学教材",
    materialType: "高数",
    fileType: "课件",
    memorySize: "100MB",
    createTime: "2023-05-10",
  },
  {
    id: 1,
    name: "英语语法指南",
    materialType: "高数",
    fileType: "课件",
    memorySize: "100MB",
    createTime: "2023-05-10",
  },
  {
    id: 2,
    name: "政治理论笔记",
    materialType: "高数",
    fileType: "课件",
    memorySize: "100MB",
    createTime: "2023-05-10",
  },
  {
    id: 3,
    name: "数据结构与算法",
    materialType: "高数",
    fileType: "课件",
    memorySize: "100MB",
    createTime: "2023-05-10",
  },
]);

const queryMaterials = async (isRefresh = false) => {
  loading.value = true;
  const res = await studyApi.query({
    page: isRefresh ? 1 : currentPage.value++,
    pageSize: pageSize.value,
    fileType: mapFileType[fileType.value],
    materialType: mapStudyTypeMap[materialType.value],
    fileName: fileName.value,
  });
  let newMs = [];
  if (res.data.total == null) {
    uni.showToast({
      title: "未查询到数据",
      icon: "none",
    });
  } else {
    newMs = res.data.list.map((item) => ({
      id: item.id,
      name: item.name,
      fileType: fileTypeMap[item.fileType],
      materialType: studyTypeMap[item.materialType],
      memorySize: formatFileSize(item.memorySize),
      createTime: new Date(item.createTime).toISOString().split("T")[0],
    }));
  }
  materials.value = isRefresh ? newMs : [...materials.value, ...newMs];
  loading.value = false;
};
const handleSearchInput = (event) => {
  fileName.value = event.target.value;
  queryMaterials(true);
};

// 触底加载更多
onReachBottom(() => {
  if (!loading.value) {
    queryMaterials();
  }
});

onLoad(() => {
  queryMaterials(true);
});

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
};
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  background: linear-gradient(to bottom, #e6f2ff, #f5f5f5 1000rpx);

  .search-box {
    position: relative;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);

    .search-input {
      width: 85%;
      height: 80rpx;
      padding: 0 80rpx 0 30rpx;
      background: #fefefe;
      border-radius: 40rpx;
      font-size: 28rpx;
    }

    .search-icon {
      position: absolute;
      right: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      font-size: 32rpx;
      color: #999;
    }
  }

  .filter-box {
    display: flex;
    margin-bottom: 20rpx;

    .filter-item {
      flex: 1;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30rpx;
      background: #fff;
      margin-right: 20rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
      position: relative;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;

      &:active {
        transform: translateY(2rpx);
      }

      &:last-child {
        margin-right: 0;
      }

      .arrow {
        font-size: 24rpx;
        color: #999;
        transition: transform 0.3s;

        &.arrow-up {
          transform: rotate(180deg);
        }
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: #fff;
        border-radius: 10rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
        z-index: 100;
        margin-top: 10rpx;

        .dropdown-item {
          padding: 20rpx 30rpx;
          font-size: 28rpx;
          color: #333;
          border-bottom: 2rpx solid #f5f5f5;

          &:last-child {
            border-bottom: none;
          }

          &:active {
            background: #f5f5f5;
          }
        }
      }
    }
  }

  .material-list {
    .material-item {
      display: flex;
      padding: 24rpx;
      margin: 16rpx 0;
      background: #f8fbff;
      border-radius: 16rpx;
      box-shadow: 0 4rpx 16rpx rgba(0, 102, 204, 0.12);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: 2rpx solid #cce5ff;
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 8rpx;
        height: 100%;
        background: linear-gradient(to bottom, #0066cc, #0099ff);
      }

      &:active {
        transform: scale(0.98);
      }

      .material-logo {
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
        border-radius: 50%;
      }

      .material-info {
        flex: 1;

        .material-name {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
        }

        .material-tags {
          display: flex;
          flex-wrap: wrap;

          .tag {
            padding: 4rpx 16rpx;
            background: linear-gradient(to bottom, #e6f2ff, #cce5ff);
            color: #0066cc;
            border-radius: 20rpx;
            font-size: 24rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
            border: 1rpx solid #b3d9ff;
            box-shadow: 0 2rpx 6rpx rgba(0, 102, 204, 0.1);
          }
        }
      }
    }

    .download-button {
      background: linear-gradient(to bottom, #0066cc, #0099ff);
      color: #fff;
      border: none;
      font-size: 25rpx;
      border-radius: 20rpx;
      max-width: 150rpx;
      margin-left: 100rpx;
      margin-top: 20rpx;
    }

    .m-memory {
      font-size: 24rpx;
      color: #999;
      margin-left: 10rpx;
    }
    .m-time {
      font-size: 24rpx;
      color: #999;
      margin-left: 30rpx;
    }
  }
}
</style>
