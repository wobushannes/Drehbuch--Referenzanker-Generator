import { PromptTemplate, ReferenceCategory } from '../types';
import {
  INITIAL_PROMPT_CATALOG,
  INITIAL_PROMPT_CATALOG_DE,
  INITIAL_PROMPT_CATALOG_EN,
  getInitialPromptCatalog,
  loadPromptCatalog,
  savePromptCatalog,
  resetPromptCatalog,
} from '../data/prompts';

export const PROMPT_CATALOG: PromptTemplate[] = INITIAL_PROMPT_CATALOG;

export function getPromptForCategory(category: ReferenceCategory, lang: string = 'DE'): string {
  const current = loadPromptCatalog(lang);
  const match = current.find((p) => p.category === category);
  return match ? match.prompt : current[0].prompt;
}

export {
  INITIAL_PROMPT_CATALOG_DE,
  INITIAL_PROMPT_CATALOG_EN,
  getInitialPromptCatalog,
  loadPromptCatalog,
  savePromptCatalog,
  resetPromptCatalog,
};
