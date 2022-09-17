<template>
  <div>
    <div class="header">
      <StatusIcon :connected="user.connected" /> {{ user.username }}
    </div>

    <ul class="messages">
      <li class="message" v-for="(message, i) in user.messages" :key="i">
        <div class="sender">
          {{ message.fromSelf ? '(yourself)' : user.username }}
        </div>
        {{ message.content }}
      </li>
    </ul>

    <form class="form" v-on:submit.prevent="onSubmit">
      <textarea
        v-model="input"
        class="input"
        placeholder="Your message..."
      ></textarea>
      <button :disabled="!isValid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
import StatusIcon from './StatusIcon.vue'

export default {
  name: 'MessagePanel',
  emits: ['input'],
  components: {
    StatusIcon,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      input: '',
    }
  },
  computed: {
    isValid() {
      return this.input != ''
    },
  },
  methods: {
    onSubmit() {
      this.$emit('input', this.input)
      this.input = ''
    },
  },
}
</script>

<style scoped>
.header {
  line-height: 40px;
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
}

.messages {
  margin: 0;
  padding: 20px;
}

.message {
  list-style: none;
}

.sender {
  font-weight: bold;
  margin-top: 5px;
}

.form {
  padding: 10px;
}

.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}

.send-button {
  vertical-align: top;
}
</style>
