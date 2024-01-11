import React, { useState } from 'react';

interface ChatInputProps {
  onSend?: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (value.trim()) {
      onSend?.(value.trim());
      setValue('');
    }
  };

  return (
    <div className="chat-input">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};