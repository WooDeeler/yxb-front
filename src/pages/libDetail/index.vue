<template>
  <view class="container">
    <!-- 加载动画 -->
    <uni-load-more
      v-if="loading"
      status="loading"
      :icon-size="16"
      :content-text="{
        contentdown: '上拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据了',
      }"
    />

    <view class="header-section">
      <!-- 院校基本信息 -->
      <view class="university-card">
        <view class="university-header">
          <image class="university-logo" :src="university.badge" />
          <view class="university-info">
            <text class="university-name">{{ university.name }}</text>
            <!-- <text class="university-tag">{{ university.tags }}</text> -->
          </view>
          <view class="school-tags">
            <text class="tag">{{ university.tags[0] || "" }}</text>
          </view>
        </view>
        <view class="university-details">
          <view class="detail-item">
            <uni-icons type="location" size="16" color="#007aff" />
            <text>{{ university.city }}</text>
          </view>
          <view class="detail-item">
            <uni-icons type="star" size="16" color="#007aff" />
            <text>{{ university.type }}</text>
          </view>
        </view>
      </view>

      <!-- 院校详细介绍 -->
      <view class="university-description">
        <text class="description-title">院校介绍</text>
        <text class="description-content">{{ university.introduction }}</text>
      </view>

      <!-- 专业分类栏 -->
      <scroll-view class="category-bar" scroll-x="true">
        <view
          v-for="(category, index) in categories"
          :key="index"
          class="category-item"
          :class="{ active: currentCategory === index }"
          @click="handleCategoryClick(index)"
        >
          {{ category }}
        </view>
      </scroll-view>

      <!-- 年份筛选 -->
      <view class="year-filter">
        <uni-data-select
          v-model="selectedYear"
          :localdata="yearOptions"
          placeholder="请选择年份"
          clearable
          @change="handleYearChange"
          class="year-select"
        />
      </view>

      <!-- 招生分数线 -->
      <view class="score-table">
        <view class="table-header">
          <text>年份</text>
          <text>专业</text>
          <text>最低分</text>
          <text>国家线</text>
        </view>
        <view class="table-row" v-for="(score, index) in scores" :key="index">
          <text>{{ score.years }}</text>
          <text>{{ score.majorName }}</text>
          <text>{{ score.score }}</text>
          <text>{{ score.countryScore }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { majorApi, schoolApi } from "@/api";

const currentCategory = ref(0);
const loading = ref(false);
const selectedYear = ref("");
const yearOptions = ref([
  { value: "", text: "全部年份" },
  { value: "2023", text: "2023年" },
  { value: "2022", text: "2022年" },
  { value: "2021", text: "2021年" },
]);

const categories = ref(["全部", "文史", "理科", "工科", "艺术", "体育"]);

interface Univ {
  id: number;
  name: string;
  majorInfo: string[];
  type: string;
  introduction: string;
  city: string;
  badge: string;
  tags: string[];
}

interface Major {
  id: number;
  universityId: number;
  universityName: string;
  majorName: string;
  years: string;
  type: number;
  score: number;
  countryScore: number;
}

const university = ref<Univ>({
  name: "华东交通大学",
  majorInfo: ["全部", "文史", "理科", "工科", "艺术", "体育"],
  badge: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/ECJTU.svg",
  city: "江西省南昌市",
  type: "本科",
  tags: ["省部共建"],
  introduction: `华东交通大学是一所以工为主，经、管、文、理、法、教育、艺术等多学科协调发展，以交通为特色、轨道为核心的教学研究型大学。学校创建于1971年，原隶属铁道部，2000年转制为"中央与地方共建，以地方管理为主"，是国家"中西部高校基础能力建设工程"高校，江西省重点加强建设高校。`,
});

const scores = ref<Major>([
  {
    years: "2023",
    majorName: "计算机科学与技术",
    score: 350,
    countryScore: 120,
  },
  {
    years: "2023",
    majorName: "电气工程",
    score: 340,
    countryScore: 150,
  },
  {
    years: "2023",
    majorName: "土木工程",
    score: 330,
    countryScore: 180,
  },
  {
    years: "2023",
    majorName: "经济学",
    score: 360,
    countryScore: 110,
  },
  {
    years: "2022",
    majorName: "计算机科学与技术",
    score: 345,
    countryScore: 125,
  },
  {
    years: "2022",
    majorName: "电气工程",
    score: 335,
    countryScore: 155,
  },
  {
    years: "2022",
    majorName: "机械工程",
    score: 325,
    countryScore: 190,
  },
  {
    years: 2022,
    majorName: "金融学",
    score: 355,
    countryScore: 115,
  },
  {
    years: "2021",
    majorName: "计算机科学与技术",
    score: 340,
    countryScore: 130,
  },
  {
    years: "2021",
    majorName: "电气工程",
    score: 360,
    countryScore: 160,
  },
]);

const navigateToSearchPage = () => {
  uni.navigateTo({ url: "/pages/searchPage/index" });
};

const handleCategoryClick = (index: number) => {
  currentCategory.value = index;
  getMajor();
};

const handleYearChange = (value: string) => {
  selectedYear.value = value;
  getMajor();
};

const getDetail = async (id: string) => {
  try {
    const res = await schoolApi.getDetail(id);
    if (res.data) {
      university.value = {
        ...res.data,
        tags: splitStr(res.data.tags),
        majorInfo: splitStr(res.data.majorInfo),
      };
      // categories.value = ["全部", ...university.value.majorInfo];
      // console.log(categories + " " + university.value.majorInfo);
    } else {
      uni.showToast({
        title: "获取详情失败，请检查网络",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

const getMajor = async () => {
  try {
    const res = await majorApi.condQuery({
      univName: university.value.name,
      type: currentCategory.value === 0 ? "" : currentCategory.value,
      years: selectedYear.value,
      page:1,
      size:200,
    });
    if (res.data.total !== null) {
      scores.value = res.data.list.map((item: any) => ({
        years: item.years,
        majorName: item.majorName,
        score: item.score,
        countryScore: item.countryScore,
      }));
    } else {
      uni.showToast({
        title: "未查询到数据",
        icon: "none",
      })
    }
  }catch (e) {
    console.error("获取数据失败:", e);
  }
}

const splitStr = (str: string): string[] => {
  if (!str) return [];
  let result = [];
  if (str.includes(",")) {
    result = str.split(",");
  } else if (str.includes("、")) {
    result = str.split("、");
  } else {
    // 如果字符串不包含逗号或顿号，但又不为空，则将其视为单个元素的数组
    result = [str];
  }
  // 过滤掉可能存在的空字符串元素
  return result.filter((item) => item.trim() !== "");
};

onLoad(async (options) => {
  if (options && options.id) {
    await getDetail(options.id as string);
    await getMajor();
  }
});
</script>

<style lang="scss">
.container {
  padding: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header-section {
  background: linear-gradient(180deg, #87ceeb, #eef1f5);
  padding: 16rpx 20rpx 0;
  margin-bottom: 10rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  border-radius: 20rpx;
}

.university-card {
  background: linear-gradient(135deg, #f8f9ff 0%, #e6f0ff 100%);
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1);
  border: 1rpx solid rgba(0, 122, 255, 0.1);
  position: relative;
  overflow: hidden;

  .university-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    position: relative;
    padding-bottom: 20rpx;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(0, 122, 255, 0.2),
        transparent
      );
    }

    .university-logo {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .university-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .university-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .university-tag {
          font-size: 24rpx;
          color: #fff;
          background-color: #007aff;
          border-radius: 8rpx;
          padding: 4rpx 12rpx;
          margin-left: 180rpx;
        }
      }

      .university-motto {
        font-size: 24rpx;
        color: #666;
        display: block;
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

  .university-details {
    display: flex;
    flex-wrap: nowrap;
    gap: 0;
    justify-content: space-between;
    padding: 20rpx 0 0;
    margin-top: 20rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23007aff' fill-opacity='0.05'%3E%3Ccircle cx='4' cy='4' r='1'/%3E%3C/g%3E%3C/svg%3E");

    .detail-item {
      display: flex;
      align-items: center;
      font-size: 22rpx;
      color: #333;
      min-width: 0;
      white-space: nowrap;
      margin-right: 30rpx;

      text {
        margin-left: 6rpx;
      }
    }
  }
}

.category-bar {
  white-space: nowrap;
  padding: 0rpx 0 20rpx;
  background-color: transparent;
  position: relative;
  display: flex;
  justify-content: space-between;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 5rpx;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 122, 255, 2),
      transparent
    );
  }

  .category-item {
    display: inline-block;
    padding: 12rpx 24rpx;
    margin-right: 25rpx;
    font-size: 24rpx;
    color: #666;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(240, 248, 255, 0.9) 100%
    );
    border-radius: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &.active {
      color: #007aff;
      font-weight: bold;
      background: linear-gradient(
        135deg,
        rgba(0, 122, 255, 0.1) 0%,
        rgba(0, 122, 255, 0.2) 100%
      );
      box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.15);
    }

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      transform: translateY(-2rpx);
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    }
  }
}

.year-filter {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 16rpx;
  margin: 10rpx 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1);
  /* overflow: hidden; */
}

.year-select {
  font-size: 22rpx;
  color: #666;
}

.score-table {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1);
  overflow: hidden;

  .table-header,
  .table-row {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #eee;

    text {
      flex: 1;
      text-align: center;
      font-size: 22rpx;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 8rpx;
    }

    text:nth-child(2) {
      flex: 2;
      text-align: left;
      padding-left: 16rpx;
    }
  }

  .table-header {
    font-weight: bold;
    color: #333;
    background-color: #f8f9fa;
  }

  .table-row {
    color: #666;
    transition: background-color 0.2s;

    &:nth-child(even) {
      background-color: #f8f9fa;
    }

    &:hover {
      background-color: #e9ecef;
    }
  }
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 8rpx;
  padding: 0 0 16rpx;
  width: 100%;

  > view:first-child {
    flex-grow: 1;
  }
}

.university-description {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(240, 248, 255, 0.9) 100%
  );
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(31, 45, 61, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 80rpx;
    height: 80rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23007aff' fill-opacity='0.05' d='M50 0c27.6 0 50 22.4 50 50s-22.4 50-50 50S0 77.6 0 50 22.4 0 50 0zm0 20c-16.6 0-30 13.4-30 30s13.4 30 30 30 30-13.4 30-30-13.4-30-30-30z'/%3E%3C/svg%3E")
      no-repeat;
    background-size: contain;
    opacity: 0.5;
  }

  .description-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
  }

  .description-content {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
    display: block;
  }
}
</style>
