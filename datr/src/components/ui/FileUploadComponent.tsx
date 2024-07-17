import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export const FileUploadComponent = ({
  allowedTypes,
  onSubmit,
  key
}: {
  allowedTypes: string[];
  onSubmit:(files:File[])=>void;
  key:any
}) => {
  const [fileState, setFileState] = useState<
    "idle" | "drag-allowed" | "drag-not-allowed"
  >("idle");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const hiddenFileElement = useRef<HTMLInputElement>(null);
  const dialogRef= useRef<HTMLButtonElement|null>(null)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Check if any dragged files are not allowed
    let isFileAllowed = true;
    const files = Array.from(e.dataTransfer.files);
    const currentFiles = [...selectedFiles];
    setSelectedFiles([...files, ...currentFiles]);
    determineFileGood([...files, ...currentFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Convert FileList to array
      const filesArray = Array.from(files);
      const currentFiles = [...selectedFiles];
      setSelectedFiles([...files, ...currentFiles]);
      determineFileGood([...files, ...currentFiles]);
    }
  };
  const determineFileGood = (filesArray: File[]) => {
    if (filesArray.length === 0) {
      setFileState("idle");
      return;
    }
    let isFileAllowed = true;
    filesArray.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        isFileAllowed = false;
      }
    });

    setFileState(isFileAllowed ? "drag-allowed" : "drag-not-allowed");
  };

  const totalFileSize = selectedFiles.reduce(
    (previous, current) => previous + current.size,
    0
  );

  return (
    <Dialog key={key}>
      <DialogTrigger ref={dialogRef} asChild>
        <Button variant="outline" className="bg-ncBlue text-white dark:bg-ncBlue h-8">{selectedFiles.length<=0?"Upload Files":`${selectedFiles.length} File(s) Selected`}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Select or drag and drop files to upload.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input
            ref={hiddenFileElement}
            accept={allowedTypes.join(", ")}
            type="file"
            name=""
            className="hidden"
            id=""
            onChange={handleFileSelect}
          />
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            role="button"
            onClick={() => {
              hiddenFileElement.current?.click();
            }}
            className={cn(
              "flex items-center justify-center w-full px-6 py-10 border-2 border-dashed rounded-md border-primary bg-background hover:bg-muted transition-colors",
              fileState === "drag-allowed" && "border-blue-400",
              fileState === "drag-not-allowed" && "border-red-500"
            )}
          >
            <div className="text-center">
              <CloudUploadIcon className="w-12 h-12 mx-auto text-primary" />
              <div className="mt-4 font-medium text-primary">
                Drag and drop files here
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                or click to select files
              </div>
            </div>
          </div>
          <div className="grid gap-2 max-h-[280px] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="font-medium">Selected Files</div>
              <div className="text-xs text-muted-foreground">
                {selectedFiles.length} files, {formatBytes(totalFileSize)}
              </div>
            </div>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center  px-4 py-2 bg-muted rounded-md ",
                  !allowedTypes.includes(file.type)
                    ? "bg-red-200 text-red-500"
                    : "bg-blue-300 text-blue-500"
                )}
              >
                
                  <FileIcon className="w-5 h-5 text-muted-foreground shrink" />
                  <div className="text-sm w-[20rem] md:w-[26rem] ml-1.5 truncate">{file.name}</div>
                  <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted/50 ml-auto"
                  onClick={() => {
                    let currentFiles=[...selectedFiles]
                    setSelectedFiles(currentFiles.filter((f, i) => i !== index)
                    );
                    determineFileGood(currentFiles.filter((f, i) => i !== index));
                  }}
                >
                  <XIcon className="w-4 h-4 shrink" />
                  <span className="sr-only">Remove</span>
                </Button>
                </div>
               
             
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={()=>{onSubmit(selectedFiles)
            dialogRef.current?.click()
          }}  disabled={fileState!=="drag-allowed"} className="bg-ncBlue text-white " type="submit">Upload Files</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function CloudUploadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function FileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
