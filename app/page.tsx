'use client';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

interface Message {
    sender: string;
    text: string;
    timestamp?: string;
}

export default function Home() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeSender, setActiveSender] = useState<string>('Person 1');
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the scrolling container

    const images = [
        { id: 1, src: '/happy.gif', label: 'Happy' },
        { id: 2, src: '/sad-cry.gif', label: 'Sad Crying' },
        { id: 3, src: '/sad-miss.gif', label: 'Sad Miss you' },
        { id: 4, src: '/sad-nod.gif', label: 'Sad Nodding' },
    ];

    const handleSelectImage = (image: { src: string; id: number; label: string }) => {
        // @ts-ignore
        setSelectedImage(image);
        const newMessage = {
            sender: activeSender,
            text: image.label,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(image.label);
            window.speechSynthesis.speak(speech);
        }
    };

    // Scroll to bottom whenever messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div>
            <Head>
                <title>Visual Communication Board</title>
            </Head>

            <main className="flex justify-center items-start min-h-screen p-4">
                <div className="flex flex-col md:flex-row w-full max-w-7xl">
                    {/* Sender Selector Sidebar */}
                    <aside className="w-full md:w-1/4 lg:w-1/6 p-4 bg-gray-700 rounded-3xl">
                        <div className="sticky top-4 space-y-4 h-full flex flex-col">
                            <button
                                className={`flex-1 py-2 rounded-lg text-lg font-semibold ${activeSender === 'Person 1' ? 'bg-blue-600 text-white' : 'bg-blue-300'}`}
                                onClick={() => setActiveSender('Person 1')}
                            >
                                Person 1
                            </button>
                            <button
                                className={`flex-1 py-2 rounded-lg text-lg font-semibold ${activeSender === 'Person 2' ? 'bg-green-600 text-white' : 'bg-green-300'}`}
                                onClick={() => setActiveSender('Person 2')}
                            >
                                Person 2
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-grow p-4">
                        <h1 className="text-2xl font-bold text-center mb-4">Visual Communication Board</h1>

                        <div className="mb-4 overflow-auto bg-gray-700 rounded-lg shadow" style={{ maxHeight: '40vh' }}>
                            {messages.map((msg, index, arr) => (
                                <div key={index}>
                                    {index === 0 || arr[index - 1].sender !== msg.sender ? (
                                        <div className="text-2xl  text-center font-bold mt-2">
                                            {`${msg.sender} starts talking now:`}
                                        </div>
                                    ) : null}
                                    <div className="flex justify-center my-2">
                                        <div className="flex items-center ">
                                            <p className="text-sm rounded-lg px-2 py-1">{msg.timestamp}</p>
                                            <div className={`p-2 rounded-lg ${msg.sender === 'Person 1' ? 'bg-blue-600' : 'bg-green-600'} shadow-lg`}>
                                                <p className="text-lg text-white font-semibold">{msg.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} /> {/* Invisible element at the end of messages */}
                        </div>
                        <h1 className={"text-2xl font-bold text-center mb-4 " + (activeSender === 'Person 1' ? "text-blue-400" : "text-green-400")}>
                            {activeSender} speaks now
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {images.map((image) => (
                                <div key={image.id} className="cursor-pointer" onClick={() => handleSelectImage(image)}>
                                    <img src={image.src} alt={image.label} className="w-full h-auto rounded" />
                                    <p className="text-center mt-2">{image.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
