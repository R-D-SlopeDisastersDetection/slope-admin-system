<template>
  <div v-show="showModal">
    <transition name="pop" appear>
      <div class="modal" role="modal" :style="{ width: `${width}px` }">
        <div class="model-title">
          <div class="title-text">
            <span>{{ title }}</span>
            <div class="icon-close" v-if="showClose">
              <el-icon @click="close">
                <Close />
              </el-icon>
            </div>
          </div>
          <div class="semiel-lipse"></div>
        </div>
        <div class="model-body">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'Modal',
  components: {},
  model: {
    prop: 'showModal',
    event: 'change'
  },
  props: {
    // 弹框的显示隐藏
    showModal: {
      type: Boolean,
      default: false
    },
    // 底部按钮大小
    size: {
      type: String,
      default: 'medium'
    },
    // 宽度设置
    width: {
      type: [String, Number],
      default: '600'
    },
    // 是否显示右上角的关闭按钮
    showClose: {
      type: Boolean,
      default: true
    },
    // 弹框标题
    title: {
      type: String,
      default: '标题'
    },
    // 关闭按钮前的事件处理
    beforeClose: {
      type: Function,
      default: () => {
        return true;
      }
    }
  },
  methods: {
    close() {
      const data = this.beforeClose();
      if (!data) return;
      this.$emit('close', false);
    }
  }
};
</script>
<style scoped>
.modal {
  margin: auto;
  height: fit-content;
  box-shadow: 0px 5px 15px 0px rgba(255, 102, 0, 0.3);
  min-width: 400px;
  border-radius: 1rem;
  overflow: hidden;
  background: #fff;
  z-index: 999;
  border-radius: 4px;
  transform: none;
}

.model-body {
  padding: 5px;
  overflow-y: auto;
}

.model-title {
  position: relative;
  height: 32px;
  text-align: center;
  overflow: hidden;
  line-height: 32px;
  width: 100%;
  color: #fff;
  font-size: 18px;
}

.semiel-lipse {
  position: absolute;
  width: 110%;
  left: -5%;
  height: 150%;
  top: -50%;
  background: rgba(255, 102, 0, 0.8);
  border-radius: 0% 0% 50% 50%;
}

.title-text {
  position: relative;
  z-index: 1000;
}

.icon-close {
  position: absolute;
  right: 12px;
  top: 0;
}

.icon-close i {
  cursor: pointer;
}

.dis_in_center {
  display: inline-block;
  vertical-align: middle;
}

.right-btn {
  margin-left: 20px;
}

/* ---------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>