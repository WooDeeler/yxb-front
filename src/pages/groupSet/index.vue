<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar-title">
      <text class="title-text">群成员管理</text>
    </view>

    <!-- 群聊信息 -->
    <view class="group-info-card">
      <image class="group-avatar" :src="groupInfo.avatar" />
      <view class="group-details">
        <text class="group-name">{{ groupInfo.name }}</text>
        <text class="group-announcement">{{ groupInfo.announcement }}</text>
      </view>
      <button class="edit-btn" @click="editGroupInfo">编辑</button>
    </view>

    <!-- 成员列表 -->
    <scroll-view class="member-list" scroll-y>
      <view v-for="(member, index) in members" :key="index" class="member-item">
        <image class="avatar" :src="member.avatar" />
        <view class="content">
          <text class="name">{{ member.name }}</text>
          <text class="role">{{ member.role }}</text>
        </view>
        <view class="actions">
          <!-- Actions for non-owners -->
          <template v-if="!member.isOwner">
            <button class="action-btn remove-btn" @click="removeMember(index)">
              移除
            </button>
            <button
              v-if="!member.isAdmin"
              class="action-btn set-admin-btn"
              @click="setAdmin(index)"
            >
              设为管理员
            </button>
          </template>
          <!-- Tag for owners -->
          <text v-else class="owner-tag">群主</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface GroupInfo {
  avatar: string;
  name: string;
  announcement: string;
}

interface GroupMember {
  avatar: string;
  name: string;
  role: string;
  isOwner?: boolean;
  isAdmin?: boolean;
}

const members = ref<GroupMember[]>([
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/THU.svg",
    name: "考研学长",
    role: "管理员",
    isOwner: true,
  },
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/PKU.svg",
    name: "考研小白",
    role: "成员",
  },
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/FDU.svg",
    name: "资料分享者",
    role: "成员",
  },
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/myav.svg",
    name: "考研人",
    role: "成员",
  },
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/USTC.svg",
    name: "考研答疑",
    role: "成员",
  },
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/NJU.svg",
    name: "考研学姐",
    role: "成员",
  },
  {
    avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/ECJTU.svg",
    name: "我",
    role: "管理员",
    isAdmin: true,
  },
]);

const groupInfo = ref<GroupInfo>({
  avatar: "https://pic-buc.oss-cn-hangzhou.aliyuncs.com/yxb/ulogo/ECJTU.svg", // 示例群头像
  name: "华东交通大学备考群",
  announcement: "欢迎加入考研交流群！请大家积极分享学习资料和经验，共同进步！",
});

const editGroupInfo = () => {
  uni.showToast({
    title: "编辑群聊信息功能待实现",
    icon: "none",
  });
  // 在这里可以添加跳转到编辑页面的逻辑或弹出编辑模态框
};

const removeMember = (index: number) => {
  if (members.value[index].isOwner) {
    uni.showToast({
      title: "不能移除群主",
      icon: "none",
    });
    return;
  }
  members.value.splice(index, 1);
  uni.showToast({
    title: "移除成功",
    icon: "success",
  });
};

const setAdmin = (index: number) => {
  if (members.value[index].isAdmin) {
    uni.showToast({
      title: "该成员已经是管理员",
      icon: "none",
    });
    return;
  }
  members.value[index].isAdmin = true;
  members.value[index].role = "管理员";
  uni.showToast({
    title: "设置成功",
    icon: "success",
  });
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5; // 参考 message/index.vue 的背景色
}

.nav-bar-title {
  padding: 30rpx 20rpx 20rpx; // 增加上下padding
  background-color: #fff; // 导航栏背景色
  text-align: center;
  border-bottom: 1rpx solid #eee;
  .title-text {
    font-size: 36rpx; // 标题字号
    font-weight: bold;
    color: #333;
  }
}

.member-list {
  flex: 1;
  overflow-y: auto; // 确保可以滚动
}

.member-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: white;
  border-bottom: 1rpx solid #eee;
  margin: 10rpx 20rpx;
  border-radius: 10rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 30rpx; // 稍作调整
  color: #333;
  margin-bottom: 5rpx;
}

.role {
  font-size: 24rpx;
  color: #999;
}

.actions {
  margin-left: auto;
  display: flex; // 新增：使按钮水平排列
  align-items: center; // 新增：垂直居中对齐按钮
}

.action-btn {
  padding: 8rpx 18rpx; // 调整内边距以适应新的布局
  font-size: 22rpx; // 略微调整字体大小
  border-radius: 8rpx;
  margin-left: 10rpx; // 为按钮之间添加间距

  // 移除按钮和设为管理员按钮之间的间距由 margin-left 控制
  // 如果只有一个按钮，则不需要额外的 margin 调整
  &:first-child:not(:last-child) {
    // 当存在多个按钮时，第一个按钮右侧需要间距
    // 如果需要特别调整第一个按钮的右边距，可以在这里添加
  }

  // 确保按钮之间有间距，但最后一个按钮不需要右边距
  &:not(:last-child) {
    margin-right: 10rpx; // 为非最后一个按钮添加右边距
  }
  // 由于flex布局，第一个按钮的 margin-left: 0; 不再是必须的，
  // 但为了保持特定场景下的样式，可以保留或根据需要调整
  &:first-child {
    margin-left: 0; // 确保第一个按钮没有左边距
  }

  &.remove-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
  }
  &.set-admin-btn {
    background-color: #1890ff; // 设置管理员按钮的颜色
    color: white;
    border: none;
  }
}

.owner-tag {
  font-size: 24rpx;
  color: #faad14; // 群主标签颜色
  padding: 5rpx 10rpx;
  background-color: #fffbe6;
  border: 1rpx solid #ffe58f;
  border-radius: 4rpx;
}

// 群聊信息卡片样式
.group-info-card {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 30rpx 20rpx;
  margin: 20rpx 20rpx 10rpx; // 上边距调整，与其他卡片一致
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05); // 添加轻微阴影
}

.group-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.group-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.group-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.group-announcement {
  font-size: 26rpx;
  color: #666;
  // 限制公告显示行数，超出部分显示省略号
  display: -webkit-box;
  -webkit-line-clamp: 2; // 最多显示2行
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4; // 调整行高，确保文本清晰
}

.edit-btn {
  padding: 10rpx 25rpx;
  font-size: 26rpx;
  color: #fff;
  background-color: #1890ff; // 与设为管理员按钮颜色一致
  border: none;
  border-radius: 8rpx;
  margin-left: 20rpx; // 与群组详情保持一定间距
  white-space: nowrap; // 防止按钮文字换行
}
</style>
