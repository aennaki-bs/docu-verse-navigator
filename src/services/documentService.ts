
import { documentService, documentTypeService, ligneService, sousLigneService, subTypeService } from './documents';

// Re-export all services as properties of a single object for backward compatibility
const combinedDocumentService = {
  // Document methods
  getAllDocuments: documentService.getAllDocuments,
  getDocumentById: documentService.getDocumentById,
  getRecentDocuments: documentService.getRecentDocuments,
  createDocument: documentService.createDocument,
  updateDocument: documentService.updateDocument,
  deleteDocument: documentService.deleteDocument,
  deleteMultipleDocuments: documentService.deleteMultipleDocuments,

  // Add direct access to individual services
  documentTypeService,
  subTypeService,
  ligneService,
  sousLigneService,

  // Document Types methods (kept for backward compatibility)
  getAllDocumentTypes: documentTypeService.getAllDocumentTypes,
  createDocumentType: documentTypeService.createDocumentType,
  updateDocumentType: documentTypeService.updateDocumentType,
  validateTypeName: documentTypeService.validateTypeName,
  deleteDocumentType: documentTypeService.deleteDocumentType,
  deleteMultipleDocumentTypes: documentTypeService.deleteMultipleDocumentTypes,

  // SubType methods (kept for backward compatibility)
  getAllSubTypes: subTypeService.getAllSubTypes,
  getSubTypeById: subTypeService.getSubTypeById,
  getSubTypesByDocumentTypeId: subTypeService.getSubTypesByDocumentTypeId,
  getSubTypesForDate: subTypeService.getSubTypesForDate,
  createSubType: subTypeService.createSubType,
  updateSubType: subTypeService.updateSubType,
  deleteSubType: subTypeService.deleteSubType,

  // Ligne methods (kept for backward compatibility)
  getAllLignes: ligneService.getAllLignes,
  getLigneById: ligneService.getLigneById,
  getLignesByDocumentId: ligneService.getLignesByDocumentId,
  createLigne: ligneService.createLigne,
  updateLigne: ligneService.updateLigne,
  deleteLigne: ligneService.deleteLigne,

  // SousLigne methods (kept for backward compatibility)
  getAllSousLignes: sousLigneService.getAllSousLignes,
  getSousLigneById: sousLigneService.getSousLigneById,
  getSousLignesByLigneId: sousLigneService.getSousLignesByLigneId,
  getSousLignesByDocumentId: sousLigneService.getSousLignesByDocumentId,
  createSousLigne: sousLigneService.createSousLigne,
  updateSousLigne: sousLigneService.updateSousLigne,
  deleteSousLigne: sousLigneService.deleteSousLigne
};

export default combinedDocumentService;
