import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getCosmosClient } from "../services/cosmos-connection.service";

export async function getTodos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        const cosmosClient = getCosmosClient();
        const database = cosmosClient.database('todos');
        const container = database.container('sample-todos');

        const { resources: todos } = await container.items
        .query(`SELECT * FROM c`)
        .fetchAll();

        return { jsonBody: {message:'todos fetched successfully!', data: todos}, status: 200 };
    } catch (error) {
        context.log(`Error while fetching todos: ${error}`);
        return { jsonBody: { error: 'Eror while fetching todos' }, status: 500 };
    }
};


app.http('getTodos', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getTodos
});
