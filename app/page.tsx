'use client';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

interface Message {
    sender: string;
    text: string;
    timestamp?: string;
}

export default function Home() {
    const [selectedImages, setSelectedImages] = useState<{ src: string; id: number; label: string }[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeSender, setActiveSender] = useState<string>('Person 1');
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the scrolling container

    const images = [
        { id: 1, src: '/happy.gif', label: 'Happy' },
        { id: 2, src: '/sad-miss.gif', label: 'Sad' },
        { id: 3, src: '/angry.gif', label: 'Angry' },
        { id: 4, src: '/laugh.gif', label: 'Laughing' },
        { id: 5, src: '/sleepy.gif', label: 'Sleepy' },
        { id: 6, src: '/love.gif', label: 'Love' },
        { id: 7, src: '/scared.gif', label: 'Scared' },
        { id: 8, src: '/hungry.gif', label: 'Hungry' },
        { id: 9, src: '/play.png', label: 'Playing' },
        { id: 10, src: '/and.png', label: 'And' },
        { id: 11, src: '/or.png', label: 'Or' },
        { id: 12, src: '/then.png', label: 'Then' },
    ];

    const handleSelectImage = (image: { src: string; id: number; label: string }) => {
        setSelectedImages(prevSelectedImages => [...prevSelectedImages, image]);
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance("You selected " + image.label);
            window.speechSynthesis.speak(speech);
        }
    };

    const handleSubmit = () => {
        // Handle submission here, e.g., send selected images to a server
        console.log("Selected images:", selectedImages);
        //loop through selected images

        let sentence = "I am " + selectedImages.map(image => image.label.toLowerCase()).join(' and ') + "."
        if (selectedImages.at(0)?.id === 8 && selectedImages.at(1)?.id === 12 && selectedImages.at(2)?.id === 5) {
            sentence = "Let's eat and then sleep.";
        }
        else if (selectedImages.at(0)?.id === 9 && selectedImages.at(1)?.id === 10 && selectedImages.at(2)?.id === 8) {
            sentence = "I want to play and eat.";
        }
        else if (selectedImages.at(0)?.id === 8 && selectedImages.at(1)?.id === 11 && selectedImages.at(2)?.id === 9) {
            sentence = "Can I eat or play?";
        }

        const newMessage = {
            sender: activeSender,
            text: sentence,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(sentence);
            window.speechSynthesis.speak(speech);
        }
        setMessages(prevMessages => [...prevMessages, newMessage]);
        // Clear selected images after submission
        setSelectedImages([]);
    };

    const handleClear = () => {
        setSelectedImages([]);
    };

    // Scroll to bottom whenever messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div>
            <main className="flex justify-center items-start min-h-screen p-4">
                <div className="flex flex-col md:flex-row w-full max-w-7xl">
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

                    <div className="flex-grow p-4">
                        <h1 className="text-2xl font-bold text-center mb-4">Visual Communication Board</h1>

                        <div className="mb-4 overflow-auto bg-gray-700 rounded-lg shadow" style={{ maxHeight: '40vh' }}>
                            {messages.map((msg, index, arr) => (
                                <div key={index}>
                                    {index === 0 || arr[index - 1].sender !== msg.sender ? (
                                        <div className="text-2xl  text-center font-bold mt-2">
                                            {`${msg.sender}:`}
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
                            <div ref={messagesEndRef} />
                        </div>
                        <h1 className={"text-2xl font-bold text-center mb-4 " + (activeSender === 'Person 1' ? "text-blue-400" : "text-green-400")}>
                            {activeSender} speaks now
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {images.map((image) => (
                                <div key={image.id} className="cursor-pointer" onClick={() => handleSelectImage(image)}>
                                    <img src={image.src} alt={image.label} height={480} width={480} className="w-full h-auto rounded" />
                                    <p className="text-center mt-2">{image.label}</p>
                                </div>
                            ))}
                        </div>
                        {selectedImages.length > 0 && (
                            <div className="mt-4 flex justify-center">
                                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-center text-white rounded-lg shadow-md mr-2">
                                    Submit
                                </button>
                                <button onClick={handleClear} className="px-4 py-2 bg-red-600 text-center text-white rounded-lg shadow-md">
                                    Clear
                                </button>
                            </div>
                        )}
                        {selectedImages.length > 0 && (
                            <div className="mt-2 text-center">
                                <p>Selected Images: {selectedImages.map(image => image.label).join(', ')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
