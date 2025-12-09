import type { TokensResult } from 'shiki'
import type { PropType } from 'vue'
import { getTokenStyleObject } from 'shiki'
import { defineComponent, h, renderList } from 'vue'

export default defineComponent({
  name: 'ShikiTokensRenderer',
  props: {
    tokens: {
      type: Object as PropType<TokensResult>,
      required: true,
    },
  },
  setup(props) {
    return () => h(
      'pre',
      {
        'class': [
          'shiki',
          props.tokens.themeName,
        ],
        'data-language': props.tokens.grammarState?.lang,
        'style': {
          counterReset: 'line',
        },
      },
      h(
        'code',
        renderList(
          props.tokens.tokens,
          (line, index) => h(
            'div',
            {
              'data-stream-markdown': 'code-line',
              'key': index,
            },
            renderList(line, (token, tokenIndex) => h(
              'span',
              {
                key: tokenIndex,
                style: token.htmlStyle || getTokenStyleObject(token),
              },
              token.content,
            )),
          ),
        ),
      ),
    )
  },
})
