#!/usr/bin/env node

/**
 * NexMemory MCP Server
 * Model Context Protocol server for NexMemory knowledge base
 * Bridges stdio-based MCP protocol to REST API calls
 */

import * as http from 'http';
import * as readline from 'readline';

// Types
interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
  };
  id: number | string | null;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: number | string | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
}

interface ToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError: boolean;
}

interface HTTPResponse {
  status: number;
  body: string;
  headers: http.IncomingHttpHeaders;
}

interface HTTPOptions extends http.RequestOptions {
  hostname: string;
  port: string | number;
  path: string;
  method: string;
  headers: Record<string, string>;
  timeout: number;
}

// Configuration
const API_KEY = process.env.NEXMEMORY_API_KEY || '';
const API_BASE_URL = process.env.NEXMEMORY_API_URL || 'http://localhost:3000/api';
const DEBUG = process.env.DEBUG === 'true';

function log(message: string): void {
  if (DEBUG) {
    console.error(`[NexMemory MCP] ${message}`);
  }
}

// MCP tool definitions
const TOOLS: MCPTool[] = [
  {
    name: 'create_entity',
    description: 'Create a new entity in the knowledge base with name, description, tags, and optional properties',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the entity' },
        description: { type: 'string', description: 'A detailed description of the entity' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Array of tag names to categorize the entity' },
        properties: { type: 'object', description: 'Optional custom properties as key-value pairs' },
      },
      required: ['name', 'tags'],
    },
  },
  {
    name: 'get_entity',
    description: 'Retrieve an entity by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The UUID of the entity to retrieve' },
      },
      required: ['id'],
    },
  },
  {
    name: 'update_entity',
    description: "Update an existing entity's name, description, tags, or properties",
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The UUID of the entity to update' },
        name: { type: 'string', description: 'The updated name of the entity' },
        description: { type: 'string', description: 'The updated description of the entity' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Updated array of tag names' },
        properties: { type: 'object', description: 'Updated custom properties' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_entity',
    description: 'Delete an entity from the knowledge base',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The UUID of the entity to delete' },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_entities',
    description: 'List entities with optional filtering by tags, pagination support',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'integer', description: 'Maximum number of entities to return (default: 50)', default: 50 },
        offset: { type: 'integer', description: 'Number of entities to skip (default: 0)', default: 0 },
        tags: { type: 'array', items: { type: 'string' }, description: 'Filter entities by tags (all tags must match)' },
      },
    },
  },
  {
    name: 'search_entities',
    description: 'Perform semantic search on the knowledge base using natural language query',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language search query' },
        limit: { type: 'integer', description: 'Maximum number of results to return (default: 10)', default: 10 },
      },
      required: ['query'],
    },
  },
];

// Helper to make HTTP request
function makeRequest(options: HTTPOptions, body?: string): Promise<HTTPResponse> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk.toString();
      });
      res.on('end', () => {
        resolve({ status: res.statusCode ?? 500, body: data, headers: res.headers });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

// Map MCP tool call to REST API call
async function callTool(toolName: string, arguments_: Record<string, unknown>): Promise<ToolResult> {
  const url = new URL(API_BASE_URL);
  const hostname = url.hostname;
  const port = url.port || (url.protocol === 'https:' ? 443 : 3000);
  const basePath = url.pathname;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
    'X-API-Key': API_KEY,
  };

  try {
    switch (toolName) {
      case 'create_entity': {
        const createPath = `${basePath}/entities`;
        const createOptions: HTTPOptions = {
          hostname,
          port,
          path: createPath,
          method: 'POST',
          headers,
          timeout: 30000,
        };
        const response = await makeRequest(createOptions, JSON.stringify(arguments_));
        if (response.status === 201) {
          const entity = JSON.parse(response.body);
          return {
            content: [
              {
                type: 'text',
                text: `Entity created successfully:\n${JSON.stringify(entity, null, 2)}`,
              },
            ],
            isError: false,
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.body}`);
        }
      }

      case 'get_entity': {
        const id = arguments_.id;
        if (!id || typeof id !== 'string') {
          throw new Error('id is required');
        }
        const getPath = `${basePath}/entities/${id}`;
        const getOptions: HTTPOptions = {
          hostname,
          port,
          path: getPath,
          method: 'GET',
          headers,
          timeout: 30000,
        };
        const response = await makeRequest(getOptions);
        if (response.status === 200) {
          const entity = JSON.parse(response.body);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(entity, null, 2),
              },
            ],
            isError: false,
          };
        } else if (response.status === 404) {
          throw new Error(`Entity not found: ${id}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.body}`);
        }
      }

      case 'update_entity': {
        const updateId = arguments_.id;
        if (!updateId || typeof updateId !== 'string') {
          throw new Error('id is required');
        }
        const { id: _, ...updateData } = arguments_;
        const updatePath = `${basePath}/entities/${updateId}`;
        const updateOptions: HTTPOptions = {
          hostname,
          port,
          path: updatePath,
          method: 'PUT',
          headers,
          timeout: 30000,
        };
        const response = await makeRequest(updateOptions, JSON.stringify(updateData));
        if (response.status === 200) {
          const entity = JSON.parse(response.body);
          return {
            content: [
              {
                type: 'text',
                text: `Entity updated successfully:\n${JSON.stringify(entity, null, 2)}`,
              },
            ],
            isError: false,
          };
        } else if (response.status === 404) {
          throw new Error(`Entity not found: ${updateId}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.body}`);
        }
      }

      case 'delete_entity': {
        const deleteId = arguments_.id;
        if (!deleteId || typeof deleteId !== 'string') {
          throw new Error('id is required');
        }
        const deletePath = `${basePath}/entities/${deleteId}`;
        const deleteOptions: HTTPOptions = {
          hostname,
          port,
          path: deletePath,
          method: 'DELETE',
          headers,
          timeout: 30000,
        };
        const response = await makeRequest(deleteOptions);
        if (response.status === 204 || response.status === 200) {
          return {
            content: [
              {
                type: 'text',
                text: `Entity ${deleteId} deleted successfully`,
              },
            ],
            isError: false,
          };
        } else if (response.status === 404) {
          throw new Error(`Entity not found: ${deleteId}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.body}`);
        }
      }

      case 'list_entities': {
        const limit = (arguments_.limit as number) || 50;
        const offset = (arguments_.offset as number) || 0;
        const tags = (arguments_.tags as string[]) || [];
        const params = new URLSearchParams();
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());
        if (tags.length > 0) {
          params.append('tags', tags.join(','));
        }
        const listPath = `${basePath}/entities?${params.toString()}`;
        const listOptions: HTTPOptions = {
          hostname,
          port,
          path: listPath,
          method: 'GET',
          headers,
          timeout: 30000,
        };
        const response = await makeRequest(listOptions);
        if (response.status === 200) {
          const entities = JSON.parse(response.body);
          return {
            content: [
              {
                type: 'text',
                text: `Found ${entities.length} entities:\n${JSON.stringify(entities, null, 2)}`,
              },
            ],
            isError: false,
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.body}`);
        }
      }

      case 'search_entities': {
        const query = arguments_.query;
        if (!query || typeof query !== 'string') {
          throw new Error('query is required');
        }
        const limit = (arguments_.limit as number) || 10;
        const searchPath = `${basePath}/memory/search`;
        const searchOptions: HTTPOptions = {
          hostname,
          port,
          path: searchPath,
          method: 'POST',
          headers,
          timeout: 30000,
        };
        const response = await makeRequest(searchOptions, JSON.stringify({ query, limit }));
        if (response.status === 200) {
          const result = JSON.parse(response.body);
          return {
            content: [
              {
                type: 'text',
                text: `Found ${result.count} results:\n${JSON.stringify(result.results, null, 2)}`,
              },
            ],
            isError: false,
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.body}`);
        }
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: errorMessage,
        },
      ],
      isError: true,
    };
  }
}

// Handle MCP protocol requests
async function handleRequest(request: MCPRequest): Promise<MCPResponse> {
  const { jsonrpc, method, params, id } = request;

  if (jsonrpc !== '2.0') {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32600,
        message: 'Invalid JSON-RPC version',
      },
    };
  }

  try {
    switch (method) {
      case 'initialize': {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {
                listChanged: true,
              },
              resources: {
                subscribe: false,
                listChanged: false,
              },
            },
            serverInfo: {
              name: 'nexmemory-mcp',
              version: '1.0.0',
            },
          },
        };
      }

      case 'tools/list': {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: TOOLS,
          },
        };
      }

      case 'tools/call': {
        const { name, arguments: args } = params || {};
        if (!name) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: 'Tool name is required',
            },
          };
        }

        const result = await callTool(name, (args as Record<string, unknown>) || {});
        return {
          jsonrpc: '2.0',
          id,
          result,
        };
      }

      case 'ping': {
        return {
          jsonrpc: '2.0',
          id,
          result: {},
        };
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Unknown method: ${method}`,
          },
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: errorMessage,
      },
    };
  }
}

// Main readline handler
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (line: string) => {
  // Skip empty lines
  if (!line || line.trim() === '') {
    return;
  }

  try {
    const request = JSON.parse(line) as MCPRequest;
    log(`Received request: ${JSON.stringify(request)}`);

    // Skip notifications (requests without ID)
    if (request.id === undefined && request.id !== null) {
      log('Skipping notification (no ID)');
      return;
    }

    const response = await handleRequest(request);
    log(`Sending response: ${JSON.stringify(response).substring(0, 200)}`);
    process.stdout.write(JSON.stringify(response) + '\n');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Parse error: ${errorMessage}`);
    const errorResponse: MCPResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: `Parse error: ${errorMessage}`,
      },
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down');
  process.exit(0);
});

