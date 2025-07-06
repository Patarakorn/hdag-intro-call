"use client";
import { useState } from "react";
import { Upload, Mail, FileText, Plus, Trash2, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
}

interface EmailEntry {
  id: string;
  email: string;
  name: string;
  dateAdded: string;
}

const Admin = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const router = useRouter();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type === "application/pdf") {
          const newFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB",
            uploadDate: new Date().toLocaleDateString()
          };
          setUploadedFiles(prev => [...prev, newFile]);
          toast.success(`${file.name} has been successfully uploaded.`);
        } else {
          toast.error("Please upload PDF files only.");
        }
      });
    }
  };

  const handleAddEmail = () => {
    if (newEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      const newEmailEntry: EmailEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        email: newEmail,
        name: newEmail.split('@')[0], // Use email prefix as name
        dateAdded: new Date().toLocaleDateString()
      };

      setEmails(prev => [...prev, newEmailEntry]);
      setNewEmail("");
      toast.success(`${newEmail} has been added to the database.`);
    }
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast.success("PDF file has been removed.");
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(prev => prev.filter(email => email.id !== id));
    toast.success("Email has been removed from the database.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      {/* Header */}
      <header className="bg-black/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 rounded-lg p-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-gray-400">Manage PDF files and email database</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="outline" 
          className="bg-zinc-800/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/70 hover:text-white hover:border-zinc-400 transition-colors mb-8"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PDF Upload Section */}
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileText className="h-5 w-5 text-purple-400" />
                <span>PDF File Management</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload and manage PDF documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-6 text-lg">Drag & drop PDF files or click to browse</p>
                <Input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button 
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-base font-semibold"
                >
                  Choose PDF Files
                </Button>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-purple-400" />
                          <div>
                            <p className="text-sm font-medium text-white">{file.name}</p>
                            <p className="text-xs text-gray-400">{file.size} • {file.uploadDate}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Management Section */}
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Mail className="h-5 w-5 text-purple-400" />
                <span>Email Database</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Add and manage email addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-300 text-base font-medium mb-3 block">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white h-12 text-base"
                  />
                </div>
                <Button
                  onClick={handleAddEmail}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-base font-semibold"
                  disabled={!newEmail}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Email
                </Button>
              </div>

              {/* Email List */}
              {emails.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Email Database ({emails.length})</h3>
                  <div className="max-h-64 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Name</TableHead>
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300">Date Added</TableHead>
                          <TableHead className="text-gray-300">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emails.map((email) => (
                          <TableRow key={email.id} className="border-gray-700">
                            <TableCell className="text-white">{email.name}</TableCell>
                            <TableCell className="text-white">{email.email}</TableCell>
                            <TableCell className="text-gray-400">{email.dateAdded}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteEmail(email.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin; 