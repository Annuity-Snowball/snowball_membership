import swaggerJsDoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'snowball membership server',
            version: '1.0.0',
            description: 'snowball membership server api documents with swagger',
        },
        servers: [
            {
                url: 'http://localhost:10000',
            },
            ],
        },
    apis: ['./src/controller/*.ts'],
};

export const swaggerSpec = swaggerJsDoc(options);