"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface RowData {
  id: number
  descripcion: string
  comercio: string
  total: number
  fecha: string // Add fecha property
}

export default function Page() {
  const [rows, setRows] = useState<RowData[]>([])
  const [descripcion, setDescripcion] = useState("")
  const [comercio, setComercio] = useState("")
  const [total, setTotal] = useState("")
  const [fecha, setFecha] = useState("") // Add state for fecha
  const [editingId, setEditingId] = useState<number | null>(null)
  const [titulo, setTitulo] = useState("")
  const [descripcionGeneral, setDescripcionGeneral] = useState("")

  const addRow = () => {
    if (descripcion && comercio && total && fecha) { // Include fecha in validation
      if (editingId !== null) {
        setRows(
          rows.map((row) =>
            row.id === editingId ? { ...row, descripcion, comercio, total: Number.parseFloat(total), fecha } : row,
          ),
        )
        setEditingId(null)
      } else {
        setRows([
          ...rows,
          {
            id: rows.length + 1,
            descripcion,
            comercio,
            total: Number.parseFloat(total),
            fecha, // Include fecha in new row
          },
        ])
      }
      setDescripcion("")
      setComercio("")
      setTotal("")
      setFecha("") // Reset fecha
    }
  }

  const editRow = (id: number) => {
    const rowToEdit = rows.find((row) => row.id === id)
    if (rowToEdit) {
      setDescripcion(rowToEdit.descripcion)
      setComercio(rowToEdit.comercio)
      setTotal(rowToEdit.total.toString())
      setFecha(rowToEdit.fecha) // Set fecha for editing
      setEditingId(id)
    }
  }

  const deleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const totalSum = rows.reduce((sum, row) => sum + row.total, 0)

  const generatePDF = () => {
    const input = document.getElementById("table-to-print")
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF()
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width
        const x = 8
        const y = 5
        pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight)
        pdf.save(`${titulo}.pdf`)
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tabla Dinámica</h1>
      <div className="mb-4">
        <Input
          placeholder="Título del cuadro"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mb-2"
        />
        <Textarea
          placeholder="Descripción general"
          value={descripcionGeneral}
          onChange={(e) => setDescripcionGeneral(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 mb-4"> {/* Change grid-cols-3 to grid-cols-4 */}
        <Input placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <Input placeholder="Comercio" value={comercio} onChange={(e) => setComercio(e.target.value)} />
        <Input type="number" placeholder="Total" value={total} onChange={(e) => setTotal(e.target.value)} />
        <Input type="date" placeholder="Fecha" value={fecha} onChange={(e) => setFecha(e.target.value)} /> {/* Add date input */}
      </div>
      <Button onClick={addRow} className="mb-4">
        {editingId !== null ? "Actualizar" : "Agregar"}
      </Button>
      <div id="table-to-print" className="border-slate-400">
        {titulo && <h2 className="text-xl font-bold mb-2">{titulo}</h2>}
        {descripcionGeneral && <p className="mb-4">{descripcionGeneral}</p>}
        <Table className="w-11/12 border-slate-300">
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Comercio</TableHead>
              <TableHead>Fecha</TableHead> 
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody >
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.descripcion}</TableCell>
                <TableCell>{row.comercio}</TableCell>
                <TableCell>{row.fecha}</TableCell> 
                <TableCell>L. {row.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell></TableCell>
              <TableCell colSpan={3} className="font-bold">Total</TableCell>
              <TableCell className="font-bold">L. {totalSum.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Button onClick={generatePDF} className="mt-4">
        Generar PDF
      </Button>
    </div>
  )
}

