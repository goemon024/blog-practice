import { getSwaggerSpec } from '../swagger';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export async function GET() {
    const spec = getSwaggerSpec();
    console.log('Generated spec:', JSON.stringify(spec, null, 2));
    return Response.json(spec);
}