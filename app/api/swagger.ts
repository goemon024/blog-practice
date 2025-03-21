// app/api/swagger.js
import { createSwaggerSpec } from 'next-swagger-doc';

const apiConfig = {
    openapi: '3.0.0',
    info: {
        title: 'Blog API Documentation',
        version: '1.0.0',
        description: 'API documentation for the blog application',
    },
    servers: [
        {
            url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
            description: 'API server',
        },
    ],
};

export const getSwaggerSpec = () => {
    const spec = createSwaggerSpec({
        definition: apiConfig,
        apiFolder: 'app/api',
    });
    return spec;
};
