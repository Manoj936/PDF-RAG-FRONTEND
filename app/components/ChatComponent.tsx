'use client'

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCcwDotIcon, SendIcon } from 'lucide-react'
import { useGlobalStore } from '@/store/globalStore'
import AnimatedLoader from './helperComponents/AnimatedLoader'
import classNames from 'classnames'

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
}

function ChatComponent() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { isChatwindow, requestedFileId, setClean, isClean } = useGlobalStore();

  const handleSend = async () => {
    if (!query.trim()) return;
    setMessages(prev => [...prev, { type: 'user', message: query }]);
    setQuery('');
    setLoading(true);
    const beforePrompt = ''
    try {
      const res = await fetch(`http://localhost:8000/chat?message=${encodeURIComponent(beforePrompt + query)}&fileId=${requestedFileId}`);
      const data = await res.json();

      setMessages(prev => [...prev, { type: 'bot', message: data.message || 'No response received.' }]);
      setClean(false)
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', message: 'Error fetching response.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClean) {
      setMessages([])
    }

  }, [isClean])

  if (isChatwindow === 'loading') return <AnimatedLoader />;

  if (isChatwindow === 'idle') {
    return (
      <div className="min-h-screen flex justify-center items-center font-bold font-mono text-blue-600">
        Please upload a PDF file to add context.
      </div>
    );
  }

  if (isChatwindow === 'blocked') {
    return (
      <div className="min-h-screen flex justify-center items-center font-bold font-mono text-blue-600">
        Unable to process your request at the time. Please try later 😔
      </div>
    );
  }

  return (
    <>
      {isChatwindow === 'allowed' && (
        <div className="flex flex-col justify-between min-h-screen p-4">
          {/* Chat Messages */}
          <div className="flex flex-col gap-2 mb-20 overflow-auto max-h-[80vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={classNames(
                  'max-w-[75%] px-4 py-2 rounded-xl shadow',
                  msg.type === 'user'
                    ? 'bg-blue-500 text-white self-end rounded-br-none'
                    : 'bg-gray-200 text-black self-start rounded-bl-none'
                )}
              >
                {msg.message}
              </div>
            ))}
            {loading && (

              <AnimatedLoader />

            )}
          </div>

          {/* Input Section */}
          <div className="fixed bottom-3.5 w-[57vw] flex gap-3">
            <Input
              placeholder="Enter your queries..."
              className="border-blue-500 border-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
              variant="outline"
              className="p-2 w-[5vw] bg-blue-500 text-white font-extrabold"
              onClick={handleSend}
              disabled={loading}
            >
              <SendIcon />
            </Button>
            <div className="p-1 cursor-pointer" onClick={() => setQuery('')}>
              <RefreshCcwDotIcon className="text-blue-700" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatComponent;
