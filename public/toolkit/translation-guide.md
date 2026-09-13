# Translation guide

English is the cross-country collaboration baseline. Chinese and English have priority maintenance. All seven languages welcome human review.

Edit `locales/{zh,en,es,de,ja,it,fr}/content.json`. Preserve all keys and explanatory intent. Do not copy canonical IDs, statuses, evidence assignments, costs, dates, rankings or citations into independent translated datasets.

`translation.status` starts `community-review-needed`; `reviewedBy` is empty and `lastReviewedDate` is null. Only record an actual consenting reviewer and actual review date. AI generation is not native review. A partial review must not mark the whole catalog reviewed; state its scope in the PR and keep overall status pending until complete.

Check UI in context, including small screens, long words, mathematical meaning, units, uncertainty and the distinction between permanent removal and capture. Translation changes must not silently promote a hypothesis to fact. Report source-language errors as well. Run `npm test` and `npm run build` for key and route integrity.
