import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubTypeForm } from "./SubTypeFormProvider";
import { FileText } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const SubTypeBasicInfo = () => {
  const { formData, setFormData, errors } = useSubTypeForm();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name,
      description: formData.description,
    },
  });

  // Update the parent form data when form values change
  const handleChange = (field: keyof FormValues, value: string) => {
    form.setValue(field, value);
    setFormData({ [field]: value });
  };

  return (
    <Card className="border border-blue-900/30 bg-gradient-to-b from-[#0a1033] to-[#0d1541] shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-blue-900/20 pb-3 border-b border-blue-900/30">
        <CardTitle className="text-sm text-blue-300 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-5">
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-blue-300 text-xs font-medium">
                    Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter subtype name"
                      {...field}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="bg-[#0a1033] border-blue-900/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-md"
                    />
                  </FormControl>
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-blue-300 text-xs font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter subtype description"
                      {...field}
                      rows={4}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      className="bg-[#0a1033] border-blue-900/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-md resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
