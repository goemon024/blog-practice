import { getSwaggerSpec } from '../swagger';

export async function GET() {
    const spec = getSwaggerSpec();
    console.log('Generated spec:', JSON.stringify(spec, null, 2));
    return Response.json(spec);
}