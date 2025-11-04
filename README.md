# NexMemory MCP Server

<div align="center">

**Model Context Protocol server for NexMemory**
*A knowledge base and entity management system*

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/nexmemory-mcp)
[![Node.js](https://img.shields.io/badge/Node.js-≥14.0.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Installation](#installation) • [Configuration](#configuration) • [Usage](#usage) • [Features](#features)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Cursor IDE](#cursor-ide)
  - [Claude Desktop](#claude-desktop)
  - [Windsurf](#windsurf)
  - [Visual Studio Code (VS Code)](#visual-studio-code-vs-code)
  - [GitHub Copilot](#github-copilot)
  - [Zed](#zed)
  - [Continue.dev](#continuedev)
  - [Cline](#cline)
  - [Roo Code](#roo-code)
  - [Zencoder](#zencoder)
  - [Sourcegraph Amp](#sourcegraph-amp)
- [Environment Variables](#environment-variables)
- [Available Tools](#available-tools)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Overview

NexMemory MCP Server is a Model Context Protocol (MCP) server that provides seamless integration between NexMemory knowledge base and AI-powered development environments. It enables AI assistants to create, manage, search, and interact with entities in your knowledge base directly from your favorite code editor.

---

## ✨ Features

- 🚀 **Zero-configuration deployment** via `npx`
- 🔌 **Universal compatibility** with all major MCP clients
- 📝 **Full CRUD operations** for entities
- 🔍 **Semantic search** capabilities
- 🏷️ **Tag-based filtering** and organization
- ⚡ **Real-time integration** with AI assistants
- 🔐 **Secure API key authentication**
- 📊 **Comprehensive entity management**

---

## 📦 Installation

### Quick Start (Recommended)

Run directly without installation:

```bash
npx nexmemory-mcp
```

### Global Installation

```bash
npm install -g nexmemory-mcp
```

Then run:

```bash
nexmemory-mcp
```

---

## ⚙️ Configuration

### Environment Variables

Before configuring your MCP client, set up the following environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXMEMORY_API_KEY` | ✅ Yes | - | Your NexMemory API key |
| `NEXMEMORY_API_URL` | ❌ No | `http://localhost:3000/api` | API base URL |
| `DEBUG` | ❌ No | `false` | Enable debug logging (`true`/`false`) |

---

## 🔧 MCP Client Configurations

### Cursor IDE

Cursor is an AI-powered code editor with built-in MCP support.

#### Configuration Steps

1. **Locate configuration file:**
   - **Project-specific**: `.cursor/mcp.json` in your project root
   - **Global**: `~/.cursor/mcp.json`

2. **Add configuration:**

```json
{
  "mcpServers": {
    "nexmemory": {
      "command": "npx",
      "args": [
        "-y",
        "nexmemory-mcp"
      ],
      "env": {
        "NEXMEMORY_API_KEY": "your-api-key-here",
        "NEXMEMORY_API_URL": "http://localhost:3000/api",
        "DEBUG": "false"
      }
    }
  }
}
```

3. **Restart Cursor** to apply changes.

---

### Claude Desktop

Claude Desktop provides comprehensive MCP support with deep integration capabilities.

#### Configuration Steps

1. **Locate configuration file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add configuration:**

```json
{
  "mcpServers": {
    "nexmemory": {
      "command": "npx",
      "args": [
        "-y",
        "nexmemory-mcp"
      ],
      "env": {
        "NEXMEMORY_API_KEY": "your-api-key-here",
        "NEXMEMORY_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

3. **Restart Claude Desktop** to load the new configuration.

---

### Windsurf

Windsurf is an AI-native IDE with built-in MCP support and AI Flow system.

#### Configuration Steps

1. **Locate configuration file:**
   - `~/.codeium/windsurf/mcp_config.json`

2. **Add configuration:**

```json
{
  "mcpServers": {
    "nexmemory": {
      "command": "npx",
      "args": [
        "-y",
        "nexmemory-mcp"
      ],
      "env": {
        "NEXMEMORY_API_KEY": "your-api-key-here",
        "NEXMEMORY_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

3. **Restart Windsurf** to apply changes.

---

### Visual Studio Code (VS Code)

VS Code supports MCP through various extensions. Choose the one that best fits your workflow.

#### Option 1: Using VSCode MCP Bridge Extension

1. **Install extension:**
   - Search for "VSCode MCP Bridge" in VS Code Extensions marketplace
   - Install the extension by YuTengjing

2. **Configure MCP server:**
   - Create `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "nexmemory": {
      "command": "npx",
      "args": ["-y", "nexmemory-mcp"],
      "env": {
        "NEXMEMORY_API_KEY": "your-api-key-here",
        "NEXMEMORY_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

3. **Enable Agent Mode:**
   - Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Select `MCP: Add Server`
   - Choose `nexmemory` from the list

#### Option 2: Using GitHub Copilot with MCP

1. **Install Copilot MCP Search extension:**
   - Search for "Copilot MCP Search" in VS Code Extensions
   - Install the extension

2. **Configure via extension settings:**
   - Add `nexmemory-mcp` as a new MCP server
   - Configure environment variables in extension settings

---

### GitHub Copilot

GitHub Copilot integrates with MCP servers to enhance code suggestions.

#### Configuration Steps

1. **Install Copilot MCP Search extension:**
   ```bash
   # Via VS Code Extensions marketplace
   # Search: "Copilot MCP Search"
   ```

2. **Configure MCP server:**
   - Open extension settings
   - Add `nexmemory-mcp` as a new server
   - Set environment variables:
     - `NEXMEMORY_API_KEY`
     - `NEXMEMORY_API_URL`

3. **Restart VS Code** to apply changes.

---

### Zed

Zed is a high-performance code editor with built-in MCP support.

#### Configuration Steps

1. **Open settings:**
   - Press `cmd+,` (macOS) or `Ctrl+,` (Windows/Linux)
   - Or use Command Palette: `zed: open settings`

2. **Add configuration:**

```json
{
  "mcpServers": {
    "nexmemory": {
      "command": "npx",
      "args": ["-y", "nexmemory-mcp"],
      "env": {
        "NEXMEMORY_API_KEY": "your-api-key-here",
        "NEXMEMORY_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

3. **Restart Zed** to apply changes.

---

### Continue.dev

Continue is an open-source autopilot for VS Code and JetBrains IDEs.

#### Configuration Steps

1. **Install Continue extension:**
   - VS Code: Search "Continue" in Extensions
   - JetBrains: Install from JetBrains Marketplace

2. **Configure MCP server:**
   - Open Continue settings
   - Navigate to MCP servers section
   - Add configuration:

```json
{
  "mcpServers": {
    "nexmemory": {
      "command": "npx",
      "args": ["-y", "nexmemory-mcp"],
      "env": {
        "NEXMEMORY_API_KEY": "your-api-key-here",
        "NEXMEMORY_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

3. **Restart your IDE** to apply changes.

---

### Cline

Cline is a VS Code extension that integrates AI models with MCP support.

#### Configuration Steps

1. **Install Cline extension:**
   - Search "Cline" in VS Code Extensions marketplace
   - Install the extension

2. **Configure MCP server:**
   - Create `.cline/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "nexmemory": {
      "command": "npx",
      "args": ["-y", "nexmemory-mcp"],
      "env": {
        "NEXMEMORY_API_KEY": "your-api-key-here",
        "NEXMEMORY_API_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

3. **Restart VS Code** to apply changes.

---

### Roo Code

Roo Code is a VS Code extension for AI-powered code assistance.

#### Configuration Steps

1. **Install Roo Code extension:**
   - Search "Roo Code" in VS Code Extensions marketplace

2. **Configure MCP server:**
   - Open Roo Code settings
   - Add MCP server configuration with environment variables
   - Use the same configuration format as Cline

---

### Zencoder

Zencoder is a coding agent available for VS Code and JetBrains IDEs.

#### Configuration Steps

1. **Install Zencoder:**
   - VS Code: Search "Zencoder" in Extensions
   - JetBrains: Install from JetBrains Marketplace

2. **Configure MCP server:**
   - Open Zencoder settings
   - Navigate to MCP configuration
   - Add `nexmemory-mcp` with environment variables

---

### Sourcegraph Amp

Sourcegraph Amp supports MCP across VS Code, Cursor, and Windsurf.

#### Configuration Steps

1. **Install Sourcegraph Amp:**
   - Install the appropriate extension for your editor

2. **Configure MCP server:**
   - Open Sourcegraph settings
   - Add MCP server configuration
   - Set environment variables for NexMemory API

---

## 🔑 Environment Variables

Configure these environment variables in your MCP client configuration:

```bash
# Required
NEXMEMORY_API_KEY=your-api-key-here

# Optional (with defaults)
NEXMEMORY_API_URL=http://localhost:3000/api
DEBUG=false
```

---

## 🛠️ Available Tools

The NexMemory MCP server provides the following tools:

### `create_entity`
Create a new entity in the knowledge base.

**Parameters:**
- `name` (required): Entity name
- `description` (optional): Detailed description
- `tags` (required): Array of tag names
- `properties` (optional): Custom key-value pairs

### `get_entity`
Retrieve an entity by its ID.

**Parameters:**
- `id` (required): UUID of the entity

### `update_entity`
Update an existing entity.

**Parameters:**
- `id` (required): UUID of the entity
- `name` (optional): Updated name
- `description` (optional): Updated description
- `tags` (optional): Updated tags array
- `properties` (optional): Updated properties object

### `delete_entity`
Delete an entity from the knowledge base.

**Parameters:**
- `id` (required): UUID of the entity

### `list_entities`
List entities with optional filtering and pagination.

**Parameters:**
- `limit` (optional, default: 50): Maximum number of entities
- `offset` (optional, default: 0): Number of entities to skip
- `tags` (optional): Filter by tags (all must match)

### `search_entities`
Perform semantic search on the knowledge base.

**Parameters:**
- `query` (required): Natural language search query
- `limit` (optional, default: 10): Maximum number of results

---

## 💡 Usage Examples

### Example 1: Create an Entity

```json
{
  "name": "Project Alpha",
  "description": "A revolutionary AI-powered project management system",
  "tags": ["project", "ai", "management"],
  "properties": {
    "status": "active",
    "priority": "high"
  }
}
```

### Example 2: Search Entities

```json
{
  "query": "Find all active projects related to AI",
  "limit": 20
}
```

### Example 3: Update Entity Tags

```json
{
  "id": "entity-uuid-here",
  "tags": ["project", "ai", "management", "active"]
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Server Not Starting
- **Issue**: MCP server fails to start
- **Solution**:
  - Verify Node.js version: `node --version` (requires ≥14.0.0)
  - Check API key is set correctly
  - Verify NexMemory API server is running

#### Connection Errors
- **Issue**: Cannot connect to NexMemory API
- **Solution**:
  - Verify `NEXMEMORY_API_URL` is correct
  - Check API server is accessible
  - Ensure API key is valid

#### Tools Not Appearing
- **Issue**: Tools don't show up in client
- **Solution**:
  - Restart your MCP client application
  - Check configuration file syntax (valid JSON)
  - Enable debug mode: `DEBUG=true` to see logs

### Debug Mode

Enable debug logging to troubleshoot issues:

```json
{
  "env": {
    "DEBUG": "true"
  }
}
```

Debug logs will appear in your terminal/console.

---

## 📚 Additional Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [NexMemory Documentation](https://github.com/yourusername/nexmemory)
- [MCP Client Compatibility](https://docs.stacklok.com/toolhive/reference/client-compatibility)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ for the AI development community**

[Report Issue](https://github.com/yourusername/nexmemory-mcp/issues) • [Request Feature](https://github.com/yourusername/nexmemory-mcp/issues) • [Contribute](https://github.com/yourusername/nexmemory-mcp/pulls)

</div>
