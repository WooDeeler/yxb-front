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
      <view
        class="school-item"
        v-for="school in schools"
        :key="school.id"
        @click="navigateToLibDetail(school.id)"
      >
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


const navigateToLibDetail = (schoolId: number) => {
  uni.navigateTo({ url: `/pages/libDetail/index` });
}

const schools = [
  {
    id: 0,
    name: "华东交通大学",
    logo: "/static/ulogo/ECJTU.svg",
    location: "南昌市",
    type: "理工类",
    tags: ["省部共建"],
  },
  {
    id: 1,
    name: "清华大学",
    logo: "/static/ulogo/THU.svg",
    location: "北京市",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 2,
    name: "北京大学",
    logo: "/static/ulogo/PKU.svg",
    location: "北京市",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 3,
    name: "浙江大学",
    logo: "/static/ulogo/ZJU.svg",
    location: "浙江省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 4,
    name: "上海交通大学",
    logo: "/static/ulogo/SJTU.svg",
    location: "上海市",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 5,
    name: "南京大学",
    logo: "/static/ulogo/NJU.svg",
    location: "江苏省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 6,
    name: "复旦大学",
    logo: "/static/ulogo/FDU.svg",
    location: "上海市",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 7,
    name: "中国科学技术大学",
    logo: "/static/ulogo/USTC.svg",
    location: "安徽省",
    type: "理工类",
    tags: ["985", "211", "双一流", "中国科学院直属"],
  },
  {
    id: 8,
    name: "华中科技大学",
    logo: "/static/ulogo/HUST.svg",
    location: "湖北省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 9,
    name: "武汉大学",
    logo: "/static/ulogo/WHU.svg",
    location: "湖北省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
  {
    id: 10,
    name: "西安交通大学",
    logo: "/static/ulogo/XJTU.svg",
    location: "陕西省",
    type: "综合类",
    tags: ["985", "211", "双一流", "教育部直属"],
  },
];
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

  .school-list {
    .school-item {
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
  }
}
</style>
