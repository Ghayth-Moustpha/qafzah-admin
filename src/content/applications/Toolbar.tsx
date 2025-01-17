import React from 'react';
import { Editor } from '@tiptap/react';
import { Button, Box } from '@mui/material';

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <Box display="flex" gap={1} mb={2}>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        Align Left
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        Align Center
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        Align Right
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        Justify
      </Button>
    </Box>
  );
};

export default Toolbar;
