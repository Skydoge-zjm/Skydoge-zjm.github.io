import katex from 'katex';

const classTokens = (node) => {
  const value = node?.properties?.className;
  return Array.isArray(value) ? value : String(value ?? '').split(/\s+/).filter(Boolean);
};

const textNode = (value) => ({ type: 'text', value });

const alertLabels = {
  note: '说明',
  tip: '提示',
  important: '重要',
  warning: '注意',
  caution: '警告',
  danger: '危险',
  success: '完成',
};

export const imageDimensionsPlugin = {
  name: 'blog-image-dimensions',
  paragraph(node, ctx) {
    if (node.children.length !== 2) return;
    const [image, tail] = node.children;
    if (image.type !== 'image' || tail.type !== 'text') return;
    const dimensions = tail.value.match(/^\s*\{\s*width=(\d+)\s+height=(\d+)\s*\}\s*$/);
    if (!dimensions) return;

    ctx.setProperty(image, 'data', {
      ...(image.data ?? {}),
      hProperties: {
        ...(image.data?.hProperties ?? {}),
        width: Number(dimensions[1]),
        height: Number(dimensions[2]),
      },
    });
    ctx.removeNode(tail);
  },
};

export const calloutPlugin = {
  name: 'blog-callouts',
  containerDirective(node, ctx) {
    const kind = Object.hasOwn(alertLabels, node.name) ? node.name : 'note';
    const labelNode = node.children.find((child) => child.data?.directiveLabel);

    if (labelNode) {
      ctx.setProperty(labelNode, 'data', {
        ...(labelNode.data ?? {}),
        hProperties: { className: ['callout-title'] },
      });
    } else {
      ctx.prependChild(node, {
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [textNode(alertLabels[kind])],
      });
    }

    ctx.setProperty(node, 'data', {
      ...(node.data ?? {}),
      hName: 'aside',
      hProperties: {
        className: ['callout', `callout--${kind}`],
        role: 'note',
        'aria-label': alertLabels[kind],
      },
    });
  },
};

const safeKatex = (source, displayMode, ctx, node) => {
  try {
    return {
      type: 'raw',
      value: katex.renderToString(source, {
        displayMode,
        output: 'htmlAndMathml',
        throwOnError: false,
        strict: 'warn',
        trust: false,
        maxExpand: 1000,
      }),
    };
  } catch (error) {
    ctx.report({
      node,
      severity: 'warning',
      message: `KaTeX render failed: ${error instanceof Error ? error.message : String(error)}`,
    });
    const escaped = source.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
    return {
      type: 'raw',
      value: `<code class="math-error" role="note">公式渲染失败：${escaped}</code>`,
    };
  }
};

const imagePropsWithDefaults = (image, ctx) => {
  const properties = { ...(image.properties ?? {}) };
  if (!Object.hasOwn(properties, 'alt')) {
    ctx.report({
      node: image,
      severity: 'warning',
      message: 'Markdown image is missing alt text. Add a concise description, or use alt="" for a decorative image.',
    });
    properties.alt = '';
  }
  if (!properties.width || !properties.height) {
    ctx.report({
      node: image,
      severity: 'warning',
      message: 'Add intrinsic image dimensions with {width=1200 height=800} to avoid layout shift.',
    });
  }
  properties.loading ??= 'lazy';
  properties.decoding ??= 'async';
  return properties;
};

const cloneImage = (image, ctx) => {
  const properties = imagePropsWithDefaults(image, ctx);
  const caption = typeof properties.title === 'string' ? properties.title.trim() : '';
  const alt = typeof properties.alt === 'string' ? properties.alt : '';
  delete properties.title;

  const clone = {
    type: 'element',
    tagName: 'img',
    properties,
    children: [],
  };

  return {
    button: {
      type: 'element',
      tagName: 'button',
      properties: {
        type: 'button',
        className: ['post-image-trigger'],
        'data-lightbox-trigger': 'true',
        'aria-label': alt ? `放大查看：${alt}` : '放大查看图片',
      },
      children: [clone],
    },
    caption,
  };
};

export const contentHastPlugin = {
  name: 'blog-content-enhancements',
  element: [
    {
      filter: ['pre'],
      visit(node, ctx) {
        const code = node.children?.find(
          (child) => child.type === 'element' && child.tagName === 'code',
        );
        if (!code || !classTokens(code).includes('math-display')) return;
        return safeKatex(ctx.textContent(code).trim(), true, ctx, node);
      },
    },
    {
      filter: ['code'],
      visit(node, ctx) {
        if (!classTokens(node).includes('math-inline')) return;
        return safeKatex(ctx.textContent(node), false, ctx, node);
      },
    },
    {
      filter: ['p'],
      visit(node, ctx) {
        const children = node.children ?? [];
        if (
          children.length !== 1 ||
          children[0].type !== 'element' ||
          children[0].tagName !== 'img'
        ) return;

        const { button, caption } = cloneImage(children[0], ctx);
        const figureChildren = [button];
        if (caption) {
          figureChildren.push({
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [textNode(caption)],
          });
        }
        return {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['post-figure'] },
          children: figureChildren,
        };
      },
    },
    {
      filter: ['table'],
      visit(node) {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['markdown-table-wrap'], role: 'region', 'aria-label': '可横向滚动的数据表格', tabindex: '0' },
          children: [JSON.parse(JSON.stringify(node))],
        };
      },
    },
    {
      filter: ['img'],
      visit(node, ctx) {
        const properties = imagePropsWithDefaults(node, ctx);
        for (const key of ['alt', 'loading', 'decoding']) {
          if (node.properties?.[key] !== properties[key]) {
            ctx.setProperty(node, key, properties[key]);
          }
        }
      },
    },
  ],
};
