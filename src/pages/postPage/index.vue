<template>
  <view class="container">
    <!-- 头部导航 -->
    <view class="nav-bar">
      <text class="iconfont icon-back">&#xe601;</text>
      <text class="page-title">发布帖子</text>
      <button class="submit-btn" :disabled="!postContent" @click="handleSubmit">
        发布
      </button>
    </view>

    <!-- 内容编辑区 -->
    <textarea
      class="content-input"
      placeholder="分享你的想法..."
      v-model="postContent"
      auto-height
      maxlength="500"
    />

    <!-- 图片上传 -->
    <view class="upload-section">
      <button class="upload-button" @click="chooseImage">+ 添加图片</button>
      <scroll-view class="preview-container" scroll-x>
        <view
          v-for="(img, index) in selectedImages"
          :key="index"
          class="preview-item"
        >
          <image :src="img.path" class="preview-image" mode="aspectFill" />
          <text class="iconfont icon-close" @click="handleImageDelete(index)"
            >&#xe602;</text
          >
        </view>
      </scroll-view>
    </view>

    <!-- 功能选项 -->
    <view class="options-section">
      <view class="option-item" @click="toggleVisibility">
        <uni-icons :type="visibilityIcon" size="20" />
        <text>{{ visibilityText }}</text>
      </view>
      <view class="option-item" @click="getLocation">
        <uni-icons type="location" size="20" />
        <text>{{ location || "添加位置" }}</text>
      </view>
    </view>

    <!-- 底部工具栏 -->
    <view class="toolbar">
      <uni-icons type="emoji" size="24" @click="openEmoji" />
      <uni-icons type="at" size="24" @click="mentionUser" />
      <uni-icons type="tag" size="24" @click="addTopic" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref,computed } from "vue";

const postContent = ref("");
const selectedImages = ref<any[]>([]);
const location = ref("");
const visibility = ref("public"); // public/friend/private

const imageStyles = {
  width: 160,
  height: 160,
  border: {
    color: "#eee",
    width: "2rpx",
    style: "solid",
  },
};

const visibilityOptions = {
  public: { icon: "eye", text: "公开" },
  friend: { icon: "person", text: "仅好友" },
  private: { icon: "locked", text: "私密" },
};

const visibilityIcon = computed(() => visibilityOptions[visibility.value].icon);
const visibilityText = computed(() => visibilityOptions[visibility.value].text);

const toggleVisibility = () => {
  const states = Object.keys(visibilityOptions);
  const currentIndex = states.indexOf(visibility.value);
  visibility.value = states[(currentIndex + 1) % states.length];
};

const getLocation = async () => {
  try {
    const res = await uni.chooseLocation();
    location.value = res.address;
  } catch (error) {
    console.error("获取位置失败:", error);
  }
};

const chooseImage = () => {
  uni.chooseImage({
    count: 9,
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      selectedImages.value = [
        ...selectedImages.value,
        ...res.tempFilePaths.map((path) => ({ path })),
      ];
    },
  });
};

const handleImageDelete = (index: number) => {
  selectedImages.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!postContent.value) {
    uni.showToast({ title: "请输入内容", icon: "none" });
    return;
  }

  const formData = {
    content: postContent.value,
    images: selectedImages.value,
    location: location.value,
    visibility: visibility.value,
  };

  // 模拟提交
  uni.showLoading({ title: "发布中..." });
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: "发布成功" });
    uni.navigateBack();
  }, 1500);
};

const navigateBack = () => {
  uni.navigateBack();
};
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;

  .page-title {
    font-size: 32rpx;
    font-weight: bold;
  }

  .submit-btn {
    background-color: #007aff;
    color: #fff;
    padding: 12rpx 32rpx;
    border-radius: 40rpx;
    font-size: 28rpx;

    &[disabled] {
      background-color: #007aff;
      color: #fff;
    }
  }
}

.content-input {
  width: 100%;
  min-height: 300rpx;
  padding: 30rpx;
  font-size: 30rpx;
  line-height: 1.5;
  background-color: #fff;
}

.upload-section {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 20rpx;
}

.preview-container {
  margin-top: 20rpx;
  white-space: nowrap;

  .preview-item {
    position: relative;
    display: inline-block;
    margin-right: 20rpx;
    width: 200rpx;
    height: 200rpx;

    .preview-image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }

    .delete-icon {
      position: absolute;
      right: -10rpx;
      top: -10rpx;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      padding: 4rpx;
      color: white;
    }
  }
}

.options-section {
  margin-top: 20rpx;
  background-color: #fff;
  padding: 20rpx;

  .option-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;

    text {
      margin-left: 16rpx;
      font-size: 28rpx;
      color: #666;
    }
  }
}

.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx;
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #eee;
}
</style>
