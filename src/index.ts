interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * PyPI Stats MCP.
 */


const BASE = 'https://pypistats.org/api/packages';
const UA = 'pipeworx-mcp-pypi-stats/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'recent', description: 'Total downloads in recent period.', inputSchema: { type: 'object', properties: { package: { type: 'string' }, period: { type: 'string', description: 'day | week | month' } }, required: ['package'] } },
  { name: 'overall', description: 'Daily downloads timeseries.', inputSchema: { type: 'object', properties: { package: { type: 'string' }, mirrors: { type: 'boolean' } }, required: ['package'] } },
  { name: 'python_major', description: 'By Python major version.', inputSchema: { type: 'object', properties: { package: { type: 'string' } }, required: ['package'] } },
  { name: 'python_minor', description: 'By Python minor version.', inputSchema: { type: 'object', properties: { package: { type: 'string' } }, required: ['package'] } },
  { name: 'system', description: 'By OS/system.', inputSchema: { type: 'object', properties: { package: { type: 'string' } }, required: ['package'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const pkg = encodeURIComponent(reqStr(args, 'package', '"requests"').toLowerCase());
  switch (name) {
    case 'recent': {
      const p = (args.period as string | undefined) ?? 'all';
      const valid = ['day', 'week', 'month', 'all'];
      if (!valid.includes(p)) throw new Error(`period must be one of: ${valid.join(', ')}`);
      return ppGet(`/${pkg}/recent?period=${p}`);
    }
    case 'overall': {
      const params = new URLSearchParams();
      if (args.mirrors != null) params.set('mirrors', args.mirrors ? 'true' : 'false');
      const qs = params.toString();
      return ppGet(`/${pkg}/overall${qs ? `?${qs}` : ''}`);
    }
    case 'python_major':
      return ppGet(`/${pkg}/python_major`);
    case 'python_minor':
      return ppGet(`/${pkg}/python_minor`);
    case 'system':
      return ppGet(`/${pkg}/system`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function ppGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('PyPI Stats: not found');
  if (!res.ok) throw new Error(`PyPI Stats: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
