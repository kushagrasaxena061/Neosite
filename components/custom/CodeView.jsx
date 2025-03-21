"use client"

import React, { useContext, useEffect, useState } from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MessagesContext } from '@/context/MessagesContext'; // ✅ Import MessagesContext
import { useParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { UserDetailContext } from '@/context/UserDetailContext';
import SandpackPreviewClient from './SandpackPreviewClient';
import { ActionContext } from '@/context/ActionContext';

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
}

function CodeView() {
    const [activeTab, setActiveTab] = useState('code')
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE)
    const { messages, setMessages } = useContext(MessagesContext)
    const { id } = useParams()
    const convex = useConvex()
    const [loading, setLoading] = useState(false);

    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { action, setAction } = useContext(ActionContext)

    useEffect(() => {
        id && GetFiles()
    }, [id])

    useEffect(() => {
        setActiveTab('preview')
    }, [action])

    const GetFiles = async () => {
        setLoading(true)
        const result = await convex.query(api.workspace.GetWorkspace, { workspaceId: id })

        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData, }
        setFiles(mergedFiles)
        setLoading(false)
    }

    const UpdateFiles = useMutation(api.workspace.UpdateFiles)

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages.length - 1].role
            if (role == 'user') {
                GenerateAiCode()
            }
        }
    }, [messages])

    const GenerateAiCode = async () => {
        setLoading(true)
        const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT
        const result = await axios.post('/api/gen-ai-code', {
            prompt: PROMPT
        })
        const aiResp = result.data;

        const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files }
        setFiles(mergedFiles)

        await UpdateFiles({ workspaceId: id, files: aiResp?.files })

        setActiveTab('code')
        setLoading(false)

    }
    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full p-2 border'>
                <div className='flex items-center flex-wrap rounded-full shrink-0 bg-black justify-center p-1 w-[140px] gap-3'>
                    <h2
                        onClick={() => setActiveTab('code')}
                        className={`text-sm cursor-pointer ${activeTab == 'code' && 'text-sky-500 bg-sky-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Code</h2>

                    <h2
                        onClick={() => setActiveTab('preview')}
                        className={`text-sm cursor-pointer ${activeTab == 'preview' && 'text-sky-500 bg-sky-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Preview</h2>
                </div>
            </div>
            <SandpackProvider files={files} template="react" theme={'dark'} customSetup={{ dependencies: { ...Lookup.DEPENDANCY } }} options={{ externalResources: ['https://cdn.tailwindcss.com'] }}>
                <SandpackLayout>
                    {activeTab == 'code' ? <>
                        <SandpackFileExplorer style={{ height: '70vh' }} />
                        <SandpackCodeEditor style={{ height: '70vh' }} />
                    </> :
                        <>
                            <SandpackPreviewClient />
                        </>}
                </SandpackLayout>
            </SandpackProvider>

            {loading &&
                <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
                    <Loader2Icon className='animate-spin h-10 w-10 text-white' />
                    <h2 className='text-white'>Generating Your Files</h2>
                </div>
            }
        </div>
    )
}

export default CodeView
