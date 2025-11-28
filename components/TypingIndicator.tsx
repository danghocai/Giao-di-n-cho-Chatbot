import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1.5 p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm w-fit items-center">
      <div className="w-2 h-2 bg-dut-blue rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-dut-blue rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-dut-blue rounded-full animate-bounce"></div>
    </div>
  );
};

export default TypingIndicator;
