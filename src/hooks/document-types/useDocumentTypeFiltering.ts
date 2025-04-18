
import { useMemo, useState } from 'react';
import { DocumentType } from '@/models/document';

export const useDocumentTypeFiltering = (types: DocumentType[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTypes = useMemo(() => {
    if (!searchQuery.trim()) {
      return types;
    }
    
    const query = searchQuery.toLowerCase();
    return types.filter(type => 
      (type.typeKey?.toLowerCase().includes(query) || '') ||
      (type.typeName?.toLowerCase().includes(query) || '') ||
      (type.typeAttr?.toLowerCase().includes(query) || '')
    );
  }, [types, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredTypes
  };
};
