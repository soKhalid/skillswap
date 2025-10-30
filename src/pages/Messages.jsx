import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, off, set } from 'firebase/database';
import { collection, getDocs } from 'firebase/firestore';
import { rtdb, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { FiSend, FiSearch } from 'react-icons/fi';
import { generateChatId } from '../utils/helpers';

const Messages = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId && users.length > 0) {
      const user = users.find(u => u.uid === userId);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [searchParams, users]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      const chatId = generateChatId(currentUser.uid, selectedUser.uid);
      const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

      const handleMessages = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messagesList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
          }));
          messagesList.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(messagesList);
        } else {
          setMessages([]);
        }
      };

      onValue(messagesRef, handleMessages);

      return () => {
        off(messagesRef, 'value', handleMessages);
      };
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.uid !== currentUser?.uid);

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const chatId = generateChatId(currentUser.uid, selectedUser.uid);
    const messagesRef = ref(rtdb, `chats/${chatId}/messages`);

    try {
      await push(messagesRef, {
        senderId: currentUser.uid,
        text: newMessage,
        timestamp: Date.now()
      });

      // Update chat metadata
      const chatMetaRef = ref(rtdb, `chats/${chatId}/metadata`);
      await set(chatMetaRef, {
        participants: [currentUser.uid, selectedUser.uid],
        lastMessage: newMessage,
        lastMessageTime: Date.now()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="card p-0 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="grid md:grid-cols-3 h-full">
          {/* Users List */}
          <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-3">Messages</h2>
              <div className="relative">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user.uid}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                      selectedUser?.uid === user.uid ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{user.displayName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.university || 'SkillSwap Member'}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  {selectedUser.photoURL ? (
                    <img
                      src={selectedUser.photoURL}
                      alt={selectedUser.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                      {selectedUser.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{selectedUser.displayName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUser.university || 'SkillSwap Member'}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isOwn = message.senderId === currentUser.uid;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-500 dark:text-gray-400'}`}>
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary flex items-center gap-2">
                      <FiSend size={18} />
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <p className="text-xl mb-2">Select a user to start chatting</p>
                  <p className="text-sm">Choose someone from the list on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
