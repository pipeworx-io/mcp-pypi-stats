# @pipeworx/pypi-stats

[PyPIStats.org](https://pypistats.org) MCP — PyPI download statistics over the last 180 days. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `recent(package, period?)` — total downloads in recent period (day | week | month)
- `overall(package, mirrors?)` — daily downloads timeseries
- `python_major(package)` — by Python major version
- `python_minor(package)` — by Python minor version
- `system(package)` — by OS / system

## Data source

`https://pypistats.org/api/packages/<name>/...`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "pypi-stats": {
      "url": "https://gateway.pipeworx.io/pypi-stats/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Pypi Stats data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
