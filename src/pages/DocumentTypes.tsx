
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FolderPlus, Plus, Trash, LogOut, UserCog, ChevronRight, Check } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import documentService from '@/services/documentService';
import { DocumentType } from '@/models/document';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const typeSchema = z.object({
  typeName: z.string().min(2, "Type name must be at least 2 characters."),
  typeAttr: z.string().optional(),
});

const DocumentTypes = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isTypeNameValid, setIsTypeNameValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const form = useForm<z.infer<typeof typeSchema>>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      typeName: "",
      typeAttr: "",
    },
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setIsLoading(true);
      const data = await documentService.getAllDocumentTypes();
      setTypes(data);
    } catch (error) {
      console.error('Failed to fetch document types:', error);
      toast.error('Failed to load document types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const openDeleteDialog = (id: number) => {
    setTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (typeToDelete) {
        await documentService.deleteDocumentType(typeToDelete);
        toast.success('Document type deleted successfully');
        fetchTypes();
      }
    } catch (error) {
      console.error('Failed to delete document type:', error);
      toast.error('Failed to delete document type');
    } finally {
      setDeleteDialogOpen(false);
      setTypeToDelete(null);
    }
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  };

  const validateTypeName = async (typeName: string) => {
    if (typeName.length < 2) return;
    
    setIsValidating(true);
    try {
      const exists = await documentService.validateTypeName(typeName);
      setIsTypeNameValid(!exists);
      return !exists;
    } catch (error) {
      console.error('Error validating type name:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const typeName = form.getValues("typeName");
      const isValid = await validateTypeName(typeName);
      
      if (isValid) {
        setStep(2);
      } else {
        form.setError("typeName", { 
          type: "manual", 
          message: "This type name already exists." 
        });
      }
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data: z.infer<typeof typeSchema>) => {
    try {
      await documentService.createDocumentType({
        typeName: data.typeName,
        typeAttr: data.typeAttr || undefined
      });
      toast.success('Document type created successfully');
      form.reset();
      setStep(1);
      setIsDrawerOpen(false);
      fetchTypes();
    } catch (error) {
      console.error('Failed to create document type:', error);
      toast.error('Failed to create document type');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard">
              <DocuVerseLogo className="h-10 w-auto" />
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">DocApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && user.role === 'Admin' && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link to="/profile">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Avatar className="h-9 w-9">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="Profile" />
                  ) : (
                    <AvatarFallback className="text-sm">{getInitials()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Types</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage document types for your organization</p>
          </div>
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 px-6" size="lg">
                <Plus className="mr-2 h-5 w-5" /> Add Type
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto max-w-md">
              <DrawerHeader className="text-center">
                <DrawerTitle className="text-2xl font-bold">
                  {step === 1 ? "Create Document Type" : "Additional Attributes"}
                </DrawerTitle>
                <DrawerDescription className="mt-2">
                  {step === 1 
                    ? "Enter a unique name for this document type" 
                    : "Provide optional attributes for this document type"}
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex justify-center mb-6">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${step === 1 ? "bg-blue-600 text-white" : "bg-green-500 text-white"}`}>
                    {step === 1 ? "1" : <Check className="h-5 w-5"/>}
                  </div>
                  <div className={`h-1 w-16 ${step > 1 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}>
                    2
                  </div>
                </div>
              </div>

              <div className="px-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {step === 1 && (
                      <FormField
                        control={form.control}
                        name="typeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Type Name*</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter document type name" 
                                className="h-12 text-base"
                                onChange={(e) => {
                                  field.onChange(e);
                                  setIsTypeNameValid(null);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              This name must be unique and at least 2 characters long
                            </FormDescription>
                            {isTypeNameValid === false && (
                              <p className="text-sm text-red-500 flex items-center mt-1">
                                <span className="inline-block w-4 h-4 rounded-full bg-red-100 text-red-600 text-center mr-1.5 text-xs font-bold">!</span>
                                This type name already exists
                              </p>
                            )}
                            {isTypeNameValid === true && (
                              <p className="text-sm text-green-500 flex items-center mt-1">
                                <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 text-center mr-1.5 text-xs">✓</span>
                                Type name is available
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {step === 2 && (
                      <FormField
                        control={form.control}
                        name="typeAttr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Type Attributes (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter attributes (optional)" 
                                className="h-12 text-base"
                              />
                            </FormControl>
                            <FormDescription>
                              Additional attributes for this document type
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </form>
                </Form>
              </div>
              <DrawerFooter className="px-6">
                {step === 1 ? (
                  <Button 
                    onClick={nextStep}
                    disabled={!form.getValues("typeName") || form.getValues("typeName").length < 2 || isValidating}
                    className="w-full h-12 text-base"
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <Button onClick={form.handleSubmit(onSubmit)} className="w-full h-12 text-base bg-green-600 hover:bg-green-700">
                      Create Type
                    </Button>
                    <Button variant="outline" onClick={prevStep} className="w-full h-12 text-base">
                      Back
                    </Button>
                  </div>
                )}
                <DrawerClose asChild>
                  <Button variant="outline" onClick={() => {
                    setStep(1);
                    form.reset();
                  }} className="w-full h-10 text-sm mt-2">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : types.length > 0 ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Available Document Types</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md overflow-hidden border-0">
                <Table>
                  <TableHeader className="bg-gray-100 dark:bg-gray-800">
                    <TableRow>
                      <TableHead className="w-1/6">Type Key</TableHead>
                      <TableHead className="w-1/3">Type Name</TableHead>
                      <TableHead className="w-1/4">Attributes</TableHead>
                      <TableHead className="w-1/6">Document Count</TableHead>
                      <TableHead className="w-1/12 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {types.map((type) => (
                      <TableRow key={type.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="px-2 py-1 text-sm font-mono">
                            {type.typeKey}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{type.typeName}</TableCell>
                        <TableCell>{type.typeAttr || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="px-2 py-1">
                            {type.documentCounter}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 ${
                              type.documentCounter! > 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => type.documentCounter! === 0 && openDeleteDialog(type.id!)}
                            disabled={type.documentCounter! > 0}
                            title={type.documentCounter! > 0 ? "Cannot delete types with documents" : "Delete type"}
                          >
                            <Trash className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-0">
              <div className="text-center py-20">
                <FolderPlus className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No document types found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Document types help categorize your documents. Start by creating your first document type.
                </p>
                <Button 
                  onClick={() => setIsDrawerOpen(true)} 
                  className="px-6 py-2 text-base"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Document Type
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Confirm Delete</DialogTitle>
            <DialogDescription className="text-base py-3">
              Are you sure you want to delete this document type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="sm:w-1/3">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              className="sm:w-1/3 bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTypes;
