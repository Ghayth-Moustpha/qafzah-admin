import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align'; // For alignment
import Typography from '@tiptap/extension-typography'; // Additional typography options
import Toolbar from './Toolbar'; // A custom toolbar component

interface RichTextEditorProps {
  value: string;
  setValue: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, setValue }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Enable alignment for these elements
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        style: 'min-height: 300px; border: 1px solid #ccc; padding: 10px;', // Base styling
      },
    },
    onUpdate: ({ editor }) => {
      // Update parent state on content change
      setValue(editor.getHTML());
    },
  });

  // Update the editor content when `value` changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div>
      {/* Toolbar for user customization */}
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
