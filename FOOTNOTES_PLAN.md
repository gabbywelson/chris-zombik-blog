# Footnotes: First-Class Payload CMS Implementation Plan

## Goal
Make post footnotes a first-class authoring and rendering experience, while avoiding regressions in already-published content.

## What changed in this PR
1. **Replaced custom insertion modal workflow with Payload inline blocks** for new footnotes.
2. **Added a dedicated `footnoteReference` inline block** with a rich-text `content` field (supports bold, italics, underline, links, etc.).
3. **Updated frontend rendering** so:
   - inline references are rendered as numbered superscripts,
   - footnotes are listed at the end of the article,
   - footnote body content can render rich text formatting.
4. **Kept legacy custom `footnote` node support** so existing posts continue rendering and can still be loaded in the editor.
5. **Removed the old modal-heavy authoring UX** from the legacy feature client to avoid future use of the hacky flow.

## Authoring workflow (new)
1. In post content, insert an **inline block** and choose **Footnote Reference**.
2. Enter formatted footnote content in the block drawer rich text field.
3. Save post.
4. Frontend automatically numbers references in reading order and renders a bottom footnotes section.

## Legacy compatibility
- Existing content with legacy `footnote` nodes is still recognized and rendered.
- New content should use `footnoteReference` inline blocks only.

## Follow-up work (recommended)
1. Add a one-time migration script to convert legacy `footnote` nodes into `footnoteReference` inline blocks in all posts.
2. Once migration is verified, remove legacy node code entirely.
3. Add e2e tests for:
   - adding/removing inline footnotes,
   - formatting inside footnote content,
   - rendering and back-reference links.
