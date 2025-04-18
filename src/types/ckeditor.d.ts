declare module '@ckeditor/ckeditor5-react' {
  import React from 'react';
  
  export const CKEditor: React.ComponentType<any>;
}

declare module '@ckeditor/ckeditor5-build-classic' {
  const ClassicEditor: any;
  export default ClassicEditor;
} 