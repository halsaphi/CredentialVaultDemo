import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Credential } from "@/lib/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Form schema with validation
const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  idNumber: z.string().min(1, "ID number is required"),
  kycStatus: z.string().min(1, "KYC status is required"),
  netWorth: z.coerce.number().min(0, "Net worth must be 0 or greater"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  additionalInfo: z.string().optional(),
});

export default function IssueCredential() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Generate a unique credential ID
  const generateCredentialId = () => {
    return `VC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000000)}`;
  };
  
  // Setup form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      nationality: "",
      idNumber: "",
      kycStatus: "verified",
      netWorth: 0,
      languages: [],
      additionalInfo: "",
    },
  });
  
  const availableLanguages = [
    { id: "English", label: "English" },
    { id: "French", label: "French" },
    { id: "Spanish", label: "Spanish" },
    { id: "German", label: "German" },
    { id: "Chinese", label: "Chinese" },
    { id: "Cantonese", label: "Cantonese" },
  ];
  
  const issueMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const credential: Credential = {
        ...values,
        credentialId: generateCredentialId(),
        issueDate: new Date().toISOString().split('T')[0],
      };
      
      const response = await apiRequest("POST", "/api/credentials", credential);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/credentials'] });
      toast({
        title: "Success!",
        description: "Credential has been successfully issued.",
        variant: "default",
      });
      
      // Store the credential ID in localStorage for easy retrieval in verification page
      localStorage.setItem("lastIssuedCredentialId", data.credentialId);
      
      // Navigate to selective disclosure page after a delay
      setTimeout(() => {
        navigate("/selective-disclosure");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to issue credential: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    issueMutation.mutate(values);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md mb-8">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Shield className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-xl font-medium">Issue Verifiable Credential</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                    <InfoIcon className="h-4 w-4 text-neutral-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Create a verifiable credential with identity information that can be selectively disclosed later.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="HK">Hong Kong</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kycStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KYC Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select KYC status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="netWorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Worth (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="languages"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Languages</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableLanguages.map((language) => (
                        <FormField
                          key={language.id}
                          control={form.control}
                          name="languages"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={language.id}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(language.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, language.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== language.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal text-neutral-600">
                                  {language.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-3"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button 
                  type="submit"
                  className="flex items-center"
                  disabled={issueMutation.isPending}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  {issueMutation.isPending ? "Issuing..." : "Issue Credential"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
