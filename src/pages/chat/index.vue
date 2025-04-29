<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <text class="group-name">一起备考</text>
    </view>

    <!-- 聊天记录列表 -->
    <scroll-view
      class="chat-list"
      scroll-y
      ref="chatListRef"
      :scroll-into-view="lastMessageId"
    >
      <view
        v-for="(message, index) in messages"
        :key="index"
        class="message-item"
        :class="message.isSelf ? 'self' : 'other'"
        :id="'msg-' + index"
      >
        <image class="avatar" :src="message.avatar" />
        <view class="message-content">
          <text class="name" v-if="!message.isSelf">{{ message.name }}</text>
          <view class="bubble">
            <text>{{ message.content }}</text>
          </view>
          <text class="time">{{ message.time }}</text>
        </view>
      </view>
      <view id="msg-bottom"></view>
    </scroll-view>

    <!-- 底部输入框 -->
    <view class="input-area">
      <input type="text" v-model="inputMessage" placeholder="输入消息..." />
      <button class="send-btn" @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";

interface ChatMessage {
  avatar: string;
  name: string;
  content: string;
  time: string;
  isSelf: boolean;
}

const messages = ref<ChatMessage[]>([
  {
    avatar: "/static/ulogo/THU.svg",
    name: "考研学长",
    content: "大家好，我是去年考上清华的学长，欢迎大家交流考研经验！",
    time: "10:00",
    isSelf: false,
  },
  {
    avatar: "/static/ulogo/PKU.svg",
    name: "考研小白",
    content: "学长好！想请教一下数学复习有什么好的方法吗？",
    time: "10:01",
    isSelf: false,
  },
  {
    avatar: "/static/ulogo/THU.svg",
    name: "考研学长",
    content:
      "数学复习建议：1. 先把基础知识打牢，认真过一遍课本 2. 多做题，特别是历年真题 3. 总结错题，建立知识体系",
    time: "10:05",
    isSelf: false,
  },
  {
    avatar: "/static/ulogo/FDU.svg",
    name: "资料分享者",
    content:
      "我整理了一份考研资料合集，包括各科复习重点、真题解析等，需要的可以私信我",
    time: "10:10",
    isSelf: false,
  },
  {
    avatar: "/static/myav.svg",
    name: "考研人",
    content: "最近在准备英语，大家有什么推荐的背单词APP吗？",
    time: "10:15",
    isSelf: false,
  },
  {
    avatar: "/static/ulogo/USTC.svg",
    name: "考研答疑",
    content: "政治复习建议：1. 先过一遍大纲解析 2. 做1000题 3. 最后背肖四肖八",
    time: "10:20",
    isSelf: false,
  },
  {
    avatar: "/static/myav.svg",
    name: "考研人",
    content: "请问计算机专业，北航和北邮哪个更好考一些？",
    time: "10:25",
    isSelf: false,
  },
  {
    avatar: "/static/ulogo/NJU.svg",
    name: "考研学姐",
    content: "北邮计算机竞争更激烈但就业好，北航相对容易些但复试要求高",
    time: "10:30",
    isSelf: false,
  },
  {
    avatar: "/static/gcard.svg",
    name: "考研打卡",
    content: "今天完成了数学3小时，英语2小时，政治1小时，专业课2小时",
    time: "10:35",
    isSelf: false,
  },
]);

const inputMessage = ref("");
const chatListRef = ref<any>(null);
const lastMessageId = ref("msg-bottom");

const scrollToBottom = () => {
  nextTick(() => {
    if (!chatListRef.value) return;

    // 设置要滚动到的消息ID
    lastMessageId.value =
      messages.value.length > 0
        ? `msg-${messages.value.length - 1}`
        : "msg-bottom";

    // 兼容微信小程序平台的滚动实现
    chatListRef.value.scrollTo({
      top: chatListRef.value.scrollHeight,
      duration: 300,
      success: () => {
        console.log("滚动到底部成功");
      },
      fail: (err) => {
        console.error("滚动失败:", err);
        // 备用滚动方案
        setTimeout(() => {
          chatListRef.value?.scrollTo({
            top: chatListRef.value.scrollHeight,
            duration: 300,
          });
        }, 100);
      },
    });
  });
};

onMounted(() => {
  scrollToBottom();
});

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    const content = inputMessage.value.slice(0, 100); // 限制消息长度为100
    messages.value.push({
      avatar: "/static/ulogo/ECJTU.svg",
      name: "我",
      content: content,
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSelf: true,
    });
    inputMessage.value = "";
    scrollToBottom();
  }
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9fbfd;
  box-sizing: border-box;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  text-align: center;
  z-index: 100;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

  .group-name {
    color: #999;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.chat-list {
  flex: 1;
  padding: 20rpx;
  padding-top: 100rpx;
  padding-bottom: 180rpx;
  background-color: #f9fbfd;
}

.message-item {
  display: flex;
  margin-bottom: 30rpx;

  &.self {
    flex-direction: row-reverse;
    margin-right: 30rpx;

    .message-content {
      align-items: flex-end;
      margin-right: 10rpx;
      margin-left: 100rpx;
    }

    .bubble {
      background-color: #7cc2f1;

      &::before {
        right: -10rpx;
        border-left-color: #7cc2f1;
      }
    }
  }

  &.other .message-content {
    margin-left: 20rpx;
    margin-right: 100rpx;
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  object-fit: cover;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.bubble {
  position: relative;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
  max-width: 500rpx;
  word-break: break-word;
  white-space: pre-wrap;

  &::before {
    content: "";
    position: absolute;
    top: 20rpx;
    border: 10rpx solid transparent;
  }
}

.other .bubble {
  background-color: #fff;

  &::before {
    left: -10rpx;
    border-right-color: #fff;
  }
}

.time {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20rpx;
  background-color: #f7f7f7;
  border-top: 1rpx solid #e5e5e5;
  box-sizing: border-box;
  z-index: 100;

  input {
    flex: 1;
    height: 72rpx;
    padding: 0 24rpx;
    background-color: #fff;
    border-radius: 36rpx;
    margin-right: 20rpx;
    font-size: 28rpx;
  }

  .send-btn {
    width: 120rpx;
    height: 72rpx;
    line-height: 72rpx;
    text-align: center;
    background-color: #007aff;
    color: #fff;
    border-radius: 36rpx;
    font-size: 28rpx;
  }
}
</style>
