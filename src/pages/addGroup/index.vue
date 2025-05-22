<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="iconfont icon-search"></text>
        <input
          placeholder="搜索群聊"
          v-model="searchQuery"
          @confirm="performSearch"
        />
      </view>
      <view class="search-btn" @click="performSearch">
        <text>搜索</text>
      </view>
    </view>

    <scroll-view v-if="searchResults.length > 0" class="message-list" scroll-y>
      <view
        v-for="(item, index) in searchResults"
        :key="index"
        class="message-item"
      >
        <image class="avatar" :src="item.avatar" />
        <view class="content">
          <view class="top">
            <text class="name">{{ item.name }}</text>
          </view>
          <text class="preview">{{ item.description }}</text>
        </view>
        <view class="join-btn" @click.stop="() => joinGroup(item.id)">
          <text>加入</text>
        </view>
      </view>
    </scroll-view>
    <view
      v-else-if="searched && searchResults.length === 0"
      class="empty-results"
    >
      <text>未找到相关群聊</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { chatApi } from "@/api";
import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();
const userInfo = userStore.getUserInfo;

interface GroupItem {
  id: string;
  ownerId: number;
  avatar: string;
  name: string;
  tags: string;
}

const searchQuery = ref("");
const searchResults = ref<GroupItem[]>([]);
const searched = ref(false); // 标记是否执行过搜索

const performSearch = () => {
  searched.value = true;
  searchResults.value = [];
  try {
    chatApi
      .queryGroup({
        name: searchQuery.value,
      })
      .then((res) => {
        res.data.forEach((item) => {
          searchResults.value.push({
            id: item.id,
            ownerId: item.ownerId,
            avatar: "/static/lls.svg",
            name: item.name,
            tags: item.tags,
          });
        });
      });
  } catch (e) {
    // mock数据
    searchResults.value = [
      {
        id: "1",
        ownerId: 27,
        avatar:
          "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/ECJTU.svg",
        name: "华东交通大学备考群",
        tags: "一起备战华东交大！",
      },
      {
        id: "2",
        ownerId: 27,
        avatar: "/static/logo.png",
        name: "计算机考研交流",
        tags: "408学习小组",
      },
    ].filter((group) => group.name.includes(searchQuery.value));
  }
};

const joinGroup = (groupId: string) => {
  const res = chatApi.joinGroup({
    gid: groupId,
    uid: userInfo.uid,
  });
  uni.showToast({
    title: `已申请加入群聊`,
    icon: "none",
  });
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(to bottom, #e6f2ff, #f5f5f5 1000rpx);
}

.search-bar {
  display: flex;
  padding: 20rpx;
  align-items: center;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: white;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.search-input input {
  flex: 1;
  margin-left: 10rpx;
}

.search-btn {
  padding: 7rpx 15rpx;
  background-color: #007aff;
  color: white;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx; // 与输入框高度匹配
}

.message-list {
  flex: 1;
  overflow: hidden;
}

.message-item {
  position: relative;
  display: flex;
  padding: 20rpx;
  background-color: white;
  border-bottom: 1rpx solid #eee;
  transition: transform 0.3s;
  border-radius: 10rpx;
  margin: 10rpx 20rpx;
  align-items: center; // 确保内容和按钮垂直居中
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.content {
  flex: 1;
  margin-right: 20rpx; // 为加入按钮留出空间
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.name {
  font-size: 32rpx;
  color: #333;
}

.preview {
  font-size: 28rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-results {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 28rpx;
  padding-top: 100rpx;
}

.iconfont.icon-search {
  font-size: 32rpx; // 确保图标可见
  color: #999;
}

.join-btn {
  padding: 10rpx 20rpx;
  background-color: #007aff;
  color: white;
  border-radius: 10rpx;
  font-size: 28rpx;
  white-space: nowrap; // 防止文字换行
}
</style>
