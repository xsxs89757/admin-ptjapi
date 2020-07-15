import io from 'socket.io-client'
import Echo from 'laravel-echo'
import { getToken } from '@/utils/auth'

// 监听所有广播

export default function() {
  window.io = io
  const socket = new Echo({
    broadcaster: 'socket.io',
    host: process.env.VUE_APP_BASE_API + ':6001',
    auth:
    {
      headers:
        {
          'Authorization': getToken()
        }
    }
  })
  return socket
}

