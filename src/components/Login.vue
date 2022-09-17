<template>
  <div class="select-username">
    <form v-on:submit.prevent="onSubmit">
      <input v-model="username" type="text" placeholder="Enter your name" />
      <button :disabled="!isValid">Enter chat</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  emits: ['login'],
  data() {
    return {
      username: '',
    }
  },
  computed: {
    isValid() {
      return this.username.length > 2
    },
  },
  methods: {
    onSubmit() {
      this.$emit('login', this.username)
    },
  },
}
</script>

<style scoped>
.select-username {
  width: 300px;
  margin: 200px auto 0;
}
</style>
