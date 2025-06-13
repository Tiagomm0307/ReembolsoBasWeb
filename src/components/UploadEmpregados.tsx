import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useRef } from "react";
import * as XLSX from 'xlsx';

type EmpregadoPlanilha = {
  Id: number;
  Matricula: string;
  Nome: string;
  Diretoria: string;
  Superintendencia: string;
  Cargo: string;
  Ativo: boolean;
  ValorMaximoMensal: number;
};

export function ModalUploadEmpregados({
  dados,
  onFileUpload,
  onConfirmImport,
  onClose,
  confirmDisabled,
}: {
  dados: EmpregadoPlanilha[];
  onFileUpload: (file: File, preview: EmpregadoPlanilha[]) => void;
  onConfirmImport: () => void;
  onClose: () => void;
  confirmDisabled?: boolean;
}) {
  // Usa ref para resetar o file input se quiser
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as EmpregadoPlanilha[];
      onFileUpload(file, data);
    };
    reader.readAsBinaryString(file);
    // opcional: limpar file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center" my={2}>
        <Button
          component="label"
          variant="contained"
          color="primary"
          startIcon={<UploadFileIcon />}
          sx={{
            minWidth: 220,
            fontWeight: "bold",
            bgcolor: "#ff9100",
            color: "#fff",
            ":hover": { bgcolor: "#ff9800" }
          }}
        >
          Selecionar Arquivo Excel
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" hidden onChange={handleFile} />
        </Button>
      </Box>

      {dados.length > 0 && (
        <TableContainer component={Paper} sx={{ maxHeight: 320, mt: 2 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Matrícula</b></TableCell>
                <TableCell><b>Nome</b></TableCell>
                <TableCell><b>Diretoria</b></TableCell>
                <TableCell><b>Superintendência</b></TableCell>
                <TableCell><b>Cargo</b></TableCell>
                <TableCell align="right"><b>Valor Máximo Mensal</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dados.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.Matricula}</TableCell>
                  <TableCell>{row.Nome}</TableCell>
                  <TableCell>{row.Diretoria}</TableCell>
                  <TableCell>{row.Superintendencia}</TableCell>
                  <TableCell>{row.Cargo}</TableCell>
                  <TableCell align="right">{row.ValorMaximoMensal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Fechar
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={confirmDisabled}
          onClick={onConfirmImport}
        >
          Confirmar Importação
        </Button>
      </Box>
    </Box>
  );
}