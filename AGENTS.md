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
- Use one root-level Lenis instance for site-wide smooth scrolling; this keeps scroll-linked sections synchronized and avoids competing controllers.
- Use the paired dhunuchi-dancer artwork for repeating section borders and tie its left-to-right motion to page scroll; this keeps decorative separators consistent and interactive.
- Keep the route-transition cover mounted until above-the-fold images and fonts are decoded; this prevents unfinished pages appearing after the wipe.
- Lock the document from intro loading through curtain dismissal and use a small-viewport-height mobile overlay; this prevents touch scrolling and browser-bar control jumps.
- Keep scroll-reactive festival decoration in `festival-art.tsx`; this centralizes motion cleanup and reduced-motion handling.
- Use the supplied DomeGallery for all gallery photos and a curated subset in the home accordion, both from the shared gallery catalogue; this preserves both experiences without overcrowding the home page.
- Coordinate dome idle rotation through its existing rotation refs, pausing for drag, inertia, enlarged photos, hidden tabs and reduced motion; this prevents competing movement controllers.
- Keep closed dome touch gestures horizontal with native vertical scrolling and no document lock; this prevents canceled swipes from trapping the page.
- Open phone gallery photos in a portal dialog with react-zoom-pan-pinch; this isolates pinch/pan and releases the dialog's scroll lock on dismissal.

- Donations are submitted through the submitDonation server function (Zod-validated, admin client) into the public.donations table and stored as PENDING_VERIFICATION; there is deliberately no public read path and no payment-success claim in the UI. Why: the committee verifies UPI payments manually and donor data must not be publicly readable.
