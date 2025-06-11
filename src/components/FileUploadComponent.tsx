import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Stack,
    Button,
    Chip,
    Alert,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    InsertDriveFile,
    Image,
    PictureAsPdf,
    Close
} from '@mui/icons-material';

type AllowedFileType = {
    extension: string;
    icon: React.ElementType;
};

type FileInfo = {
    file: File;
    id: number;
    name: string;
    size: number;
    type: string;
    preview: AllowedFileType;
};

type FileUploadComponentProps = {
    onFilesChange?: (files: File[]) => void;
    maxFiles?: number;
    maxSizePerFile?: number;
    resetTrigger?: number;
};

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
    onFilesChange,
    maxFiles = 5,
    maxSizePerFile = 10,
    resetTrigger
}) => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const allowedTypes: Record<string, AllowedFileType> = {
        'application/pdf': { extension: 'PDF', icon: PictureAsPdf },
        'image/jpeg': { extension: 'JPG', icon: Image },
        'image/jpg': { extension: 'JPG', icon: Image },
        'image/png': { extension: 'PNG', icon: Image }
    };

    const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

    const validateFile = (file: File): string[] => {
        const errors: string[] = [];

        if (!allowedTypes[file.type]) {
            errors.push(`Tipo de arquivo não permitido: ${file.name}`);
        }

        if (file.size > maxSizePerFile * 1024 * 1024) {
            errors.push(`Arquivo muito grande: ${file.name} (${bytesToMB(file.size)}MB). Máximo: ${maxSizePerFile}MB`);
        }

        return errors;
    };

    const processFiles = (selectedFiles: FileList) => {
        const fileArray = Array.from(selectedFiles);
        const newErrors: string[] = [];

        if (files.length + fileArray.length > maxFiles) {
            newErrors.push(`Máximo de ${maxFiles} arquivos permitidos`);
            setErrors(newErrors);
            return;
        }

        const validFiles: FileInfo[] = [];

        fileArray.forEach(file => {
            const fileErrors = validateFile(file);
            if (fileErrors.length === 0) {
                const isDuplicate = files.some(existingFile => existingFile.name === file.name);
                if (!isDuplicate) {
                    validFiles.push({
                        file,
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: allowedTypes[file.type]
                    });
                } else {
                    newErrors.push(`Arquivo duplicado: ${file.name}`);
                }
            } else {
                newErrors.push(...fileErrors);
            }
        });

        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        setErrors(newErrors);

        if (onFilesChange) {
            onFilesChange(updatedFiles.map(f => f.file));
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (fileId: number) => {
        const updatedFiles = files.filter(f => f.id !== fileId);
        setFiles(updatedFiles);

        if (onFilesChange) {
            onFilesChange(updatedFiles.map(f => f.file));
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            processFiles(selectedFiles);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            processFiles(droppedFiles);
        }
    };

    const getFileIcon = (fileType: string) => {
        const FileIcon = allowedTypes[fileType]?.icon || InsertDriveFile;
        return <FileIcon />;
    };

    useEffect(() => {
        setFiles([]);
        setErrors([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onFilesChange?.([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetTrigger]);

    return (
        <Box mb={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Upload de Comprovantes *
            </Typography>

            {/* Área de Drop */}
            <Box
                sx={{
                    border: 2,
                    borderColor: isDragging ? 'primary.main' : 'grey.300',
                    borderStyle: 'dashed',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    bgcolor: isDragging ? 'primary.50' : 'grey.50',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50'
                    }
                }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Arraste arquivos aqui ou clique para selecionar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    PDF, JPG, PNG (máx. {maxFiles} arquivos, {maxSizePerFile}MB cada)
                </Typography>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </Box>

            {/* Botão Alternativo */}
            <Stack direction="row" alignItems="center" spacing={2} mt={2} mb={2}>
                <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => fileInputRef.current?.click()}>
                    Escolher Arquivos
                </Button>
                <Typography variant="body2" color="text.secondary">
                    {files.length}/{maxFiles} arquivos selecionados
                </Typography>
            </Stack>

            {/* Lista de Arquivos */}
            {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Arquivos Selecionados:
                    </Typography>
                    <List dense>
                        {files.map((fileObj) => (
                            <ListItem key={fileObj.id} divider>
                                <ListItemIcon>{getFileIcon(fileObj.type)}</ListItemIcon>
                                <ListItemText
                                    primary={fileObj.name}
                                    secondary={`${bytesToMB(fileObj.size)} MB`}
                                />
                                <ListItemSecondaryAction>
                                    <Chip
                                        label={fileObj.preview.extension}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mr: 1 }}
                                    />
                                    <IconButton
                                        edge="end"
                                        onClick={() => removeFile(fileObj.id)}
                                        size="small"
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Erros */}
            {errors.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    {errors.map((error, index) => (
                        <Alert
                            key={index}
                            severity="error"
                            sx={{ mb: 1 }}
                            action={
                                <IconButton
                                    color="inherit"
                                    size="small"
                                    onClick={() => setErrors(errors.filter((_, i) => i !== index))}
                                >
                                    <Close />
                                </IconButton>
                            }
                        >
                            {error}
                        </Alert>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default FileUploadComponent;
