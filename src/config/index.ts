import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';
import type { AgentConfig, AgentType } from '../types/agents.js';
import agentsConfig from './agents.json' with { type: 'json' };

interface AgentConfigEntry {
  name: string;
  displayName: string;
  skillsDir: string;
  globalSkillsDir: string;
}

const home = homedir();

export function loadAgentConfig(): Record<AgentType, AgentConfig> {
  const config = {} as Record<AgentType, AgentConfig>;
  const agentsConfigTyped = agentsConfig as Record<string, AgentConfigEntry>;

  for (const [type, agent] of Object.entries(agentsConfigTyped)) {
    const agentType = type as AgentType;

    config[agentType] = {
      name: agent.name,
      displayName: agent.displayName,
      skillsDir: agent.skillsDir,
      globalSkillsDir: agent.globalSkillsDir.replace('~', home),
      detectInstalled: async () => {
        const globalDir = agent.globalSkillsDir.replace('~', home);
        return existsSync(globalDir);
      },
    };
  }

  return config;
}
