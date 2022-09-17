<template>
  <Login v-if="!isConnected" v-on:login="login" />
  <Chat v-else />
</template>

<script>
import Login from './components/Login.vue'
import Chat from './components/Chat.vue'
import socket from './socket'

export default {
  name: 'App',
  components: {
    Login,
    Chat,
  },
  data() {
    return {
      isConnected: false,
    }
  },
  methods: {
    login(username) {
      this.isConnected = true
      socket.auth = { username }
      socket.connect()
    },
  },
  mounted() {
    // Connect error is reserved and sent by the middleware if next(error)
    socket.on('connect_error', (err) => {
      if (err.message == 'invalid username') {
        this.isConnected = false
      }
    })
  },
  unmounted() {
    socket.off('connect_error')
  },
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 14px;
}
</style>
