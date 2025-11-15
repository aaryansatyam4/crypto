import React, { useState, useCallback, useMemo, useEffect } from 'react';

// --- Helper Icon Components ---

const UploadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const DownloadIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" y2="3" />
    </svg>
);

const ClipboardIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
);

const ShieldLockIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <rect x="9" y="11" width="6" height="5" rx="1" />
        <path d="M9 11V9a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v2" />
    </svg>
);

const KeyIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="m21 2-9.6 9.6" />
        <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
);

const FileInputIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="m9 15 3-3 3 3" />
    </svg>
);

// --- New Theme Icons ---
const SunIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);


// --- Feature Card Component ---
const FeatureCard = ({ icon, title, children }) => (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-6 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-lg mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400">{children}</p>
    </div>
);


// --- Main Application Component ---

function App() {
  const [mode, setMode] = useState('image');
  const [action, setAction] = useState('hide');
  const [coverFile, setCoverFile] = useState(null);
  const [stegoFile, setStegoFile] = useState(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // --- Theme Toggle Effect ---
  useEffect(() => {
    // On mount, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- Reset State Logic ---
  const resetState = useCallback(() => {
    setCoverFile(null);
    setStegoFile(null);
    setMessage('');
    setPassword('');
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleActionChange = (newAction) => {
    setAction(newAction);
    resetState();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetState();
  };
  
  // --- Form Validation ---
  const isFormValid = useMemo(() => {
    if (action === 'hide') {
        return coverFile && message.trim() && password.trim();
    } else {
        return stegoFile && password.trim();
    }
  }, [action, coverFile, message, password, stegoFile]);

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setResult(null);
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    const API_BASE_URL = "http://127.0.0.1:5000";
    let url = "";

    if (mode === 'image') {
      if (action === 'hide') {
        formData.append('cover_file', coverFile);
        formData.append('message', message);
        formData.append('password', password);
        url = `${API_BASE_URL}/hide_image`;
      } else {
        formData.append('stego_file', stegoFile);
        formData.append('password', password);
        url = `${API_BASE_URL}/extract_image`;
      }
    } else { // audio
      if (action === 'hide') {
        formData.append('cover_audio', coverFile);
        formData.append('message', message);
        formData.append('password', password);
        url = `${API_BASE_URL}/hide_audio`;
      } else {
        formData.append('stego_audio', stegoFile);
        formData.append('password', password);
        url = `${API_BASE_URL}/extract_audio`;
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        if (action === 'hide') {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const fileName = mode === 'image' ? 'stego.png' : 'stego.wav';
          setResult({ downloadUrl, fileName });
        } else {
          const data = await response.json();
          setResult({ message: data.message });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An unknown error occurred.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please ensure it is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helper Functions ---
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTool = (e) => {
    e.preventDefault();
    document.getElementById('tool')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // --- Render Functions ---
  const renderResult = () => {
    if (!result) return null;
    if ('downloadUrl' in result) {
      return (
        <div className="bg-green-50 dark:bg-green-900/50 border-l-4 border-green-500 p-4 rounded-r-lg mt-6">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Success!</h3>
          <p className="text-green-700 dark:text-green-300 mb-4">Your stego file has been generated.</p>
          <a
            href={result.downloadUrl}
            download={result.fileName}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
          >
            <DownloadIcon className="w-5 h-5" />
            Download {result.fileName}
          </a>
        </div>
      );
    }
    if ('message' in result) {
      return (
        <div className="bg-green-50 dark:bg-green-900/50 border-l-4 border-green-500 p-4 rounded-r-lg mt-6">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Extracted Message:</h3>
          <div className="relative bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-md">
             <p className="text-slate-700 dark:text-slate-200 font-mono break-words">{result.message}</p>
             <button onClick={() => handleCopy(result.message)} className="absolute top-2 right-2 p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                {copied ? <span className="text-sm text-green-600 dark:text-green-400">Copied!</span> : <ClipboardIcon className="w-5 h-5"/>}
             </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans min-h-screen relative z-0 overflow-x-hidden">
        {/* Animated Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-black dark:to-indigo-950 -z-10 animate-[gradientBG_15s_ease_infinite]" 
             style={{ backgroundSize: '200% 200%' }}>
        </div>
        
        {/* Header */}
        <header className="sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-50 border-b border-slate-200/50 dark:border-slate-700/50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                    Chupan Chupai
                </h1>
                <div className="flex items-center gap-4">
                    <a 
                        href="#tool" 
                        onClick={scrollToTool}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hidden sm:block"
                    >
                        Use The Tool
                    </a>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    </button>
                </div>
            </nav>
        </header>

        {/* Hero Section */}
        <section className="py-20 sm:py-32 bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Hide Your Secrets in <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Plain Sight</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                    Chupan Chupai uses the art of steganography to embed your private messages within ordinary image or audio files. Encrypted and invisible, your data stays secure.
                </p>
                <div className="mt-8">
                    <a 
                        href="#tool" 
                        onClick={scrollToTool}
                        className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
                    >
                        Hide a Message Now
                    </a>
                </div>
            </div>
        </section>

        {/* Features/How it works Section */}
        <section className="py-20 sm:py-24 bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">A Simple & Secure Process</h2>
                    <p className="mt-4 text-slate-500 dark:text-slate-400">Hide or reveal your secrets in just three easy steps.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard icon={<FileInputIcon className="w-6 h-6" />} title="1. Embed Your Message">
                        Choose a cover file (image or audio), type your secret message, and set a password for strong AES encryption.
                    </FeatureCard>
                    <FeatureCard icon={<ShieldLockIcon className="w-6 h-6" />} title="2. Encrypt & Hide">
                        Our tool encrypts your message and seamlessly hides it within the cover file, creating a new 'stego' file that looks completely normal.
                    </FeatureCard>
                    <FeatureCard icon={<KeyIcon className="w-6 h-6" />} title="3. Reveal the Secret">
                        To extract the message, simply upload the stego file and provide the correct password. Your original message is instantly revealed.
                    </FeatureCard>
                </div>
            </div>
        </section>

        {/* The Tool Section */}
        <section id="tool" className="py-20 sm:py-24 bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <main className="w-full max-w-2xl mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-10 border border-white/50 dark:border-slate-700/50">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent pb-2">
                            Steganography Tool
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Select a mode and action to begin.</p>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Mode</label>
                                <div className="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                                    <button type="button" onClick={() => handleModeChange('image')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${mode === 'image' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'}`}>Image</button>
                                    <button type="button" onClick={() => handleModeChange('audio')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${mode === 'audio' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'}`}>Audio</button>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Action</label>
                                <div className="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                                    <button type="button" onClick={() => handleActionChange('hide')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${action === 'hide' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'}`}>Hide</button>
                                    <button type="button" onClick={() => handleActionChange('extract')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${action === 'extract' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'}`}>Extract</button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {action === 'hide' ? (
                                <>
                                    <div>
                                        <label htmlFor="cover-file" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Cover {mode === 'image' ? 'Image' : 'Audio'}</label>
                                        <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/50 dark:bg-slate-700/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                            <UploadIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{coverFile ? coverFile.name : `Choose a ${mode === 'image' ? '.png or .jpeg' : '.wav'} file`}</span>
                                            <input id="cover-file" type="file" accept={mode === 'image' ? 'image/png, image/jpeg' : 'audio/wav'} className="hidden" onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)} />
                                        </label>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Secret Message</label>
                                        <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full p-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500" placeholder="Enter your secret message here..." />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label htmlFor="stego-file" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Stego {mode === 'image' ? 'Image' : 'Audio'}</label>
                                    <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/50 dark:bg-slate-700/50 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                                        <UploadIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{stegoFile ? stegoFile.name : `Choose a ${mode === 'image' ? '.png' : '.wav'} file`}</span>
                                        <input id="stego-file" type="file" accept={mode === 'image' ? 'image/png' : 'audio/wav'} className="hidden" onChange={(e) => setStegoFile(e.target.files ? e.target.files[0] : null)} />
                                    </label>
                                </div>
                            )}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
                                <div className="relative">
                                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pl-10 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500" placeholder="Encryption/Decryption key" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    action === 'hide' ? 'Hide Message' : 'Extract Message'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <p className="text-red-700 dark:text-red-200 font-medium">{error}</p>
                            </div>
                        )}
                        {renderResult()}
                    </div>
                </main>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} Chupan Chupai. All rights reserved.</p>
            </div>
        </footer>
    </div>
  );
}

export default App;