
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Pencil, Trash2, CalendarIcon } from 'lucide-react';
import { SubType, CreateSubTypeRequest, UpdateSubTypeRequest } from '@/models/subtype';
import { DocumentType } from '@/models/document';
import { subTypeService } from '@/services/documents';
import documentService from '@/services/documentService';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const SubTypesManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subtypes, setSubtypes] = useState<SubType[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubtype, setSelectedSubtype] = useState<SubType | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateSubTypeRequest>({
    name: '',
    description: '',
    documentTypeId: 0,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    isActive: true
  });

  const isAdmin = user?.role === 'Admin';
  const isFullUser = user?.role === 'FullUser';

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subtypesData, documentTypesData] = await Promise.all([
          subTypeService.getAllSubTypes(),
          documentService.getAllDocumentTypes()
        ]);
        setSubtypes(subtypesData);
        setDocumentTypes(documentTypesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleDocumentTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, documentTypeId: parseInt(value) }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, startDate: date.toISOString() }));
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, endDate: date.toISOString() }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      documentTypeId: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      isActive: true
    });
    setSelectedSubtype(null);
  };

  const handleCreateSubmit = async () => {
    try {
      setFormSubmitting(true);
      
      if (!formData.name || !formData.documentTypeId || !formData.startDate || !formData.endDate) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        toast.error('Start date must be before end date');
        return;
      }

      await subTypeService.createSubType(formData);
      toast.success('Subtype created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
      
      // Refresh data
      const updatedSubtypes = await subTypeService.getAllSubTypes();
      setSubtypes(updatedSubtypes);
    } catch (error: any) {
      console.error('Error creating subtype:', error);
      toast.error(error?.response?.data || 'Failed to create subtype');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedSubtype) return;
    
    try {
      setFormSubmitting(true);
      
      if (!formData.name || !formData.startDate || !formData.endDate) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        toast.error('Start date must be before end date');
        return;
      }

      const updateData: UpdateSubTypeRequest = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive
      };

      await subTypeService.updateSubType(selectedSubtype.id, updateData);
      toast.success('Subtype updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      
      // Refresh data
      const updatedSubtypes = await subTypeService.getAllSubTypes();
      setSubtypes(updatedSubtypes);
    } catch (error: any) {
      console.error('Error updating subtype:', error);
      toast.error(error?.response?.data || 'Failed to update subtype');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubtype) return;
    
    try {
      setFormSubmitting(true);
      await subTypeService.deleteSubType(selectedSubtype.id);
      toast.success('Subtype deleted successfully');
      setIsDeleteDialogOpen(false);
      
      // Refresh data
      const updatedSubtypes = await subTypeService.getAllSubTypes();
      setSubtypes(updatedSubtypes);
    } catch (error: any) {
      console.error('Error deleting subtype:', error);
      toast.error(error?.response?.data || 'Failed to delete subtype. It might be in use by documents.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openEditDialog = (subtype: SubType) => {
    setSelectedSubtype(subtype);
    setFormData({
      name: subtype.name,
      description: subtype.description,
      documentTypeId: subtype.documentTypeId,
      startDate: subtype.startDate,
      endDate: subtype.endDate,
      isActive: subtype.isActive
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (subtype: SubType) => {
    setSelectedSubtype(subtype);
    setIsDeleteDialogOpen(true);
  };

  const getDocumentTypeName = (typeId: number) => {
    const type = documentTypes.find(t => t.id === typeId);
    return type ? type.typeName : 'Unknown Type';
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-500" />
          <p className="mt-4 text-lg text-gray-200">Loading subtypes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')} 
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const hasPermission = isAdmin || isFullUser;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Subtypes Management</h1>
          <p className="text-gray-400">Manage document subtypes with date ranges</p>
        </div>
        {hasPermission && (
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Subtype
          </Button>
        )}
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Document Subtypes</CardTitle>
          <CardDescription className="text-gray-400">
            List of all document subtypes with their respective document types and validity periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subtypes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No subtypes found</p>
              {hasPermission && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  Create your first subtype
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900 hover:bg-gray-900">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Document Type</TableHead>
                    <TableHead className="text-gray-300">Start Date</TableHead>
                    <TableHead className="text-gray-300">End Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    {hasPermission && <TableHead className="text-gray-300 text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subtypes.map((subtype) => (
                    <TableRow key={subtype.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                      <TableCell className="font-medium text-white">
                        {subtype.name}
                        <div className="text-xs text-gray-400">
                          {subtype.subTypeKey}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {subtype.documentType?.typeName || getDocumentTypeName(subtype.documentTypeId)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(subtype.startDate), 'MM/dd/yyyy')}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(subtype.endDate), 'MM/dd/yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={subtype.isActive ? "success" : "destructive"}
                          className={subtype.isActive 
                            ? "bg-green-600/20 text-green-400 hover:bg-green-600/30" 
                            : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                          }
                        >
                          {subtype.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      {hasPermission && (
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-blue-700 hover:bg-blue-700/30 hover:text-blue-300"
                              onClick={() => openEditDialog(subtype)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-8 border-red-700 hover:bg-red-700/30 hover:text-red-300"
                              onClick={() => openDeleteDialog(subtype)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Subtype</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new document subtype with validity period
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentTypeId">Document Type*</Label>
              <Select 
                value={formData.documentTypeId ? formData.documentTypeId.toString() : ''} 
                onValueChange={handleDocumentTypeChange}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a document type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {documentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id!.toString()}>
                      {type.typeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter subtype name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-gray-700 border-gray-600 text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(new Date(formData.startDate), 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.startDate)}
                      onSelect={handleStartDateChange}
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-gray-700 border-gray-600 text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(new Date(formData.endDate), 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.endDate)}
                      onSelect={handleEndDateChange}
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={formSubmitting}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSubmit}
              disabled={formSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Subtype'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Subtype</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update subtype information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter subtype name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-gray-700 border-gray-600 text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(new Date(formData.startDate), 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.startDate)}
                      onSelect={handleStartDateChange}
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left bg-gray-700 border-gray-600 text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(new Date(formData.endDate), 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.endDate)}
                      onSelect={handleEndDateChange}
                      className="bg-gray-800 text-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={formSubmitting}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={formSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Subtype'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Subtype</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this subtype? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedSubtype && (
            <div className="border border-red-800/30 bg-red-900/10 p-4 rounded-md">
              <p className="text-white font-medium">{selectedSubtype.name}</p>
              <p className="text-sm text-gray-300 mt-1">Key: {selectedSubtype.subTypeKey}</p>
              <p className="text-sm text-gray-300 mt-1">
                Document Type: {getDocumentTypeName(selectedSubtype.documentTypeId)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={formSubmitting}
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              disabled={formSubmitting}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubTypesManagement;
