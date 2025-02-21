import React, { useRef, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Row, Col } from 'react-bootstrap';
import { BiCloudDownload } from 'react-icons/bi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceModal = ({ showModal, closeModal, info, items, currency }) => {
  const invoiceRef = useRef();
  const [totals, setTotals] = useState({ subTotal: 0, taxAmount: 0, discountAmount: 0, total: 0 });

  useEffect(() => {
    if (showModal) {
      let subTotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0);
      let taxAmount = (subTotal * (parseFloat(info.taxRate) || 0)) / 100;
      let discountAmount = (subTotal * (parseFloat(info.discount) || 0)) / 100;
      let total = subTotal + taxAmount - discountAmount;
      setTotals({ subTotal, taxAmount, discountAmount, total });
    }
  }, [showModal, items, info.taxRate, info.discount]);

  const generatePDF = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    });
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="lg" centered>
      <Modal.Header closeButton className="border-0 bg-primary text-white">
        <Modal.Title>Invoice Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div ref={invoiceRef} id="invoicePreview" className="p-4 bg-white">
          <Row>
            <Col md={4}>
            <h4 className="text-primary">Invoice # {info.invoiceNumber}</h4>
            <p> Date Of Issue :{info.dateOfIssue}</p>
            <p>Due Date :{info.dueDate}</p>
            </Col>
            <Col>
            <h4 className="fw-bold">{info.billFrom.name || 'BILL FROM'}</h4>
            <p>{info.billFrom.phone}</p>
            <p>{info.billFrom.email}</p>
            <p>{info.billFrom.address}</p>

            </Col>
            <Col>
              <h4 className="fw-bold">{info.billTo.name || 'BILLED TO'}</h4>
              <p>{info.billTo.phone}</p>
              <p>{info.billTo.email}</p>
              <p>{info.billTo.address}</p>

            </Col>
         
          </Row>
          <Table bordered className="mb-3">
            <thead>
              <tr>
                <th className='text-CENTER'>DESC</th>
                <th className='text-CENTER'> QTY</th>
                <th className="text-CENTER">PRICE</th>
                <th className="text-CENTER">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className='text-center'>{item.name} - {item.description}</td>
                  <td className='text-CENTER'>{parseInt(item.quantity) || 0}</td>
                  <td className='text-CENTER'>{currency} {(parseFloat(item.price) || 0).toFixed(2)}</td>
                  <td className='text-CENTER'>{currency} {((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="text-end">
            <Col>
              <p>Subtotal: {currency} {totals.subTotal.toFixed(2)}</p>
              <p>Tax: {currency} {totals.taxAmount.toFixed(2)}</p>
              <p>Discount: {currency} {totals.discountAmount.toFixed(2)}</p>
              <h5>Total: {currency} {totals.total.toFixed(2)}</h5>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={generatePDF}>
          <BiCloudDownload className="me-2" /> Download PDF
        </Button>
        <Button variant="secondary" onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
