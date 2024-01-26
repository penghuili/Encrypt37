import styled from 'styled-components';
import { apps } from '../../shared/js/apps';
import { getColor } from '../../shared/react-pure/color';

const TextEditorWrapper = styled.div`
  position: relative;
  width: 100%;

  .ProseMirror {
    padding: ${({ editable }) => (editable ? '8px 16px' : '0')};
    border: ${({ editable }) => (editable ? `1px solid ${getColor('light-4')}` : '0')};
    min-height: ${({ editable }) => (editable ? '10rem' : '0')};
    max-width: ${({ maxWidth }) => maxWidth};

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 0 0 2rem;
      margin: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1;
      margin-top: 0;
      font-size: 1.4rem;
    }

    p {
      margin: 0 0 8px;
      &:last-of-type {
        margin: 0;
      }
    }

    a {
      color: ${apps.Encrypt37.color};
    }

    code {
      background-color: rgba(97, 97, 97, 0.1);
      color: rgba(97, 97, 97);
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      width: 100%;
      overflow-x: auto;
      white-space: pre;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid ${getColor('light-4')};
    }

    hr {
      margin: 2rem 0;
      height: 0;
      color: transparent;
      background-color: ${getColor('light-4')};
    }

    & > ul,
    ol {
      margin: 0.5rem 0;
    }

    ul,
    ol {
      li {
        p {
          margin: 0;
        }
      }
    }

    ul[data-type='taskList'] {
      list-style: none;
      padding: 0;

      li {
        display: flex;

        p {
          margin: 0;
        }

        > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }

        > div {
          flex: 1 1 auto;
        }
      }
    }
  }
`;

export default TextEditorWrapper;
