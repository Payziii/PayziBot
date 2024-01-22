const { EventEmitter } = require('events');
const WebSocket = require('ws');

class BoticordService extends EventEmitter {
    #ws = undefined
    #pingInterval
  
    constructor(token) {
      super()
      this.token = token
    }
  
    reconnect() {
      if (this.#ws !== undefined) {
        return
      }
  
      this.#ws = new WebSocket('wss://gateway.boticord.top/websocket/')
  
      this.#ws.on('message', content => {
        const json = JSON.parse(content)
  
        if (json.event !== undefined) {
          this.emit(json.event, json.data)
        }
      })
  
      this.#ws.on('close', () => {
        clearInterval(this.#pingInterval)
  
        this.#ws = undefined
        this.#pingInterval = undefined
  
        setTimeout(() => this.reconnect(), 25_000)
      })
  
      this.#pingInterval = setInterval(
        () => this.send('ping', {}), 
        25_000
      )
  
      this.#ws.on('open', () => this.send('auth', { token: this.token }))
    }

    connect() {
        this.reconnect()
    }

    send(event, data) {
      this.#ws?.send(JSON.stringify({ event, data }))
    }
  
  }

  module.exports = BoticordService