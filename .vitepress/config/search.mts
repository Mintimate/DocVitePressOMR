export const search = {
    provider: 'local',
    options: {
      miniSearch: {
        options: {
          tokenize: (term: string) => {
            if (typeof term === 'string') term = term.toLowerCase();
            // @ts-ignore
            const segmenter = Intl.Segmenter && new Intl.Segmenter("zh", { granularity: "word" });
            if (!segmenter) return [term];
            const tokens = [];
            for (const seg of segmenter.segment(term)) {
              // @ts-ignore
              tokens.push(seg.segment);
            }
            return tokens;
          },
        },
        searchOptions: {
          combineWith: 'AND', // important for search chinese
          processTerm: (term: string) => {
            if (typeof term === 'string') term = term.toLowerCase();
            // @ts-ignore
            const segmenter = Intl.Segmenter && new Intl.Segmenter("zh", { granularity: "word" });
            if (!segmenter) return term;
            const tokens = [];
            for (const seg of segmenter.segment(term)) {
              // @ts-ignore
              tokens.push(seg.segment);
            }
            return tokens;
          },
        },
      },
    },
}
