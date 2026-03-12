import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const languages = ['English', 'Hindi', 'Kannada'];

const quickResponses: Record<string, string[]> = {
  English: [
    'Hello! I am your Swasthya Parivar assistant. Ask me about reward points, eligibility, or benefits!',
    'You can earn points by completing health checkups and maintaining regular attendance.',
    'Benefits unlock at 73% community health progress. Keep participating!',
  ],
  Hindi: [
    'नमस्ते! मैं आपका स्वास्थ्य परिवार सहायक हूं। पुरस्कार अंक, पात्रता या लाभ के बारे में पूछें!',
    'आप स्वास्थ्य जांच पूर्ण करके और नियमित उपस्थिति बनाए रखकर अंक अर्जित कर सकते हैं।',
    '73% सामुदायिक स्वास्थ्य प्रगति पर लाभ अनलॉक होते हैं। भागीदारी जारी रखें!',
  ],
  Kannada: [
    'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ವಸ್ಥ್ಯ ಪರಿವಾರ ಸಹಾಯಕ. ಬಹುಮಾನ ಅಂಕಗಳು, ಅರ್ಹತೆ ಅಥವಾ ಪ್ರಯೋಜನಗಳ ಬಗ್ಗೆ ಕೇಳಿ!',
    'ಆರೋಗ್ಯ ತಪಾಸಣೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸುವ ಮೂಲಕ ಮತ್ತು ನಿಯಮಿತ ಹಾಜರಾತಿಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವ ಮೂಲಕ ನೀವು ಅಂಕಗಳನ್ನು ಗಳಿಸಬಹುದು.',
    '73% ಸಮುದಾಯ ಆರೋಗ್ಯ ಪ್ರಗತಿಯಲ್ಲಿ ಪ್ರಯೋಜನಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲಾಗುತ್ತದೆ. ಭಾಗವಹಿಸುವುದನ್ನು ಮುಂದುವರಿಸಿ!',
  ],
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: quickResponses.English[0], isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    
    // Simulate response
    setTimeout(() => {
      const responses = quickResponses[selectedLanguage as keyof typeof quickResponses];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { text: randomResponse, isUser: false }]);
    }, 1000);

    setInputValue('');
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const responses = quickResponses[lang as keyof typeof quickResponses];
    setMessages([{ text: responses[0], isUser: false }]);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-lime-accent text-black flex items-center justify-center shadow-lg hover:shadow-lime-accent/30 transition-shadow z-50"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-bg-secondary border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-bg-tertiary">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-lime-accent/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-lime-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Reward Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex gap-2 p-3 border-b border-white/5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-lime-accent text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      message.isUser
                        ? 'bg-gami-purple text-white rounded-br-md'
                        : 'bg-bg-tertiary text-white/80 rounded-bl-md'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 bg-bg-tertiary">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about rewards..."
                  className="flex-1 h-10 bg-bg-secondary border-white/10 text-white placeholder:text-white/40 text-sm"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  className="h-10 w-10 bg-lime-accent text-black hover:bg-lime-accent/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
