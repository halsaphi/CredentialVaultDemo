import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RevocationStatus, RevocationRequest } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function RevocationCheck() {
  const [credentialId, setCredentialId] = useState("");
  const [openRevokeDialog, setOpenRevokeDialog] = useState(false);
  const [revocationReason, setRevocationReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to check revocation status
  const { data: status, isLoading, isError, error, refetch } = useQuery<RevocationStatus>({
    queryKey: ["/api/revocation-status", credentialId],
    queryFn: async () => {
      if (!credentialId) return { isRevoked: false };
      const res = await fetch(`/api/revocation-status/${credentialId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to check revocation status");
      }
      return res.json();
    },
    enabled: !!credentialId,
    refetchOnWindowFocus: false
  });

  // Mutation to revoke a credential
  const revokeMutation = useMutation({
    mutationFn: async (request: RevocationRequest) => {
      return fetch("/api/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      }).then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.message || "Failed to revoke credential");
          });
        }
        return res.json();
      });
    },
    onSuccess: () => {
      toast({
        title: "Credential Revoked",
        description: "The credential has been successfully revoked.",
        variant: "default"
      });
      setOpenRevokeDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/revocation-status", credentialId] });
      queryClient.invalidateQueries({ queryKey: ["/api/credentials"] });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke credential",
        variant: "destructive"
      });
    }
  });

  const handleRevoke = () => {
    if (!credentialId) {
      toast({
        title: "Error",
        description: "Credential ID is required",
        variant: "destructive"
      });
      return;
    }

    if (!revocationReason) {
      toast({
        title: "Error",
        description: "Revocation reason is required",
        variant: "destructive"
      });
      return;
    }

    revokeMutation.mutate({
      credentialId,
      reason: revocationReason
    });
  };

  const handleCheckStatus = () => {
    if (!credentialId) {
      toast({
        title: "Error",
        description: "Please enter a credential ID to check",
        variant: "destructive"
      });
      return;
    }
    refetch();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Credential Revocation Check</h1>
          <p className="text-gray-500 mb-6">
            Check the revocation status of a credential or revoke a credential if necessary.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Check Revocation Status</CardTitle>
            <CardDescription>
              Enter the ID of the credential you want to check.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="credentialId"
                    placeholder="Enter credential ID"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                  />
                  <Button onClick={handleCheckStatus} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Status"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isError && (
          <Card className="border-red-300 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error instanceof Error ? error.message : "Failed to check revocation status"}</p>
            </CardContent>
          </Card>
        )}

        {status && credentialId && !isLoading && !isError && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Revocation Status
                <Badge variant={status.isRevoked ? "destructive" : "success"}>
                  {status.isRevoked ? "REVOKED" : "ACTIVE"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {status.isRevoked ? (
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    <span>This credential has been revoked</span>
                  </div>
                  <div className="grid gap-2">
                    <Label>Revocation Date</Label>
                    <div className="text-sm">{status.revocationDate}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Revocation Reason</Label>
                    <div className="text-sm">{status.revocationReason}</div>
                  </div>
                  {status.credential && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                      <h3 className="font-medium mb-2">Revoked Credential Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Full Name:</div>
                        <div>{status.credential.fullName}</div>
                        <div>ID Number:</div>
                        <div>{status.credential.idNumber}</div>
                        <div>Issue Date:</div>
                        <div>{status.credential.issueDate}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>This credential is valid and has not been revoked</span>
                  </div>
                  <div className="mt-4">
                    <Dialog open={openRevokeDialog} onOpenChange={setOpenRevokeDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">Revoke this Credential</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Revoke Credential</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. The credential will be permanently marked as revoked.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="reason">Revocation Reason</Label>
                            <Textarea
                              id="reason"
                              placeholder="Enter the reason for revocation"
                              value={revocationReason}
                              onChange={(e) => setRevocationReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setOpenRevokeDialog(false)}>
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            variant="destructive" 
                            onClick={handleRevoke}
                            disabled={revokeMutation.isPending}
                          >
                            {revokeMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Revoking...
                              </>
                            ) : (
                              "Revoke Credential"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}