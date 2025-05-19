<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar" @click="handleMenuClick()">
      <view class="search-input">
        <text class="iconfont icon-search"></text>
        <input placeholder="搜索" />
      </view>
      <view class="add-btn">
        <uni-icons type="plus" size="24" color="#333" />
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y>
      <view
        v-for="(item, index) in messages"
        :key="index"
        class="message-item"
        @click="navigateToChat"
        @longpress="() => showActionPopup(index)"
      >
        <image class="avatar" :src="item.avatar" />
        <view class="content">
          <view class="top">
            <text class="name">{{ item.name }}</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <text class="preview">{{ item.preview }}</text>
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
import { useRouter } from "vue-router";

const router = useRouter();

interface MessageItem {
  avatar: string;
  name: string;
  time: string;
  preview: string;
}

const messages = ref<MessageItem[]>([
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/ECJTU.svg",
    name: "华东交通大学备考群",
    time: "12:30",
    preview: "wenbo : 同学们加油!",
  },
  {
    avatar: "/static/logo.png",
    name: "413复习打卡小组",
    time: "昨天",
    preview: "lihan : 今天打卡了吗?",
  },
  {
    avatar: "/static/lls.svg",
    name: "考研数一答疑群",
    time: "星期一",
    preview: "廖老师 : 明天晚上讲模拟卷",
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
    messages.value.splice(selectedIndex.value, 1);
    selectedIndex.value = -1;
  }
  closePopup();
};

const closePopup = () => {
  popup.value.close();
};

const navigateToChat = () => {
  uni.navigateTo({ url: "/pages/chat/index" });
};

const handleMenuClick = () => {
  uni.navigateTo({ url: "/pages/addGroup/index" });
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
