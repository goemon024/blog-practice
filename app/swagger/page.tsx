'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerPage() {
    const [spec, setSpec] = useState<any>(null);

    useEffect(() => {
        const fetchSpec = async () => {
            const response = await fetch('/api/docs');
            const data = await response.json();
            console.log('Fetched spec:', data); // デバッグ用
            setSpec(data);
        };

        fetchSpec();
    }, []);

    if (!spec) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <SwaggerUI spec={spec} />
        </div>
    );
}
