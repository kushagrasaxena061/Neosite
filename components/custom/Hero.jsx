"use client"

import Lookup from '@/data/Lookup'
import React, { useContext, useState } from 'react'
import { ArrowRight, Link } from 'lucide-react'
import Colors from '@/data/Colors'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext';
import SignInDialog from './SignInDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

function Hero() {
    const [userInput, setUserInput] = useState();
    const { messages, setMessages } = useContext(MessagesContext)
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const [openDialog, setOpenDialog] = useState(false)
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace)
    const router = useRouter()

    const onGenerate = async (input) => {
        if (!userDetail?.name) {
            setOpenDialog(true);
            return;
        }

        const msg = { role: 'user', content: input }

        setMessages(msg)

        const workspaceId = await CreateWorkspace({
            user: userDetail._id, messages: [msg]
        })

        router.push('/workspace/' + workspaceId)
    }

    return (
        <div className='flex flex-col items-center mt-20 gap-2 
       bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400  text-transparent bg-clip-text'>
            <h2 className='font-bold text-4xl'>{Lookup.HERO_HEADING}</h2>
            <p className='text-white/80 font-medium'>{Lookup.HERO_DESC}</p>

            <div className='p-5 border rounded-xl max-w-xl w-full mt-3' style={{ backgroundColor: Colors.BACKGROUND }}>
                <div className='flex gap-2'>
                    <textarea onChange={(event) => setUserInput(event.target.value)} placeholder={Lookup.INPUT_PLACEHOLDER} className='outline-none text-white bg-transparent w-full h-32 max-h-56 resize-none' />
                    {userInput &&
                        <ArrowRight onClick={() => onGenerate(userInput)} className='bg-green-400 text-white tet-bold p-2 h-10 w-10 rounded-md' />
                    }
                </div>
                <div>
                    <Link className='h-5 w-5' />
                </div>
            </div>
            <div className='flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3'>
                {Lookup.SUGGSTIONS.map((suggestion, index) => (
                    <h2 onClick={() => onGenerate(suggestion)} className='p-1 px-2 cursor-pointer border rounded-full text-white/70 hover:text-white font-medium text-sm' key={index}>{suggestion}</h2>
                ))}
            </div>
            <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(false)} />
        </div>
    )
}

export default Hero
