import React, { Suspense, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import axios from '../../config/axios';
import { API_ROUTES } from '../../config/api';

// Import de CKEditor avec Suspense
const CKEditor = React.lazy(() => import('@ckeditor/ckeditor5-react').then(
  module => ({ default: module.CKEditor })
));

// On revient à l'import direct de ClassicEditor
// car l'éditeur a besoin d'une référence directe
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface LazyEditorProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  label?: string;
  height?: string;
}

const LazyEditor: React.FC<LazyEditorProps> = ({ 
  name, 
  value, 
  onChange, 
  height = '300px',
  label 
}) => {
  const editorRef = useRef<any>(null);

  // Ajout pour résoudre le problème de destruction
  useEffect(() => {
    return () => {
      // S'assurer que editorRef est nettoyé proprement
      editorRef.current = null;
    };
  }, []);

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Box sx={{ mb: 1, fontSize: '0.9rem', color: 'rgba(0, 0, 0, 0.6)' }}>
          {label}
        </Box>
      )}
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, height }}>
          <CircularProgress />
        </Box>
      }>
        <Box 
          sx={{ 
            border: '1px solid rgba(0, 0, 0, 0.23)', 
            borderRadius: '4px',
            '&:focus-within': {
              borderColor: '#1976d2',
              borderWidth: '2px',
            },
            '& .ck-editor__editable': {
              minHeight: height,
              maxHeight: 'auto'
            },
            '& .ck-toolbar': {
              border: 'none',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <CKEditor
            editor={ClassicEditor}
            data={value}
            onReady={(editor: any) => {
              editorRef.current = editor;
            }}
            onChange={(_: any, editor: any) => {
              const data = editor.getData();
              onChange(name, data);
            }}
            config={{
              toolbar: [
                'heading', '|', 
                'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                'imageUpload', 'blockQuote', 'insertTable', '|',
                'undo', 'redo'
              ]
            }}
          />
        </Box>
      </Suspense>
    </Box>
  );
};

export default LazyEditor;