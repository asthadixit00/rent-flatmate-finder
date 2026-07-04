import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const socket = io('http://localhost:5000')

export default function Chat() {
  const { user } = useAuth()
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef()

  useEffect(() => {
    api.get('/chat/rooms').then(({ data }) => setRooms(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedRoom) return
    socket.emit('join_room', selectedRoom._id)
    api.get(`/chat/rooms/${selectedRoom._id}/messages`)
      .then(({ data }) => setMessages(data))
      .catch(() => {})
  }, [selectedRoom])

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })
    return () => socket.off('receive_message')
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !selectedRoom) return
    socket.emit('send_message', {
      roomId: selectedRoom._id,
      senderId: user._id,
      content: input.trim()
    })
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="container">
      <h1>Chat</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ width: 250 }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Conversations</h3>
          {rooms.length === 0 ? <p style={{ fontSize: '0.85rem' }}>No conversations yet.</p> : rooms.map(room => (
            <div key={room._id} className="card"
              style={{ cursor: 'pointer', background: selectedRoom?._id === room._id ? '#ebf5fb' : 'white' }}
              onClick={() => setSelectedRoom(room)}>
              <p style={{ fontWeight: 500 }}>
                {user.role === 'owner' ? room.tenant?.name : room.owner?.name}
              </p>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {selectedRoom ? (
            <>
              <div className="chat-box">
                {messages.map((m, i) => (
                  <div key={i} className={`message ${m.sender?._id === user._id || m.sender === user._id ? 'mine' : 'theirs'}`}>
                    <p style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.2rem' }}>{m.sender?.name}</p>
                    <p>{m.content}</p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input style={{ flex: 1, padding: '0.6rem', borderRadius: 6, border: '1px solid #ddd' }}
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey} />
                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}