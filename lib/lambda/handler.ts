import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  return {
    body: `Hello from a Lambda Function. My backend url is ${process.env.BACKEND_URL ?? 'unknown'}. This is a change.`,
    statusCode: 200,
  };
}