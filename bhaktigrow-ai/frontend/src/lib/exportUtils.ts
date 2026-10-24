import { Suggestion } from '../types';

/**
 * Copy text to clipboard with fallback for non-secure contexts
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback using textarea
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Formats a single suggestion as a clean human-readable text document
 */
export function formatSuggestionAsText(suggestion: Suggestion): string {
  const divider = '==================================================';
  return [
    `BHAKTIGROW AI — DEVOTIONAL CONTENT STRATEGY`,
    divider,
    `PLATFORM: ${suggestion.platform.toUpperCase()}`,
    `STRATEGY: ${suggestion.strategyLabel}`,
    `AUDIENCE: ${suggestion.targetAudience}`,
    `FORMAT: ${suggestion.contentFormat}`,
    `EVIDENCE STATUS: ${suggestion.evidenceStatus.toUpperCase()} (Original Editorial Suggestion)`,
    divider,
    '',
    `TITLE / OPENING HOOK:`,
    suggestion.title,
    '',
    `HOOK / FIRST 3 SECONDS:`,
    suggestion.hook,
    '',
    `DESCRIPTION / CAPTION:`,
    suggestion.description,
    '',
    `HASHTAGS:`,
    suggestion.hashtags.join(' '),
    '',
    `SEARCH KEYWORDS:`,
    suggestion.searchKeywords.join(', '),
    '',
    `THUMBNAIL HEADLINE:`,
    suggestion.thumbnailHeadline,
    '',
    `THUMBNAIL CONCEPT:`,
    suggestion.thumbnailIdea,
    '',
    `CALL TO ACTION (CTA):`,
    suggestion.cta,
    '',
    suggestion.pinnedComment ? `PINNED COMMENT:\n${suggestion.pinnedComment}\n` : '',
    suggestion.tags ? `TAGS:\n${suggestion.tags.join(', ')}\n` : '',
    suggestion.reelCoverText ? `REEL COVER TEXT:\n${suggestion.reelCoverText}\n` : '',
    suggestion.onScreenText ? `ON-SCREEN TEXT:\n${suggestion.onScreenText}\n` : '',
    suggestion.subtitleGuidance ? `SUBTITLE GUIDANCE:\n${suggestion.subtitleGuidance}\n` : '',
    suggestion.communityAngle ? `COMMUNITY ANGLE:\n${suggestion.communityAngle}\n` : '',
    `EDITORIAL RATIONALE:`,
    suggestion.editorialRationale,
    divider,
    `Generated via BhaktiGrow AI Platform (Frontend Optimization Suite)`
  ].filter(Boolean).join('\n');
}

/**
 * Export suggestions array as downloadable .txt file
 */
export function exportSuggestionsAsTxt(suggestions: Suggestion[], filename: string = 'bhaktigrow-suggestions.txt'): void {
  const content = suggestions.map(formatSuggestionAsText).join('\n\n\n\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
