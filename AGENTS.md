<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep editable public-facing copy in `src/lib/site-content.ts`; this prevents factual placeholders from being scattered through presentation code.
- Build shared festival navigation and footer through `PageShell`; this keeps all public pages visually continuous.
- Drive the home Durga Puja schedule horizontally from native vertical page scroll; this makes the six-day programme browsable without a separate gesture.
