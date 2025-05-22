<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @click="handleInputClick()">
        <text class="iconfont icon-search"></text>
        <input placeholder="搜索" />
      </view>
      <view class="add-btn" @click="handleAddClick()">
        <uni-icons type="plus" size="24" color="#333" />
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y>
      <view
        v-for="(item, index) in messages"
        :key="index"
        class="message-item"
        @click="navigateToChat(item)"
        @longpress="() => showActionPopup(index)"
      >
        <image class="avatar" :src="item.avatar" />
        <view class="content">
          <view class="top">
            <text class="name">{{ item.groupName }}</text>
            <text class="time">{{ item.latestTime }}</text>
          </view>
          <text class="preview">{{ item.latestMessage }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 操作弹窗 -->
    <uni-popup ref="popup" type="bottom">
      <view class="popup-content">
        <view class="popup-item delete" @click="handleDelete">
          <text class="iconfont icon-delete"></text>
          <text>删除</text>
        </view>
        <view class="popup-item cancel" @click="closePopup">
          <text>取消</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { chatApi } from "@/api";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";

import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();
const userInfo = userStore.getUserInfo;

interface MessageItem {
  groupId: number;
  avatar: string;
  groupName: string;
  latestMessage: string;
  latestTime: string;
}

const messages = ref<MessageItem[]>([
  {
    groupId: 1,
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/ECJTU.svg",
    groupName: "华东交通大学备考群",
    latestTime: "12:30",
    latestMessage: "wenbo : 同学们加油!",
  },
  {
    groupId: 2,
    avatar: "/static/logo.png",
    groupName: "413复习打卡小组",
    latestTime: "昨天",
    latestMessage: "lihan : 今天打卡了吗?",
  },
  {
    groupId: 3,
    avatar: "/static/lls.svg",
    groupName: "考研数一答疑群",
    latestTime: "星期一",
    latestMessage: "廖老师 : 明天晚上讲模拟卷",
  },
]);

const popup = ref();
const selectedIndex = ref<number>(-1);

const showActionPopup = (index: number) => {
  selectedIndex.value = index;
  popup.value.open();
};

const handleDelete = () => {
  if (selectedIndex.value !== -1) {
    var gid = messages.value[selectedIndex.value].groupId;
    messages.value.splice(selectedIndex.value, 1);
    selectedIndex.value = -1;
    delGroup(gid);
  }
  closePopup();
};

const closePopup = () => {
  popup.value.close();
};

const navigateToChat = (group: MessageItem) => {
  uni.navigateTo({ url: `/pages/chat/index?id=${group.groupId}&name=${group.groupName}`});
};

const handleInputClick = () => {
  uni.navigateTo({ url: "/pages/addGroup/index" });
};

const handleAddClick = () => {
  uni.navigateTo({ url: "/pages/createGroup/index" });
};

const delGroup = async (id: number) => {
  try {
    const res = await chatApi.leaveGroup({
      uid: userInfo.uid,
      gid: id,
    });
    uni.showToast({
      title: "删除成功",
      icon: "success",
    });
  } catch (e) {
    uni.showToast({
      title: "网络异常！删除失败",
      icon: "none",
    });
  }
}

const getGroupList = async () => {
  try {
    const res = await chatApi.getUserGroupList(userInfo.uid);
    if (res.data.length > 0) {
      messages.value = res.data.map((item) => ({
        ...item,
        latestTime: new Date(item.latestTime).toISOString().split("T")[0],
        avatar: "/static/lls.svg",
      }));
    }
  } catch (e) {
    uni.showToast({
      title: "网络异常！加载失败",
      icon: "none",
    });
  }
};

// 下拉刷新
onPullDownRefresh(() => {
  getGroupList();
  uni.stopPullDownRefresh();
});

// 页面加载时获取数据
onLoad(() => {
  getGroupList();
});
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
  // background-color: #f5f5f5;
  align-items: center;
}

.search-input {
  flex: 1;
  margin-right: 20rpx;
}

.add-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.menu-container {
  position: absolute;
  right: 0;
  top: 80rpx;
  width: 240rpx;
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.menu-item {
  padding: 20rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid #f5f5f5;

  uni-icons {
    margin-right: 20rpx;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-input {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: white;
  border-radius: 10rpx;
}

.search-input input {
  flex: 1;
  margin-left: 10rpx;
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
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.content {
  flex: 1;
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

.time {
  font-size: 24rpx;
  color: #999;
}

.preview {
  font-size: 28rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popup-content {
  background-color: white;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
}

.popup-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  font-size: 32rpx;
  border-bottom: 1rpx solid #eee;

  &.delete {
    color: #ff0000;
  }

  &.cancel {
    color: #333;
  }

  .iconfont {
    margin-right: 10rpx;
    font-size: 36rpx;
  }
}
</style>
