import React, { useState, useRef } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import "bootstrap/dist/css/bootstrap.min.css";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "00001",
    dateOfIssue: "",
    dueDate: "",
    billTo: { name: "", address: "", phone: "", email: "" },
    billFrom: {
      name: "",
      address: "",
      zip: "",
      phone: "",
      email: "",
      website: "",
      taxId: ""
    },
    items: [{ id: 1, name: "", description: "", price: 0.0, quantity: 1 }],
    taxRate: 0,
    discount: 0,
    currency: "INR",
    subTotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
 
  });

  const calculateTotal = () => {
    setInvoiceData((prevState) => {
      let subTotal = prevState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let taxAmount = (subTotal * prevState.taxRate) / 100;
      let discountAmount = (subTotal * prevState.discount) / 100;
      let total = subTotal + taxAmount - discountAmount;
      return { ...prevState, subTotal, taxAmount, discountAmount, total };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevState) => ({ ...prevState, [name]: value }));
    
    if (name === "taxRate" || name === "discount") {
      calculateTotal();
    }
  };

  const handleBillChange = (e, type) => {
    const { name, value } = e.target;
    setInvoiceData((prevState) => ({
      ...prevState,
      [type]: { ...prevState[type], [name]: value }
    }));
  };

  const handleItemChange = (event) => {
    const { name, value, id } = event.target;
    setInvoiceData((prevState) => {
      const updatedItems = prevState.items.map((item) =>
        item.id.toString() === id ? { ...item, [name]: value } : item
      );
      return { ...prevState, items: updatedItems };
    });
    calculateTotal();
  };

  const addItem = () => {
    setInvoiceData((prevState) => ({
      ...prevState,
      items: [...prevState.items, { id: Date.now(), name: "", description: "", price: 0.0, quantity: 1 }]
    }));
    calculateTotal();
  };

  const removeItem = (itemToRemove) => {
    setInvoiceData((prevState) => ({
      ...prevState,
      items: prevState.items.filter((item) => item.id !== itemToRemove.id)
    }));
    calculateTotal();
  };

  const invoiceRef = useRef();
  // eslint-disable-next-line
  const handlePrint = useReactToPrint({ content: () => invoiceRef.current });

  const openModal = (event) => {
    event.preventDefault();
    calculateTotal();
    setInvoiceData((prevState) => ({ ...prevState, isOpen: true }));
  };

  const closeModal = () => setInvoiceData((prevState) => ({ ...prevState, isOpen: false }));

  return (
    <div className="p-4 shadow-lg" style={{ maxWidth: "800px", margin: "auto", background: "white" }}>
      <h3 className="mb-3">Invoice</h3>
      <Row>
        <Col md={6}>
          <Form.Label>Invoice Number</Form.Label>
          <Form.Control name="invoiceNumber" value={invoiceData.invoiceNumber} onChange={handleChange} placeholder="Invoice Number" />
          <Form.Label>Date Of Issue</Form.Label>
          <Form.Control type="date" name="dateOfIssue" value={invoiceData.dateOfIssue} onChange={handleChange} className="mt-2" />
          <Form.Label>Due Date</Form.Label>
          <Form.Control type="date" name="dueDate" value={invoiceData.dueDate} onChange={handleChange} className="mt-2" placeholder="Due Date" />
        </Col>
      </Row>
      <Row className="border-top pt-3">
        <Col md={6}>
          <h6>BILLED TO</h6>
          <Form.Control name="name" value={invoiceData.billTo.name} onChange={(e) => handleBillChange(e, 'billTo')} placeholder="Client Name" />
          <Form.Control name="address" value={invoiceData.billTo.address} onChange={(e) => handleBillChange(e, 'billTo')} placeholder="Address" />
           <Form.Control name="phone" value={invoiceData.billTo.phone} onChange={(e) => handleBillChange(e, 'billTo')} placeholder="Phone" />
          <Form.Control name="email" value={invoiceData.billTo.email} onChange={(e) => handleBillChange(e, 'billTo')} placeholder="Email" />
        </Col>
        <Col md={6}>
          <h6>BILLED FROM</h6>
          <Form.Control name="name" value={invoiceData.billFrom.name} onChange={(e) => handleBillChange(e, 'billFrom')} placeholder="Company Name" />
          <Form.Control name="address" value={invoiceData.billFrom.address} onChange={(e) => handleBillChange(e, 'billFrom')} placeholder="Address" />
          <Form.Control name="phone" value={invoiceData.billFrom.phone} onChange={(e) => handleBillChange(e, 'billFrom')} placeholder="Phone" />
          <Form.Control name="email" value={invoiceData.billFrom.email} onChange={(e) => handleBillChange(e, 'billFrom')} placeholder="Email" />

        </Col>
      </Row>
      <InvoiceItem items={invoiceData.items} onItemizedItemEdit={handleItemChange} onRowAdd={addItem} onRowDel={removeItem} currency={invoiceData.currency} />
      <Row className="mt-3">
        <Col>
          <Form.Label>Tax Rate (%)</Form.Label>
          <Form.Control type="number" name="taxRate" value={invoiceData.taxRate} onChange={handleChange} />
        </Col>
        <Col>
          <Form.Label>Discount (%)</Form.Label>
          <Form.Control type="number" name="discount" value={invoiceData.discount} onChange={handleChange} />
        </Col>
      </Row>
      <Row className="mt-3 text-end">
        <Col>
          <h5>Subtotal: {invoiceData.currency} {invoiceData.subTotal.toFixed(2)}</h5>
          <h5>Tax: {invoiceData.currency} {invoiceData.taxAmount.toFixed(2)}</h5>
          <h5>Discount: {invoiceData.currency} {invoiceData.discountAmount.toFixed(2)}</h5>
          <h4>Total: {invoiceData.currency} {invoiceData.total.toFixed(2)}</h4>
        </Col>
      </Row>
      <Button variant="primary" className="mt-3 w-100" onClick={openModal}>Preview & Generate PDF</Button>
      <InvoiceModal showModal={invoiceData.isOpen} closeModal={closeModal} info={invoiceData} items={invoiceData.items} currency={invoiceData.currency} />
    </div>
  );
};

export default InvoiceForm;
