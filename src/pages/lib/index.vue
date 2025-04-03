<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-box">
      <input type="text" class="search-input" placeholder="搜索大学的名称" />
      <text class="search-icon">🔍</text>
    </view>

    <!-- 筛选条件 -->
    <view class="filter-box">
      <view class="filter-item" @click="showCityDropdown = !showCityDropdown">
        <text>{{ selectedCity || "院校城市" }}</text>
        <text class="arrow" :class="{ 'arrow-up': showCityDropdown }">▼</text>
        <!-- 城市下拉框 -->
        <view v-if="showCityDropdown" class="dropdown-menu">
          <view
            v-for="city in cityOptions"
            :key="city"
            class="dropdown-item"
            @click.stop="handleCitySelect(city)"
          >
            {{ city }}
          </view>
        </view>
      </view>
      <view class="filter-item" @click="showTypeDropdown = !showTypeDropdown">
        <text>{{ selectedType || "院校类型" }}</text>
        <text class="arrow" :class="{ 'arrow-up': showTypeDropdown }">▼</text>
        <!-- 类型下拉框 -->
        <view v-if="showTypeDropdown" class="dropdown-menu">
          <view
            v-for="type in typeOptions"
            :key="type"
            class="dropdown-item"
            @click.stop="handleTypeSelect(type)"
          >
            {{ type }}
          </view>
        </view>
      </view>
    </view>


    <!-- 院校列表 -->
    <view class="school-list">
      <view class="school-item" v-for="school in schools" :key="school.id">
        <image class="school-logo" :src="school.logo" mode="aspectFit" />
        <view class="school-info">
          <text class="school-name">{{ school.name }}</text>
          <view class="school-location">
            <text>{{ school.location }}</text>
            <text class="divider">|</text>
            <text>{{ school.type }}</text>
          </view>
          <view class="school-tags">
            <text class="tag" v-for="tag in school.tags" :key="tag">{{
              tag
            }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 筛选选项数据
const cityOptions = [
  "北京市",
  "上海市",
  "浙江省",
  "江苏省",
  "安徽省",
  "湖北省",
];

const typeOptions = ["综合类", "理工类"];

// 下拉框显示状态
const showCityDropdown = ref(false);
const showTypeDropdown = ref(false);

// 选中的筛选条件
const selectedCity = ref("");
const selectedType = ref("");

// 处理筛选条件选择
const handleCitySelect = (city: string) => {
  selectedCity.value = city;
  showCityDropdown.value = false;
};

const handleTypeSelect = (type: string) => {
  selectedType.value = type;
  showTypeDropdown.value = false;
};

const schools = [
  {
    id: 1,
    name: "清华大学",
    logo: "/static/logo.png",
    location: "北京市",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属", "强基计划"],
  },
  {
    id: 2,
    name: "北京大学",
    logo: "/static/logo.png",
    location: "北京市",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属", "强基计划"],
  },
  {
    id: 3,
    name: "复旦大学",
    logo: "/static/logo.png",
    location: "上海市",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 4,
    name: "浙江大学",
    logo: "/static/logo.png",
    location: "浙江省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 5,
    name: "南京大学",
    logo: "/static/logo.png",
    location: "江苏省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 6,
    name: "中国科学技术大学",
    logo: "/static/logo.png",
    location: "安徽省",
    type: "理工类",
    tags: ["985", "211", "双一流", "中科院直属"],
  },
  {
    id: 7,
    name: "武汉大学",
    logo: "/static/logo.png",
    location: "湖北省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 8,
    name: "上海交通大学",
    logo: "/static/logo.png",
    location: "上海市",
    type: "理工类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
];
</script>

<style lang="scss">
.container {
  padding: 20rpx;

  .search-box {
    position: relative;
    margin-bottom: 20rpx;

    .search-input {
      width: 85%;
      height: 80rpx;
      padding: 0 80rpx 0 30rpx;
      background: #f5f5f5;
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
      background: #f5f5f5;
      margin-right: 20rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
      position: relative;

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

  .school-list {
    .school-item {
      display: flex;
      padding: 20rpx 0;
      border-bottom: 2rpx solid #f5f5f5;

      .school-logo {
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
        border-radius: 50%;
      }

      .school-info {
        flex: 1;

        .school-name {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
        }

        .school-location {
          font-size: 26rpx;
          color: #666;
          margin-bottom: 10rpx;

          .divider {
            margin: 0 10rpx;
            color: #999;
          }
        }

        .school-tags {
          display: flex;
          flex-wrap: wrap;

          .tag {
            padding: 4rpx 16rpx;
            background: #f0f7ff;
            color: #007aff;
            border-radius: 20rpx;
            font-size: 24rpx;
            margin-right: 10rpx;
            margin-bottom: 10rpx;
          }
        }
      }
    }
  }
}
</style>
