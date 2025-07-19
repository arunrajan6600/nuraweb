'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, File, Image, Video, FileText } from 'lucide-react';
import { UploadProgress } from './upload-progress';

interface FileUploadProps {
  onUploadComplete?: (files: FileRecord[]) => void;
}

interface FileRecord {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  s3Key: string;
  s3Url: string;
  uploadedAt: Date;
  uploadedBy: string;
  isActive: boolean;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
  completed?: boolean;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const { token } = useAuth();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string>('');

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (mimeType.includes('pdf') || mimeType.startsWith('text/')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf', 'text/'];
    
    if (file.size > maxSize) {
      return 'File size exceeds 50MB limit';
    }
    
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      return 'File type not allowed';
    }
    
    return null;
  };

  const uploadFile = useCallback(async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadingFiles(prev => prev.map((item, i) => 
          i === index ? { ...item, progress: 100, completed: true } : item
        ));
        return result.file;
      } else {
        const error = await response.json();
        setUploadingFiles(prev => prev.map((item, i) => 
          i === index ? { ...item, error: error.error || 'Upload failed' } : item
        ));
        return null;
      }
    } catch (err) {
      console.error('Network error during upload:', err);
      setUploadingFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, error: 'Network error' } : item
      ));
      return null;
    }
  }, [token]);

  const handleFiles = useCallback(async (files: FileList) => {
    setError('');
    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(`${file.name}: ${validationError}`);
        return;
      }
      validFiles.push(file);
    }

    // Initialize uploading files
    const initialUploadingFiles = validFiles.map(file => ({
      file,
      progress: 0,
    }));
    setUploadingFiles(initialUploadingFiles);

    // Upload files
    const uploadedFiles: FileRecord[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadingFiles(prev => prev.map((item, index) => 
        index === i ? { ...item, progress: 50 } : item
      ));
      
      const result = await uploadFile(file, i);
      if (result) {
        uploadedFiles.push(result);
      }
    }

    // Call completion callback
    if (onUploadComplete && uploadedFiles.length > 0) {
      onUploadComplete(uploadedFiles);
    }

    // Clear uploading files after a delay
    setTimeout(() => {
      setUploadingFiles([]);
    }, 2000);
  }, [token, onUploadComplete, uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files here, or click to select files
            </p>
            <div className="space-y-2">
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose Files
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,application/pdf,text/*"
                  />
                </label>
              </Button>
              <p className="text-sm text-muted-foreground">
                Maximum file size: 50MB. Supported: Images, Videos, Audio, PDF, Text
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploading Files</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              {getFileIcon(uploadingFile.file.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{uploadingFile.file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadingFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <UploadProgress 
                  progress={uploadingFile.progress}
                  error={uploadingFile.error}
                  completed={uploadingFile.completed}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
