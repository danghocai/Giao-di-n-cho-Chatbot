import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Sparkles, MessageSquare, RefreshCw, GraduationCap, Calculator, Calendar } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import { Message, Suggestion } from './types';
import { sendMessageToGemini, resetChatSession } from './services/geminiService';

// Initial suggestions shown when chat is empty
const INITIAL_SUGGESTIONS: Suggestion[] = [
  { icon: <GraduationCap size={20} />, label: "Ngành HOT", prompt: "Các ngành đào tạo mũi nhọn của trường Đại học Bách khoa Đà Nẵng là gì?" },
  { icon: <Calculator size={20} />, label: "Điểm chuẩn", prompt: "Cho mình biết điểm chuẩn năm ngoái của ngành Công nghệ thông tin." },
  { icon: <Calendar size={20} />, label: "Lịch xét tuyển", prompt: "Thời gian và phương thức xét tuyển học bạ năm nay như thế nào?" },
  { icon: <MessageSquare size={20} />, label: "Học phí", prompt: "Mức học phí trung bình một kỳ học là bao nhiêu?" },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Add a session ID state to force re-render of the chat area on reset
  const [chatSessionId, setChatSessionId] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Ref to track the validity of the current chat session. 
  // Incremented on reset to invalidate pending async updates.
  const resetTokenRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    // Capture current token to check against later
    const currentToken = resetTokenRef.current;

    // Add User Message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Placeholder for AI Message to allow streaming updates
    const botMessageId = (Date.now() + 1).toString();
    let accumulatedText = '';

    setMessages(prev => [
      ...prev,
      {
        id: botMessageId,
        role: 'model',
        content: '', // Start empty
        timestamp: new Date(),
      }
    ]);

    try {
      await sendMessageToGemini(trimmedText, (chunkText) => {
        // If reset happened, ignore this chunk
        if (resetTokenRef.current !== currentToken) return;

        accumulatedText += chunkText;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: accumulatedText }
              : msg
          )
        );
      });
    } catch (error) {
      // If reset happened, ignore error update
      if (resetTokenRef.current !== currentToken) return;

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'model',
          content: 'Xin lỗi, hiện tại hệ thống đang gặp sự cố kết nối. Vui lòng thử lại sau giây lát.',
          timestamp: new Date(),
        }
      ]);
    } finally {
      // If reset happened, don't change loading state (it was already reset)
      if (resetTokenRef.current === currentToken) {
        setIsLoading(false);
        // Focus back on input only on desktop to prevent mobile keyboard jumping
        if (window.innerWidth > 768) {
          inputRef.current?.focus();
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    const performReset = () => {
      // 1. Invalidate pending async tasks
      resetTokenRef.current += 1;
      
      // 2. Clear UI state
      setIsLoading(false);
      setMessages([]);
      setInput(''); 
      
      // 3. Force Remount of Chat Area to clear any visual artifacts
      setChatSessionId(prev => prev + 1);

      // 4. Reset Backend
      resetChatSession();
      
      // 5. UI Polish
      setIsSidebarOpen(false); 
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    };

    if (messages.length > 0) {
      if (window.confirm("Bắt đầu cuộc trò chuyện mới? Nội dung hiện tại sẽ bị xóa.")) {
        performReset();
      }
    } else {
       // If already empty, just ensure everything is clean without confirmation
       performReset();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full max-w-5xl mx-auto lg:border-x lg:border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        
        {/* Header */}
        <header className="h-16 px-4 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
            >
              <Menu className="text-slate-600" />
            </button>
            <div className="flex flex-col">
              <h1 className="font-bold text-dut-dark text-lg leading-tight">DUT Tư Vấn</h1>
              <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-dut-blue hover:bg-dut-light rounded-lg transition-all active:scale-95 group"
            title="Bắt đầu cuộc trò chuyện mới"
          >
            <span className="hidden sm:inline text-xs font-medium group-hover:text-dut-blue">Cuộc trò chuyện mới</span>
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </header>

        {/* Chat Area - Added Key for Force Remount */}
        <main 
          key={chatSessionId} 
          className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade-in pb-10">
              <div className="text-center space-y-3 px-4">
                <div className="w-20 h-20 bg-dut-light rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-lg">
                  <Sparkles className="text-dut-blue w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Xin chào!</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Mình là trợ lý ảo AI của trường ĐH Bách Khoa ĐN. Bạn cần tìm hiểu thông tin gì về trường hôm nay?
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-2">
                {INITIAL_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug.prompt)}
                    className="flex items-start gap-4 p-4 bg-white border border-slate-200 hover:border-dut-blue/50 hover:shadow-md hover:shadow-dut-blue/5 rounded-xl transition-all text-left group"
                  >
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:text-dut-blue group-hover:bg-dut-light transition-colors">
                      {sug.icon}
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800 text-sm mb-0.5 group-hover:text-dut-blue transition-colors">{sug.label}</span>
                      <span className="text-xs text-slate-500 line-clamp-1">{sug.prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mx-auto space-y-2">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="animate-fade-in">
                   <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          )}
        </main>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="max-w-3xl mx-auto relative flex items-end gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-dut-blue/20 focus-within:border-dut-blue transition-all shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-transparent border-none focus:ring-0 p-3 max-h-32 text-slate-800 placeholder:text-slate-400"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl mb-0.5 transition-all duration-200 flex items-center justify-center ${
                !input.trim() || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-dut-blue text-white hover:bg-dut-dark shadow-md hover:shadow-lg transform active:scale-95'
              }`}
            >
              <Send size={20} className={isLoading ? 'opacity-0' : 'opacity-100'} />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400">Trợ lý ảo có thể mắc sai sót. Vui lòng kiểm tra lại thông tin quan trọng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;