import MarkdownIt from 'markdown-it'

/**
 * Markdown 渲染 composable
 * 封装 markdown-it 的初始化和文本转 HTML 逻辑
 */
export function useMarkdown() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  })

  /**
   * 将 Markdown 文本转换为 HTML
   * @param {string} text - Markdown 文本
   * @returns {string} HTML 字符串
   */
  const convertToHtml = (text) => {
    return md.render(text)
  }

  return {
    convertToHtml
  }
}
