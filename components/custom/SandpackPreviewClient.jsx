import React, { useContext, useEffect, useRef } from 'react'

import { SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { ActionContext } from '@/context/ActionContext';

function SandpackPreviewClient() {
    const previewRef = useRef();
    const { sandpack } = useSandpack()
    const { action, setAction } = useContext(ActionContext)

    useEffect(() => {
        GetSandpackClient()
    }, [sandpack && action]);

    const GetSandpackClient = async () => {
        const client = previewRef.current?.getClient()
        if (client) {
            const result = await client.getCodeSandboxURL()
            if (action?.actionType == 'export') {
                window?.open(result?.editorUrl)
                alert(result?.editorUrl)
                alert(result?.sandboxId)
            } else if (action?.actionType == 'deploy') {
                const url = `https://${result?.sandboxId}.csb.app/`;
                window.open(url)
            }
        }
    }

    return (
        <SandpackPreview ref={previewRef} style={{ height: '70vh' }} />

    )
}

export default SandpackPreviewClient
