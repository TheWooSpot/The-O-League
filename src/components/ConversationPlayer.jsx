import React, { useState, useEffect, useRef } from 'react';

// Conversation data generator based on topic
const generateConversation = (topic) => {
  // Default hosts
  const hosts = {
    host1: { name: "Alex", voice: "neutral" },
    host2: { name: "Morgan", voice: "thoughtful" }
  };
  
  // Topic-specific conversation scripts
  const conversations = {
    "The Nature of Consciousness": [
      { speaker: "host1", text: "Welcome to our discussion on the nature of consciousness. I'm Alex, joined by my colleague Morgan." },
      { speaker: "host2", text: "Hello everyone. This is such a fascinating topic that bridges philosophy, neuroscience, and even quantum physics." },
      { speaker: "host1", text: "Indeed. Let's start with the hard problem of consciousness - why do we have subjective experiences at all?" },
      { speaker: "host2", text: "That's the central mystery. Physical processes in the brain somehow give rise to subjective experience, but the mechanism remains elusive." },
      { speaker: "host1", text: "Some philosophers argue consciousness is fundamental to reality, not emergent from physical processes." },
      { speaker: "host2", text: "The panpsychist view, yes. It suggests consciousness might be a basic property of matter, like mass or charge." },
      { speaker: "userPrompt", text: "What are your thoughts on consciousness? Do you think it's unique to humans?" },
      { speaker: "host1", text: "Neuroscience has made tremendous progress mapping neural correlates of consciousness, but correlation isn't causation." },
      { speaker: "host2", text: "And we still can't bridge the explanatory gap between brain activity and subjective experience - the 'what it's like' quality." },
      { speaker: "host1", text: "Some theories suggest consciousness emerges from integrated information processing, which could exist in different forms across species." },
      { speaker: "userPrompt", text: "Do you think artificial systems could ever be conscious?" },
      { speaker: "host2", text: "The Chinese Room thought experiment challenges the idea that computation alone can create understanding or consciousness." },
      { speaker: "host1", text: "Yet our intuitions might be misleading. If consciousness is substrate-independent, it could theoretically arise in non-biological systems." },
      { speaker: "host2", text: "The challenge is that consciousness is inherently subjective, while science demands objective measurement." },
      { speaker: "host1", text: "As we conclude, consciousness remains one of the greatest unsolved mysteries in science and philosophy." },
      { speaker: "host2", text: "Thank you for joining our discussion. We encourage you to explore other fascinating topics in our collection." }
    ],
    
    "Ethical Implications of AI": [
      { speaker: "host1", text: "Welcome to our discussion on the ethical implications of AI. I'm Alex, joined by my colleague Morgan." },
      { speaker: "host2", text: "Hello everyone. As AI systems become more powerful and ubiquitous, ethical considerations become increasingly important." },
      { speaker: "host1", text: "Let's start with AI decision-making. When algorithms make decisions affecting human lives, questions of fairness and accountability arise." },
      { speaker: "host2", text: "Absolutely. AI systems can inherit and amplify biases present in their training data, leading to discriminatory outcomes." },
      { speaker: "host1", text: "And there's the question of transparency. Many advanced AI systems function as 'black boxes' where even their creators can't fully explain decisions." },
      { speaker: "host2", text: "This creates a responsibility gap. Who's accountable when an AI system makes a harmful decision - the developer, the user, or the system itself?" },
      { speaker: "userPrompt", text: "What are your thoughts on AI ethics? Are there particular concerns that stand out to you?" },
      { speaker: "host1", text: "Another critical area is privacy. AI systems often require vast amounts of data, raising questions about consent and surveillance." },
      { speaker: "host2", text: "And as AI becomes more capable, questions of autonomy arise. How much decision-making power should we delegate to machines?" },
      { speaker: "host1", text: "Some philosophers argue we need to establish clear ethical frameworks before deploying powerful AI systems, not after problems emerge." },
      { speaker: "userPrompt", text: "Do you think AI should be regulated, and if so, how?" },
      { speaker: "host2", text: "The potential for AI to displace jobs raises important questions about economic justice and the future of work." },
      { speaker: "host1", text: "And looking further ahead, advanced AI raises existential questions about human uniqueness and our role in a world with potentially superintelligent machines." },
      { speaker: "host2", text: "These ethical challenges require input from diverse perspectives - not just technologists, but philosophers, social scientists, and the broader public." },
      { speaker: "host1", text: "As we conclude, the ethical development of AI remains one of the most important challenges of our time." },
      { speaker: "host2", text: "Thank you for joining our discussion. We encourage you to explore other fascinating topics in our collection." }
    ],
    
    // Default conversation for any other topic
    "default": [
      { speaker: "host1", text: `Welcome to our discussion on ${topic}. I'm Alex, joined by my colleague Morgan.` },
      { speaker: "host2", text: `Hello everyone. This is such a fascinating topic with many dimensions to explore.` },
      { speaker: "host1", text: `Let's start by considering some of the key perspectives on ${topic}.` },
      { speaker: "host2", text: `One approach is to consider the historical context and how our understanding has evolved over time.` },
      { speaker: "host1", text: `That's a good point. There's also the question of how different disciplines approach this topic.` },
      { speaker: "host2", text: `And we shouldn't forget the practical implications for society and individuals.` },
      { speaker: "userPrompt", text: `What are your thoughts on ${topic}? Is there a particular aspect that interests you?` },
      { speaker: "host1", text: `Another interesting dimension is how cultural perspectives shape our understanding of this topic.` },
      { speaker: "host2", text: `And technological developments continue to transform how we think about these issues.` },
      { speaker: "host1", text: `Some experts argue that we need to fundamentally rethink our approach to this subject.` },
      { speaker: "userPrompt", text: `Do you see any potential solutions or ways forward on this topic?` },
      { speaker: "host2", text: `There are ethical considerations we should keep in mind as we navigate these complex questions.` },
      { speaker: "host1", text: `Looking to the future, this topic will likely become even more important as society continues to evolve.` },
      { speaker: "host2", text: `The interdisciplinary nature of this subject makes it particularly rich for exploration.` },
      { speaker: "host1", text: `As we conclude, there's clearly much more to discuss about ${topic}.` },
      { speaker: "host2", text: `Thank you for joining our conversation. We encourage you to explore other fascinating topics in our collection.` }
    ]
  };
  
  // Return the appropriate conversation or default if not found
  return {
    hosts,
    script: conversations[topic] || conversations["default"]
  };
};

const ConversationPlayer = ({ topic }) => {
  const [conversation, setConversation] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [showUserPrompt, setShowUserPrompt] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [conversationEnded, setConversationEnded] = useState(false);
  
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);
  
  // Initialize conversation based on topic
  useEffect(() => {
    setConversation(generateConversation(topic));
  }, [topic]);
  
  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);
  
  // Handle conversation progression
  useEffect(() => {
    if (!conversation || !isPlaying) return;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // If we've reached the end of the script
    if (currentStep >= conversation.script.length) {
      setIsPlaying(false);
      setConversationEnded(true);
      return;
    }
    
    const currentLine = conversation.script[currentStep];
    
    // If it's a user prompt and hand is raised
    if (currentLine.speaker === "userPrompt" && handRaised) {
      setShowUserPrompt(true);
      // Don't auto-advance, wait for user input
    } 
    // If it's a user prompt but hand is not raised, skip it
    else if (currentLine.speaker === "userPrompt" && !handRaised) {
      setCurrentStep(prevStep => prevStep + 1);
    } 
    // Regular dialogue line
    else {
      // Add to transcript
      setTranscript(prev => [...prev, {
        speaker: currentLine.speaker === "host1" ? conversation.hosts.host1.name : conversation.hosts.host2.name,
        text: currentLine.text
      }]);
      
      // Advance to next step after delay
      timerRef.current = setTimeout(() => {
        setCurrentStep(prevStep => prevStep + 1);
      }, 5000); // 5 seconds per line
    }
  }, [conversation, currentStep, isPlaying, handRaised]);
  
  // Handle user input submission
  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message to transcript
    setTranscript(prev => [...prev, {
      speaker: userName || "You",
      text: userInput
    }]);
    
    // Clear input and hide prompt
    setUserInput("");
    setShowUserPrompt(false);
    
    // Continue conversation
    setTimeout(() => {
      setCurrentStep(prevStep => prevStep + 1);
    }, 1000);
  };
  
  // Handle name submission
  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      // Add welcome message
      setTranscript(prev => [...prev, {
        speaker: conversation.hosts.host1.name,
        text: `Thanks for joining us, ${userName}! What are your thoughts on this topic?`
      }]);
      setShowUserPrompt(true);
    }
  };
  
  // Start or pause the conversation
  const togglePlayback = () => {
    if (conversationEnded) {
      // Reset conversation if ended
      setCurrentStep(0);
      setTranscript([]);
      setConversationEnded(false);
    }
    setIsPlaying(!isPlaying);
  };
  
  // Raise hand to join conversation
  const raiseHand = () => {
    if (!handRaised) {
      setHandRaised(true);
      // Add acknowledgment to transcript
      setTranscript(prev => [...prev, {
        speaker: "System",
        text: "You've raised your hand to join the conversation. The hosts will invite you to speak soon."
      }]);
    }
  };
  
  if (!conversation) return <div>Loading conversation...</div>;
  
  return (
    <div className="flex flex-col h-[440px] max-h-[66vh]">
      <div className="bg-dark-200 p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-display font-semibold">Live Discussion: {topic}</h2>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={togglePlayback}
            className="p-2 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          <button 
            onClick={raiseHand}
            disabled={handRaised}
            className={`p-2 rounded-full ${handRaised ? 'bg-green-600' : 'bg-secondary-600 hover:bg-secondary-700'} transition-colors`}
            aria-label="Raise Hand"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-grow bg-dark-300 p-4 overflow-y-auto">
        <div className="space-y-4">
          {transcript.map((message, index) => (
            <div key={index} className={`flex ${message.speaker === (userName || "You") ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.speaker === (userName || "You") 
                  ? 'bg-secondary-600 text-white' 
                  : message.speaker === "System" 
                    ? 'bg-gray-700 text-gray-300 italic' 
                    : 'bg-dark-100 text-white'
              }`}>
                <div className="font-semibold text-sm mb-1">{message.speaker}</div>
                <div>{message.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="bg-dark-200 p-4 rounded-b-lg">
        {handRaised && !userName && (
          <form onSubmit={handleNameSubmit} className="flex space-x-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your first name"
              className="flex-grow px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none text-white"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 rounded-lg text-white transition-colors"
            >
              Join
            </button>
          </form>
        )}
        
        {showUserPrompt && (
          <form onSubmit={handleUserSubmit} className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-grow px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none text-white"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 rounded-lg text-white transition-colors"
            >
              Send
            </button>
          </form>
        )}
        
        {!handRaised && !showUserPrompt && (
          <div className="text-center text-gray-400">
            {isPlaying 
              ? "Listening to conversation... Click the hand icon to join in." 
              : conversationEnded 
                ? "Conversation has ended. Press play to restart or explore another topic." 
                : "Press play to start the conversation."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationPlayer;
