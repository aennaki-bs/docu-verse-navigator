
import { documentService, documentTypeService, ligneService, sousLigneService } from './documents';

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

  // Document Types methods
  getAllDocumentTypes: documentTypeService.getAllDocumentTypes,
  createDocumentType: documentTypeService.createDocumentType,
  updateDocumentType: documentTypeService.updateDocumentType,
  validateTypeName: documentTypeService.validateTypeName,
  deleteDocumentType: documentTypeService.deleteDocumentType,
  deleteMultipleDocumentTypes: documentTypeService.deleteMultipleDocumentTypes,

  // Ligne methods
  getAllLignes: ligneService.getAllLignes,
  getLigneById: ligneService.getLigneById,
  getLignesByDocumentId: ligneService.getLignesByDocumentId,
  createLigne: ligneService.createLigne,
  updateLigne: ligneService.updateLigne,
  deleteLigne: ligneService.deleteLigne,

  // SousLigne methods
  getAllSousLignes: sousLigneService.getAllSousLignes,
  getSousLigneById: sousLigneService.getSousLigneById,
  getSousLignesByLigneId: sousLigneService.getSousLignesByLigneId,
  getSousLignesByDocumentId: sousLigneService.getSousLignesByDocumentId,
  createSousLigne: sousLigneService.createSousLigne,
  updateSousLigne: sousLigneService.updateSousLigne,
  deleteSousLigne: sousLigneService.deleteSousLigne
};

export default combinedDocumentService;
