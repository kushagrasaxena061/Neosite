"use client";

import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { ArrowRight, Link, Loader2Icon, MenuIcon } from 'lucide-react';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import ReactMarkdown from "react-markdown"
import { useSidebar } from '../ui/sidebar';

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
}

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false)

    const contextValue = useContext(MessagesContext);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const UpdateMessages = useMutation(api.workspace.UpdateMessages)
    const { toggleSidebar } = useSidebar()

    if (!contextValue) {
        console.warn("MessagesContext is undefined. Make sure it's wrapped in a Provider.");
        return null;
    }

    const messages = Array.isArray(contextValue.messages) ? contextValue.messages : [];
    const setMessages = contextValue.setMessages ?? (() => { });

    useEffect(() => {
        if (id) {
            GetWorkspaceData();
        }
    }, [id]);

    const GetWorkspaceData = async () => {
        try {
            const result = await convex.query(api.workspace.GetWorkspace, { workspaceId: id });
            setMessages(result?.messages ?? []);
        } catch (error) {
            console.error("Error fetching workspace data:", error);
            setMessages([]);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessageRole = messages[messages.length - 1]?.role;
            if (lastMessageRole === 'user') {
                GetAiResponse();
            }
        }
    }, [messages]);

    const GetAiResponse = async () => {
        try {
            setLoading(true)
            const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
            const result = await axios.post('/api/ai-chat', { prompt: PROMPT });

            const aiResp = { role: 'ai', content: result.data.result }

            setMessages((prev) => [...prev, aiResp]);

            await UpdateMessages({
                messages: [...messages, aiResp], workspaceId: id
            })
        } catch (error) {
            console.error("Error fetching AI response:", error);
        } finally {
            setLoading(false);
        }
    };

    const onGenerate = () => {
        if (!userInput.trim()) return;
        setMessages((prev) => [...prev, { role: 'user', content: userInput.trim() }]);
        setUserInput("");
    };

    return (
        <div className="relative h-[75vh] flex flex-col ">
            <div className="flex-1 overflow-y-scroll px-5">
                {messages.map((msg, index) => (
                    <div key={index} className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7" style={{ backgroundColor: Colors.CHAT_BACKGROUND }}>
                        <ReactMarkdown className="flex flex-col">{msg.content}</ReactMarkdown>
                    </div>
                ))}
                {loading &&
                    <div className="p-3 rounded-lg mb-2 flex gap-2 items-start" style={{ backgroundColor: Colors.CHAT_BACKGROUND }}>
                        <Loader2Icon className='animate-spin' />
                        <h2>Generating response...</h2>
                    </div>
                }
            </div>
            <div>
                <div className='gap-2 flex items-end'>
                    {userDetail && <MenuIcon className="h-8 w-8 cursor-pointer" onClick={toggleSidebar} />}
                    <div className="p-5 border rounded-xl max-w-xl w-full mt-3" style={{ backgroundColor: Colors.BACKGROUND }}>
                        <div className="flex gap-2">
                            <textarea
                                value={userInput}
                                onChange={(event) => setUserInput(event.target.value)}
                                placeholder={Lookup.INPUT_PLACEHOLDER}
                                className="outline-none text-white bg-transparent w-full h-32 max-h-56 resize-none"
                            />
                            {userInput && (
                                <ArrowRight onClick={onGenerate} className="bg-green-400 text-white font-bold p-2 h-10 w-10 rounded-md cursor-pointer" />
                            )}
                        </div>
                        <div>
                            <Link className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;
