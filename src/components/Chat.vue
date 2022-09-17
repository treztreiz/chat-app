<template>
  <div>
    <div class="left-panel">
      <User
        v-for="user in users"
        v-bind:key="user.id"
        :user="user"
        :selected="currentUser === user"
        v-on:select="selectUser(user)"
      />
    </div>
    <MessagePanel
      v-if="currentUser"
      :user="currentUser"
      class="right-panel"
      v-on:input="onMessage"
    />
  </div>
</template>

<script>
import socket from '../socket'
import User from './User.vue'
import MessagePanel from './MessagePanel.vue'

export default {
  name: 'Chat',
  components: {
    User,
    MessagePanel,
  },
  data() {
    return {
      users: [],
      currentUser: null,
    }
  },
  methods: {
    selectUser(user) {
      this.currentUser = user
      this.currentUser.hasNewMessages = false
    },
    onMessage(content) {
      if (!this.currentUser) return
      socket.emit('private message', {
        content,
        to: this.currentUser.id,
      })
      this.currentUser.messages.push({
        content,
        fromSelf: true,
      })
    },
  },
  mounted() {
    const initReactiveProperties = (user) => {
      user.connected = true
      user.messages = []
      user.hasNewMessages = false
    }

    const getUserFromId = (id) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i]
        if (user.id === id) return user
      }
      return null
    }

    // Built-in event
    socket.on('connect', () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = true
        }
      })
    })

    // Built-in event
    socket.on('disconnect', () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = false
        }
      })
    })

    socket.on('users', (users) => {
      // init reactive properties of each users
      users.forEach((user) => {
        user.self = user.id === socket.id
        initReactiveProperties(user)
      })

      // put the current user first, and sort by username
      this.users = users.sort((a, b) => {
        if (a.self) return -1
        if (b.self) return 1
        if (a.username < b.username) return -1
        return a.username > b.username ? 1 : 0
      })
    })

    socket.on('user connected', (user) => {
      initReactiveProperties(user)
      this.users.push(user)
    })

    socket.on('user disconnected', (id) => {
      const user = getUserFromId(id)
      if (user) user.connected = false
    })

    socket.on('private message', ({ content, from }) => {
      const user = getUserFromId(from)
      if (user) {
        user.messages.push({
          content,
          fromSelf: false,
        })
        if (user !== this.currentUser) {
          user.hasNewMessages = true
        }
      }
    })
  },
  unmounted() {
    socket.off('connect')
    socket.off('disconnect')
    socket.off('users')
    socket.off('user connected')
    socket.off('user disconnected')
    socket.off('private message')
  },
}
</script>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
